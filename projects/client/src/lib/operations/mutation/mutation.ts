import { Buoy } from '../../buoy';
import { scope } from 'ngx-plumber';
import { MutationOptions } from './mutation-options';
import { MutationResult } from './mutation-result';
import { MutationError } from './mutation-error';
import { Operation } from '../operation';
import { OptionsService } from '../../internal/options.service';

export class Mutation extends Operation {
    constructor(
        buoy: Buoy,
        globalOptions: OptionsService,
        id: number,
        query,
        variables,
        options: MutationOptions
    ) {
        super(buoy, globalOptions, id, query, variables, options, 'mutation');
    }

    public execute(): Promise<MutationResult|MutationError> {
        return new Promise<MutationResult|MutationError>(((resolve, reject) => {
            // TODO Implement Optimistic UI (#16)

            this._buoy.apollo.use('buoy').mutate({
                mutation: this.getQuery(),
                variables: this.getVariables(),
                errorPolicy: 'all',
                update: (cache, mutationResult) => {
                    if (typeof this._options.update !== 'undefined') {
                        this._options.update(cache, mutationResult, this.getQuery());
                    }
                },
                fetchPolicy: this._options.fetchPolicy ?? this._globalOptions.values.defaultMutationFetchPolicy
            }).toPromise().then(
                (response) => {
                    if (typeof response.errors === 'undefined') {
                        response['errors'] = [];
                    }

                    for (const error of response.errors) {
                        if (error.extensions.category === 'graphql') {
                            this.operationError(error);
                        }
                    }

                    if (response.errors.length === 0) {
                        resolve(new MutationResult(this.mapResponse(response)));
                    } else {
                        reject(new MutationError(
                            response.data ? response.data : null,
                            response.extensions
                        ));
                    }
                },
                (error) => {
                    reject(new MutationError(
                        null,
                        error
                    ));
                }
            );
        }));
    }

    private mapResponse(data): any {
        return scope(data.data, this._options.scope);
    }
}
