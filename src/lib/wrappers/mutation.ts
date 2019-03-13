import { MutationOptions } from './options';
import { Wrapper } from './wrapper';
import { Buoy } from '../buoy';
import { scope } from 'ngx-plumber';

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

    public toPromise(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this._buoy.apollo.mutate({
                mutation: this._gqlMutation,
                variables: this.variables
            }).toPromise().then(
                (success) => {
                    resolve(this.mapResponse(success));
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    private mapResponse(data): any {
        return data = scope(data.data, this._options.scope);
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
