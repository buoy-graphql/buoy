import { scope } from 'ngx-plumber';
import { Buoy } from '../../buoy';
import { QueryResult } from './query-result';
import { QueryError } from './query-error';
import { Operation } from '../operation';
import { QueryOptions } from './query-options';

export class Query extends Operation {
    public data: any;

    public loading = true;

    constructor(
        buoy: Buoy,
        id: number,
        query,
        variables,
        options: QueryOptions
    ) {
        super(buoy, id, query, variables, options, 'query');

        return this;
    }

    /**
     * Execute the query and return an observable.
     */
    public execute(): Promise<QueryResult|QueryError> {
        return new Promise<QueryResult|QueryError>((resolve, reject) => {
            this._buoy.apollo.query({
                query: this.getQuery(),
                variables: this.getVariables(),
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

    private mapResponse(data): any {
        return scope(data.data, this._options.scope);
    }
}
