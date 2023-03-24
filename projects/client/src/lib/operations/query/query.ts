import { scope } from 'ngx-plumber';
import { Buoy } from '../../buoy';
import { QueryResult } from './query-result';
import { QueryError } from './query-error';
import { Operation } from '../operation';
import { QueryOptions } from './query-options';
import { OptionsService } from '../../internal/options.service';

export class Query<T = any> extends Operation {
    public data: any;

    public loading = true;

    constructor(
        buoy: Buoy,
        globalOptions: OptionsService,
        id: number,
        query,
        variables,
        options: QueryOptions
    ) {
        super(buoy, globalOptions, id, query, variables, options, 'query');

        return this;
    }

    /**
     * Execute the query and return an observable.
     */
    public execute(): Promise<QueryResult|QueryError> {
        return new Promise<QueryResult|QueryError>((resolve, reject) => {
            this._buoy.apollo.use('buoy').query({
                query: this.getQuery(),
                variables: this.getVariables(),
                fetchPolicy: this._options.fetchPolicy ?? this._globalOptions.values.defaultFetchPolicy,
                errorPolicy: 'all',
            }).toPromise().then(
                (response) => {
                    if (typeof response.errors === 'undefined') {
                        response.errors = [];
                    }

                    for (const error of response.errors) {
                        if (error.extensions.category === 'graphql') {
                            this.operationError(error);
                        }
                    }

                    if (response.errors.length === 0) {
                        resolve(new QueryResult<T>(this.mapResponse(response)));
                    } else {
                        reject(new QueryError<T>(response.data ? response.data : null, ''));
                    }
                },
                (error) => {
                    throw new Error(error);
                    reject(new QueryError<null>(
                        null,
                        {
                            // graphQl: error.graphQLErrors,
                            // network: error.networkError,
                            data: {},
                            extensions: {}
                        }
                    ));
                }
            );
        });
    }

    private mapResponse(data): any {
        return scope(data.data, this._options.scope);
    }
}
