import {QueryOptions} from '../wrappers/options';

export interface VariableManipulator {
    /**
     * Manipulate a GraphQL query or mutation's variables before the query is executed.
     */
    manipulateVariables(query: any, variables: any, options: QueryOptions): any;
}
