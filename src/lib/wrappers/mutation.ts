import { MutationOptions } from './options';
import { Wrapper } from './wrapper';
import { Buoy } from '../buoy';
import { scope } from 'ngx-plumber';
import { Observable } from 'rxjs';

export class Mutation implements Wrapper {
    constructor(
        public _buoy: Buoy,
        public _id: number,
        private _gqlMutation,
        private _variables,
        protected _options: MutationOptions
    ) {
        return this;
    }

    public execute(): Observable<any> {
        return new Observable<any>(observer => {
            // TODO Implement Optimistic UI (#16)

            this._buoy.apollo.mutate({
                mutation: this._gqlMutation,
                variables: this.variables,
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

        // Run middleware
        this._buoy._config.middleware.forEach((middleware) => {
            // TODO Make sure that the method exists on the Middleware class
            variables = new middleware(this._buoy).manipulateVariables(this._gqlMutation, variables, this._options);
        });

        return variables;
    }
}
