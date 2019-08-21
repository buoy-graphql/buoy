import { Document } from 'graphql';
import { QueryOptions } from '../operations/query/query-options';
import { WatchQueryOptions } from '../operations/watch-query/watch-query-options';
import { MutationOptions } from '../operations/mutation/mutation-options';

export interface VariableManipulator {
    /**
     * Manipulate a GraphQL query or mutation's variables before the query is executed.
     */
    manipulateVariables(query: Document, variables: any, options: QueryOptions|WatchQueryOptions|MutationOptions): any;
}
