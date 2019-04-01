import { MutationOptions } from './options';
import { Wrapper } from './wrapper';
import { Buoy } from '../buoy';
import { isFunction, scope } from 'ngx-plumber';
import { Observable } from 'rxjs';

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

    public execute(): Observable<any> {
        return new Observable<any>(observer => {
            // TODO Implement Optimistic UI (#16)

            this._buoy.apollo.mutate({
                mutation: this._gqlMutation,
                variables: this._variables,
            }).toPromise().then(
                (success) => {
                    observer.next(this.mapResponse(success));
                    observer.complete();
                    // resolve(this.mapResponse(success));
                },
                (error) => {
                    observer.error({
                        graphQl: error.graphQLErrors,
                        network: error.networkError
                    });
                }
            );
        });
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
