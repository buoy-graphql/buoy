import { isFunction, scope } from 'ngx-plumber';
import { Buoy } from '../../buoy';
import { Wrapper } from '../wrapper';
import { QueryResult } from './query-result';
import { QueryError } from './query-error';
import { QueryOptions } from './query-options';

export class Query implements Wrapper {
    public data: any;

    public loading = true;

    constructor(
        public _buoy: Buoy,
        public _id: number,
        protected _query,
        public _variables,
        protected _options: QueryOptions
    ) {
        // Run QueryManipulator middleware
        this._buoy._middleware.forEach((middleware: any) => {
            if (isFunction(middleware.manipulateQuery)) {
                // TODO Check response from middleware
                this._query = middleware.manipulateQuery(this._query, this._variables, this._options);
            }
        });

        return this;
    }

    /**
     * Execute the query and return an observable.
     */
    public execute(): Promise<QueryResult|QueryError> {
        return new Promise<QueryResult|QueryError>((resolve, reject) => {
            this._buoy.apollo.query({
                query: this._query,
                variables: this._variables,
                errorPolicy: 'all',
                fetchResults: true
            }).toPromise().then(
                (response) => {
                if (typeof response.errors === 'undefined') {
                    response.errors = [];
                }

                for (const error of response.errors) {
                    if (error.extensions.category === 'graphql') {
                        throw new Error(
                            '[Buoy :: GraphQL error]: ${error.message}, on line ' +
                            `${error.locations[0].line}:${error.locations[0].column}.`,
                        );
                    }
                }

                if (response.errors.length === 0) {
                    resolve(new QueryResult(this.mapResponse(response)));
                } else {
                    reject(new QueryError(response.data ? response.data : null, ''));
                }
            },
            (error) => {
                throw new Error(error);
                reject(new QueryError(
                    null,
                    {
                        // graphQl: error.graphQLErrors,
                        // network: error.networkError,
                        data: {},
                        extensions: {}
                    }
                ));
            });
        });
    }

    protected get variables() {
        let variables = {};

        // Run VariableManipulator middleware
        this._buoy._middleware.forEach((middleware: any) => {
            if (isFunction(middleware.manipulateVariables)) {
                // TODO Check response from middleware
                variables = middleware.manipulateVariables(this._query, variables, this._options);
            }
        });

        return variables;
    }

    private mapResponse(data): any {
        return scope(data.data, this._options.scope);
    }
}
