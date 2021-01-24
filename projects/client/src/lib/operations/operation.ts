import { Buoy } from '../buoy';
import { isFunction } from 'ngx-plumber';
import { print } from 'graphql/language/printer';
import { DocumentNode } from 'graphql';

export class Operation {
    protected _apolloOperation;

    constructor(
        public _buoy: Buoy,
        public _id: number,
        public _query: DocumentNode,
        public _variables,
        public _options,
        public _operationType: 'query' | 'mutation' | 'subscription'
    ) {
        // Handle operation name
        this._query = this.handleOperationName();

        // Run middleware
        this.handleMiddleware();
    }

    /**
     * Handle middleware for the operation.
     */
    protected handleMiddleware(): void {
        this._buoy.middleware.forEach((middleware: any) => {
            switch (this._operationType) {
                case 'query':
                    if (isFunction(middleware.manipulateQuery)) {
                        // TODO Check response from middleware
                        this._query = middleware.manipulateQuery(this._query, this._variables, this._options);
                    }
                    break;

                case 'mutation':
                    if (isFunction(middleware.manipulateMutation)) {
                        // TODO Check response from middleware
                        this._query = middleware.manipulateMutation(this._query, this._variables, this._options);
                    }
                    break;

                case 'subscription':
                    // TODO
                    break;
            }
        });
    }

    /**
     * Get the variables for the operation.
     */
    protected getVariables(): any {
        let variables = this._variables;

        // Run VariableManipulator middleware
        this._buoy.middleware.forEach((middleware: any) => {
            if (isFunction(middleware.manipulateVariables)) {
                // TODO Check response from middleware
                variables = middleware.manipulateVariables(this._query, variables, this._options);
            }
        });

        return variables;
    }

    /**
     * Get the query for the operation.
     */
    public getQuery(): DocumentNode {
        return this._query;
    }

    /**
     * Get the fetch policy for the operation.
     */
    protected getFetchPolicy() {
        return typeof this._options.fetchPolicy !== 'undefined' ? this._options.fetchPolicy : 'cache-first';
    }

    /**
     * Check if the query has a
     */
    protected handleOperationName() {
        return this._query; // TODO
    }

    protected operationError(error): void {
        // TODO Create custom error for this!
        throw new Error(
            `
Buoy encountered an error.
Operation #${this._id} is invalid: ${error.message}, on line ${error.locations[0].line}:${error.locations[0].column}

Operation:
${print(this.getQuery())}

Variables:
${JSON.stringify(this.getVariables())}

Raw variables (no middleware or extensions):
${JSON.stringify(this._variables)}
`
        );
    }
}
