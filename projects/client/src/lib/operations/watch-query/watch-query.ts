import { BehaviorSubject, firstValueFrom, Subscription } from 'rxjs';
import { scope } from 'ngx-plumber';
import { Buoy } from '../../buoy';
import { Pagination } from './pagination';
import { WatchQueryOptions } from './watch-query-options';
import { Operation } from '../operation';
import { Subscription as BuoySubscription } from '../subscription/subscription';
import { DocumentNode, print, parse } from 'graphql';
import { DetectDirectives, DirectiveLocation } from './detect-directives';
import { ConvertQueryToSubscription } from './convert-query-to-subscription';
import { CleanQuery } from './clean-query';

export class WatchQuery<T = any> extends Operation {
    declare public readonly _options: WatchQueryOptions;

    protected _apolloSubscription: Subscription;
    private _pagination: Pagination;

    private _subscription: BuoySubscription;

    public _apolloInitialized = new BehaviorSubject(false);

    public data: T;

    /**
     * Whether the WatchQuery is currently loading.
     */
    public loading = true;

    /**
     * Is the WatchQuery ready?
     * By default, this will mirror the value of `loading`, but it is possible to set this value to false and have
     * it change back to true, when the next fetch has finished.
     */
    public ready = false;

    public observe = {
        data: new BehaviorSubject<T>(null),
        ready: new BehaviorSubject<boolean>(false),
    };

    constructor(
        buoy: Buoy,
        id: number,
        query,
        variables,
        options: WatchQueryOptions
    ) {
        super(buoy, id, query, variables, options, 'query');
        query = parse(print(super.getQuery()).replace(/@skipSubscription/g, ''));
        // Init QueryPagination
        if (this.paginationEnabled) {
            this._pagination = new Pagination(this, query, this._options, this._variables);
        }

        if (this._options.fetch !== false) {
            this.initQuery();
        }

        return this;
    }

    public get pagination(): any {
        return this._pagination.pagination;
    }

    public async refetch(): Promise<void> {
        this.loading = true;
        if (this._apolloInitialized.value === false) {
            if (this._options.fetch === false) {
                await this.initQuery();
            } else {
                await firstValueFrom(this._apolloInitialized);
                await this.doRefetch();
                this._subscription?.refetch();
            }
        } else {
            await this.doRefetch();
            this._subscription?.refetch();
        }
    }

    private async doRefetch(): Promise<void> {
        this.emitOnLoadingStart();
        this.loading = true;
        await this._apolloOperation.refetch(this.getVariables());
        this.loading = false;
    }

    /**
     * Set variable value.
     */
    public setVariable(variable: string, value: any): this {
        this._variables[variable] = value;

        if (this._subscription) {
            this._subscription.setVariable(variable, value);
        }

        return this;
    }

    /**
     * Go to the previous page.
     */
    public prevPave(refetch = true, paginator?: string): this {
        if (!this.paginationEnabled) {
            throw new Error('Pagination must be enabled before the page can be changed.');
        }
        if (refetch === true && this._pagination.prevPage(paginator)) {
            this.refetch();
        }

        return this;
    }

    /**
     * Go the the next page.
     */
    public nextPage(refetch = true, paginator?: string): this {
        if (!this.paginationEnabled) {
            throw new Error('Pagination must be enabled before the page can be changed.');
        }
        if (refetch === true && this._pagination.nextPage(paginator)) {
            this.refetch();
        }

        return this;
    }

    /**
     * Set the page.
     */
    public setPage(page: number, refetch = true, paginator?: string, checkPageAvailability = true): this {
        if (!this.paginationEnabled) {
            throw new Error('Pagination must be enabled before the page can be changed.');
        }
        if (refetch === true && this._pagination.setPage(page, paginator, checkPageAvailability)) {
            this.refetch();
        }

        return this;
    }

    /**
     * Set the limit.
     */
    public setLimit(limit: number, refetch = true, paginator?: string): this {
        if (!this.paginationEnabled) {
            throw new Error('Pagination must be enabled before the limit can be changed.');
        }
        this._pagination.setLimit(limit, paginator);

        if (refetch === true) {
            this.refetch();
        }

        return this;
    }

    /**
     * Destroy the Query.
     */
    public destroy(): void {
        this._subscription?.destroy();

        if (this._pagination) {
            this._pagination.destroy();
        }

        this._apolloSubscription?.unsubscribe();
    }

    /**
     * @deprecated
     */
    public reset(): void {
        // Hotfix to trigger Angular's listeners.
        for (const key of Object.keys(this.data)) {
            delete this.data[key];
        }
    }

    public getVariables(): any {
        if (this.paginationEnabled) {
            // Inject variables from Pagination
            return Object.assign(super.getVariables(), this._pagination.variables);
        }

        return super.getVariables();
    }

    protected async initQuery(): Promise<void> {
        const query = parse(print((new CleanQuery(this)).get()).replace(/@skipSubscription/g, ''));

        // Set up the Apollo observable
        this._apolloOperation = this._buoy.apollo.use('buoy').watchQuery({
            query,
            variables: this.getVariables(),
            fetchPolicy: this._options.fetchPolicy ?? this._buoy.config.defaultWatchQueryFetchPolicy,
            notifyOnNetworkStatusChange: true,
            errorPolicy: this._options.errorPolicy ?? 'all',
        });

        // Emit loading start event
        this.emitOnLoadingStart();

        // Track whether we’ve already initialized to prevent multiple inits
        let initialized = false;

        // Single Apollo subscription
        this._apolloSubscription = this._apolloOperation.valueChanges.subscribe(({ data, loading }) => {
            this.mapResponse(data, loading);

            // Emit initialization only once
            if (!initialized) {
                initialized = true;
                this.emitOnInitialized();
            }
        });

        // Handle directive-based subscriptions
        const detected = (new DetectDirectives(this)).detect();
        detected.directives.forEach((directive, index) => {
            if (directive.directive === 'subscribe') {
                this.subscribe(directive, index);
            }
        });

        // Wait for first response before proceeding
        await firstValueFrom(this._apolloOperation.valueChanges);
    }

    protected mapResponse(data, loading): void {
        // Set loading
        this.loading = loading; // TODO Necessary?

        if (this.paginationEnabled) {
            this._pagination.readPaginationFromResponse(data);
        }

        // Set data
        this.data = scope(data, this._options.scope);
        this.observe.data.next(this.data);

        this.emitOnLoadingFinish();
        this.emitOnChange();

        if (!this.loading) {
            this.ready = true;
            this.observe.ready.next(true);
        }
    }

    /**
     * Check if pagination is enabled.
     */
    protected get paginationEnabled(): boolean {
        return typeof this._options.pagination !== 'undefined' && this._options.pagination !== false;
    }

    public getQuery(): DocumentNode {
        return this.paginationEnabled ? this._pagination.query : super.getQuery();
    }

    private emitOnInitialized(): void {
        if (typeof this._options.onInitialized !== 'undefined') {
            this._options.onInitialized(this._id);
        }
    }

    private emitOnLimitChange(paginator, limit): void {
        // TODO
    }

    private emitOnPageChange(paginator, page): void {
        // TODO
    }

    private emitOnLoadingStart(): void {
        if (typeof this._options.onLoadingStart !== 'undefined') {
            this._options.onLoadingStart(this._id);
        }
    }

    private emitOnLoadingFinish(): void {
        if (typeof this._options.onLoadingFinish !== 'undefined') {
            this._options.onLoadingFinish(this._id);
        }
    }

    private emitOnChange(): void {
        if (typeof this._options.onChange !== 'undefined') {
            this._options.onChange(this._id, this.data);
        }
    }

    private subscribe(directive: DirectiveLocation, index: number): void {
        const subscription = (new ConvertQueryToSubscription(this, directive, index, this._apolloOperation.obsQuery.queryName)).convert();

        this._subscription = this._buoy.subscribe(
            subscription.query,
            subscription.variables,
            {
                onEvent: (id, data) => {
                    // Only update data if paginated - single model queries are automatically updated by the Apollo cache
                    if (subscription.paginated) {
                        // TODO Optionally refetch query if models are created/deleted. Updates are automatically applied
                    }

                    // TODO Call various callbacks
                }
            }
        );
    }

    /**
     * Reset the ready-state.
     */
    public resetReady(): this {
        this.ready = false;
        this.observe.ready.next(false);

        return this;
    }
}
