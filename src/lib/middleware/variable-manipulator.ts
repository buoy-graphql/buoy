import { QueryOptions } from '../wrappers/options';
import { Document } from 'graphql';

export interface VariableManipulator {
    /**
     * Manipulate a GraphQL query or mutation's variables before the query is executed.
     */
    manipulateVariables(query: Document, variables: any, options: QueryOptions): any;
}
