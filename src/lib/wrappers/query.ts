import { QueryOptions } from './options';
import { Observable } from 'rxjs';
import { isFunction, scope } from 'ngx-plumber';
import { Buoy } from '../buoy';
import { Wrapper } from './wrapper';

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
    public execute(): Observable<any> {
        return new Observable<any>(observer => {
            console.log('BUOY Q INIT');
            this._buoy.apollo.query({
                query: this._query,
                variables: this._variables,
                errorPolicy: 'all',
                fetchResults: true
            }).toPromise().then(
                (response) => {
                    console.log('BUOY RESP', response);

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
                        observer.next(this.mapResponse(response));
                        observer.complete();
                    } else {
                        observer.error({
                            data: response.data ? response.data : null,
                            // extensions: response.extensions
                        });
                    }
                },
                (error) => {
                    throw new Error(error);
                    observer.error({
                        // graphQl: error.graphQLErrors,
                        // network: error.networkError,
                        data: {},
                        extensions: {}
                    });
                }
            );
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
