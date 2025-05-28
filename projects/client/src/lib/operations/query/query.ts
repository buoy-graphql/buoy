import { scope } from 'ngx-plumber';
import { Buoy } from '../../buoy';
import { QueryResult } from './query-result';
import { QueryError } from './query-error';
import { Operation } from '../operation';
import { QueryOptions } from './query-options';
import { firstValueFrom } from 'rxjs';

export class Query<T = any> extends Operation {
    declare public readonly _options: QueryOptions;

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
    public async execute(): Promise<QueryResult|QueryError> {
        const response = await firstValueFrom(this._buoy.apollo.use('buoy').query({
            query: this.getQuery(),
            variables: this.getVariables(),
            fetchPolicy: this._options.fetchPolicy ?? this._buoy.config.defaultQueryFetchPolicy,
            errorPolicy: 'all',
        }));

        if (response.errors && response.errors.length > 0) {
            for (const error of response.errors) {
                // If no category nor validation is set, we assume that the error should be thrown.
                if (!error.extensions.category && !error.extensions.validation) {
                    this.operationError(error);
                }
            }

            return new QueryError<T>(this.mapResponse(response.data), response.errors);
        }

        return new QueryResult<T>(this.mapResponse(response));
    }

    private mapResponse(data): any {
        return scope(data.data, this._options.scope);
    }
}
