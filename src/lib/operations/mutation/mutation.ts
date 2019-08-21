import { Wrapper } from '../wrapper';
import { Buoy } from '../../buoy';
import { isFunction, scope } from 'ngx-plumber';
import { MutationOptions } from './mutation-options';
import { MutationResult } from './mutation-result';
import { MutationError } from './mutation-error';

export class Mutation implements Wrapper {
    constructor(
        public _buoy: Buoy,
        public _id: number,
        private _gqlMutation,
        private _variables,
        protected _options: MutationOptions
    ) {
        this._gqlMutation = this.mutation;
        this._variables = this.variables;
        return this;
    }

    public execute(): Promise<MutationResult|MutationError> {
        return new Promise<MutationResult|MutationError>(((resolve, reject) => {
            // TODO Implement Optimistic UI (#16)

            this._buoy.apollo.mutate({
                mutation: this._gqlMutation,
                variables: this._variables,
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

    private get variables() {
        // Get user defined variables
        let variables = this._variables;

        // Run VariableManipulator middleware
        this._buoy._middleware.forEach((middleware: any) => {
            if (isFunction(middleware.manipulateVariables)) {
                // TODO Check response from middleware
                variables = middleware.manipulateVariables(this._gqlMutation, variables, this._options);
            }
        });

        return variables;
    }

    private get mutation() {
        let mutation = this._gqlMutation;
        // Run QueryManipulator middleware
        this._buoy._middleware.forEach((middleware: any) => {
            if (isFunction(middleware.manipulateQuery)) {
                // TODO Check response from middleware
                mutation = middleware.manipulateQuery(mutation, this._variables, this._options);
            }
        });

        return mutation;
    }
}
