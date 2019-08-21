import { BehaviorSubject, Subscription } from 'rxjs';
import { isFunction, scope } from 'ngx-plumber';
import { Buoy } from '../../buoy';
import { Pagination } from './pagination';
import { OnChangeEvent } from '../../events/on-change.event';
import { WatchQueryOptions } from './watch-query-options';
import { WatchQuerySubscription } from './watch-query-subscription';
import { Operation } from '../operation';


export class WatchQuery extends Operation {
    protected _apolloSubscription: Subscription;
    private _pagination: Pagination;

    /**
     * Contains the Buoy Subscription
     */
    protected subscription: WatchQuerySubscription;

    public _apolloInitialized = new BehaviorSubject(false);
    public _operationInitialized = new BehaviorSubject(false);

    public data: any;

    public loading = true;

    constructor(
        buoy: Buoy,
        id: number,
        query,
        variables,
        options: WatchQueryOptions
    ) {
        super(buoy, id, query, variables, options, 'query');

        // Init QueryPagination
        if (this.paginationEnabled) {
            this._pagination = new Pagination(this, super.getQuery(), this._options, this._variables);
        }

        if (this._options.fetch !== false) {
            this.initQuery();
        }

        if (this._options.subscribe !== false) {
            // this.subscription = new WatchQuerySubscription(this.getQuery()); // TODO
        }

        // Mark this operations as initialized.
        setTimeout(() => {
            this._operationInitialized.next(true);
        }, 0);

        return this;
    }

    public get pagination(): any {
        return this._pagination.pagination;
    }

    public refetch(): this {
        this.loading = true;
        if (this._apolloInitialized.value === false) {
            if (this._options.fetch === false) {
                this.initQuery();
            } else {
                this._apolloInitialized.toPromise().then(initialized => {
                    this.doRefetch();
                });
            }
        } else {
            this.doRefetch();
        }

        return this;
    }

    private doRefetch() {
        this._apolloOperation.refetch(this.getVariables()).then(
            (success) => {
                this.loading = false;
            },
            (error) => {
                this.loading = false;
            }
        );
    }

    /**
     * Set variable value.
     */
    public setVariable(variable: string, value: any): this {
        this._variables[variable] = value;

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
    public setPage(page: number, refetch = true, paginator?: string): this {
        if (!this.paginationEnabled) {
            throw new Error('Pagination must be enabled before the page can be changed.');
        }
        if (refetch === true && this._pagination.setPage(page, paginator)) {
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
        this._pagination.destroy();
        this._apolloSubscription.unsubscribe();
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

    protected getVariables() {
        if (this.paginationEnabled) {
            // Inject variables from Pagination
            return Object.assign(super.getVariables(), this._pagination.variables);
        }

        return super.getVariables;
    }

    protected initQuery() {
        this._apolloOperation = this._buoy.apollo.watchQuery({
            query: this.getQuery(),
            variables: this.getVariables(),
            fetchPolicy: typeof this._options.fetchPolicy !== 'undefined' ? this._options.fetchPolicy : 'cache-first'
        });

        // Subscribe to changes
        this._apolloSubscription = this._apolloOperation.valueChanges.subscribe((data) => this.mapResponse(data, 'http'));

        this._apolloInitialized.next(true);
    }

    protected mapResponse(data, mode: 'http' | 'ws'): void {
        // Set loading
        this.loading = data.loading; // TODO Necessary?

        if (this.paginationEnabled){
            this._pagination.readPaginationFromResponse(data);
        }

        // Set data
        this.data = scope(data.data, this._options.scope);

        // OnChange event
        if (typeof this._options.onChange !== 'undefined') {
            this._options.onChange(new OnChangeEvent(this.data));
        }
    }

    /**
     * Check if pagination is enabled.
     */
    protected get paginationEnabled(): boolean {
        return typeof this._options.pagination !== 'undefined' && this._options.pagination !== false;
    }

    protected getQuery() {
        return this.paginationEnabled ? this._pagination.query : super.getQuery();
    }
}
