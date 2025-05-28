import { Buoy } from '../../buoy';
import { scope } from 'ngx-plumber';
import { MutationOptions } from './mutation-options';
import { MutationResult } from './mutation-result';
import { MutationError } from './mutation-error';
import { Operation } from '../operation';
import { firstValueFrom } from 'rxjs';

export class Mutation<T = any> extends Operation {
    declare public readonly _options: MutationOptions;

    constructor(
        buoy: Buoy,
        id: number,
        query,
        variables,
        options: MutationOptions
    ) {
        super(buoy, id, query, variables, options, 'mutation');
    }

    public async execute(): Promise<MutationResult<T>|MutationError<T>> {
        const response = await firstValueFrom(this._buoy.apollo.use('buoy').mutate({
            mutation: this.getQuery(),
            variables: this.getVariables(),
            errorPolicy: 'all',
            update: (cache, mutationResult) => {
                if (typeof this._options.update !== 'undefined') {
                    this._options.update(cache, mutationResult, this.getQuery());
                }
            },
            fetchPolicy: this._options.fetchPolicy ?? this._buoy.config.defaultMutationFetchPolicy
        }));

        if (response.errors && response.errors.length > 0) {
            return new MutationError<T>(this.mapResponse(response), response.errors, response.extensions);
        }

        return new MutationResult<T>(this.mapResponse(response), response.extensions);
    }

    private mapResponse(data): any {
        return scope(data.data, this._options.scope);
    }
}
