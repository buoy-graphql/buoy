import { Buoy } from '../../buoy';
import { scope } from 'ngx-plumber';
import { MutationOptions } from './mutation-options';
import { MutationResult } from './mutation-result';
import { MutationError } from './mutation-error';
import { Operation } from '../operation';

export class Mutation extends Operation {
    constructor(
        buoy: Buoy,
        id: number,
        query,
        variables,
        options: MutationOptions
    ) {
        super(buoy, id, query, variables, options, 'mutation');
    }

    public execute(): Promise<MutationResult|MutationError> {
        return new Promise<MutationResult|MutationError>(((resolve, reject) => {
            // TODO Implement Optimistic UI (#16)

            this._buoy.apollo.mutate({
                mutation: this.getQuery(),
                variables: this.getVariables(),
                errorPolicy: 'all'
            }).toPromise().then(
                (response) => {

                    if (typeof response.errors === 'undefined') {
                        response['errors'] = [];
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
