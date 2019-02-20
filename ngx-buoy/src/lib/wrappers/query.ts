import {Apollo, QueryRef} from 'apollo-angular';
import {map} from 'rxjs/internal/operators';
import {QueryOptions} from './options';
import {Subscription} from 'rxjs';
import {scope} from 'ngx-plumber';
import {Buoy} from '../buoy';
import {Wrapper} from './wrapper';

export class Query extends Wrapper {
    private _query;
    private _querySubscription: Subscription;

    private _configuration = {};
    private _variables = {};
    private _initialized = false;

    public data;
    public loading = true;

    constructor(buoy: Buoy, id: number, query, private _options: QueryOptions) {
        super(buoy, id, 'query');
        this.debug('debug', 'Initializing Query...');
        this._query = this.buoy.apollo.watchQuery({
            query: query,
            variables: this.variables
        });



        // Subscribe to changes
        this._querySubscription = this._query.valueChanges.subscribe((data) => this.mapResponse(data, 'http'));

        /*this.data = this._query.valueChanges.pipe(map(({data}) => {
            console.log('DATA RECEIVED', data);
            /*let scope = this._options.scope;
            if (this._options.pagination === true) {
                scope = this._options.scope + '.data';
            }*/
/*
            return data; // TODO //new ObjectScopePipe().transform(data, scope);
        }));

        /*this.pagination = this._query.valueChanges.pipe(map(({data}) => {
            return new ObjectScopePipe().transform(data, this._configuration.scope).paginatorInfo;
        }));*/

        this._initialized = true;

        this.debug('debug', 'Query initialized successfully.');
        return this;
    }

    public destroy(): void {
        alert('Destroyed query object.'); // TODO can Angular's built-in lifecycle hooks be used?
        this.debug('debug', 'Query has been destroyed.');
    }

    private get variables() {
        const variables = this._variables;

        /*if (this._configuration.injectAgreementId === true) {
            variables = Object.assign({
                agreementId: this.utecca.agreementId
            }, variables);
        }

        if (this._configuration.injectPagination === true) {
            variables = Object.assign({
                page: this._page,
                limit: this._configuration.limit
            }, variables);
        }*/

        return variables;
    }

    private applyOptions(options: QueryOptions): void {

    }

    private mapResponse(data, mode: 'http' | 'ws'): void {
        // Set loading
        this.loading = data.loading;

        // Set pagination (if enabled)
        // TODO

        // Set data
        this.data = scope(data.data, this._options.scope);

        this.debug(
            'debug',
            'Mapped response.',
            { input: data, output: this.data}
        );
    }

    public refetch(): this {
        this.debug('debug', 'Refecthing data...');
        if (this._initialized) {
            this._query.refetch(this.variables);
        }

        return this;
    }

    public setVariable(variable: string, value: any): this {
        this._variables[variable] = value;
        this.debug('debug', 'Variable ' + variable + ' has been set to:', value);
        return this;
    }
}
