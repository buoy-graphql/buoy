import { BehaviorSubject, Subscription } from 'rxjs';
import { scope } from 'ngx-plumber';
import { Buoy } from '../../buoy';
import { PaginatorOptions } from './paginator-options';
import { Operation } from '../operation';
import { DocumentNode } from 'graphql';
import { OptionsService } from '../../internal/options.service';
import { PaginatorInfo } from './paginator-info';
import { generateField } from '../../util/generate-field';

export class Paginator<T = any> extends Operation {
    public _apolloInitialized = new BehaviorSubject(false);

    public data: T;
    public paginatorInfo: PaginatorInfo;

    protected desiredPage = 1;
    protected desiredLimit = 25;

    protected _apolloSubscription: Subscription;

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
        globalOptions: OptionsService,
        id: number,
        query: DocumentNode,
        variables: object,
        options: PaginatorOptions
    ) {
        super(buoy, globalOptions, id, query, variables, options, 'query');
        this.injectPaginatorInfoInQuery();

        if (this._options.fetch !== false) {
            this.initQuery();
        }

        return this;
    }

    public get page(): number {
        return this.desiredPage;
    }

    public get limit(): number {
        return this.desiredLimit;
    }

    public setPage(page: number, refetch = true): this {
        this.desiredPage = page;
        this.setVariable('page', page);

        if (refetch) {
            this.refetch();
        }

        return this;
    }

    public setLimit(limit: number, refetch = true, goToFirstPage = true): this {
        this.desiredLimit = limit;
        this.setVariable('limit', limit);

        if (goToFirstPage) {
            this.setPage(1);
        }

        if (refetch) {
            this.refetch();
        }

        return this;
    }

    /**
     * Reset the ready-state.
     */
    public resetReady(): this {
        this.ready = false;
        this.observe.ready.next(false);

        return this;
    }

    public refetch(): this {
        this.loading = true;
        if (this._apolloInitialized.value === false) {
            if (this._options.fetch === false) {
                this.initQuery();
            } else {
                this._apolloInitialized.toPromise().then(initialized => this.doRefetch());
            }
        } else {
            this.doRefetch();
        }

        return this;
    }

    /**
     * Set variable value.
     */
    public setVariable(variable: string, value: any): this {
        this._variables[variable] = value;

        return this;
    }

    /**
     * Destroy the Query.
     */
    public destroy(): void {
        this._apolloSubscription?.unsubscribe();
    }

    /**
     * @deprecated
     */
    public reset(): void {
        // Hotfix to trigger Angular listeners.
        for (const key of Object.keys(this.data)) {
            delete this.data[key];
        }
    }

    protected initQuery(): void {
        this._apolloOperation = this._buoy.apollo.use('buoy').watchQuery({
            query: this._query,
            variables: this.getVariables(),
            fetchPolicy: this._options.fetchPolicy ?? this._globalOptions.values.defaultWatchQueryFetchPolicy,
            notifyOnNetworkStatusChange: true,
            errorPolicy: 'all',
        });

        // Subscribe to changes
        this._apolloSubscription = this._apolloOperation.valueChanges.subscribe(({data, loading}) => this.mapResponse(data, loading));

        this.emitOnLoadingStart();

        this._apolloInitialized.next(true);
        this.emitOnInitialized();
    }

    protected mapResponse(data, loading): void {
        // Set loading
        this.loading = loading; // TODO Necessary?

        // Set data
        this.data = scope(data, this._options.scope)?.data ?? this.data;
        this.paginatorInfo = scope(data, this._options.scope)?.paginatorInfo ?? this.paginatorInfo;

        if (!loading) {
            // Update observables
            this.observe.data.next(this.data);

            this.emitOnLoadingFinish();
            this.emitOnChange();

            if (!this.loading) {
                this.ready = true;
                this.observe.ready.next(true);
            }
        }
    }

    private emitOnInitialized(): void {
        if (typeof this._options.onInitialized !== 'undefined') {
            this._options.onInitialized(this._id);
        }
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

    private doRefetch(): void {
        this.emitOnLoadingStart();
        this.loading = true;
        this._apolloOperation.refetch(this.getVariables()).then(
            (success) => {
                this.loading = false;
            },
            (error) => {
                this.loading = false;
            }
        );
    }

    private injectPaginatorInfoInQuery(): void {
        const mainSelections = scope(this._query, 'definitions.0.selectionSet.selections.0.selectionSet.selections');
        const paginatorInfo = mainSelections.find(selection => selection.name.value === 'paginatorInfo');

        // Add the fields that must be returned by the server, in order to adhere to the PaginatorInfo interface.
        const mandatorySelections = [
            generateField('currentPage'),
            generateField('lastPage'),
            generateField('perPage'),
            generateField('total'),
        ];

        if (!paginatorInfo) {
            mainSelections.push(generateField('paginatorInfo', mandatorySelections));
        } else {
            // If the paginatorInfo is already present in the query, add the mandatory fields.
            paginatorInfo.selectionSet.selections.push(...mandatorySelections);
        }
    }
}
