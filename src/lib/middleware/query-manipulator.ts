import { Document } from 'graphql';
import { QueryOptions } from '../operations/query/query-options';
import { WatchQueryOptions } from '../operations/watch-query/watch-query-options';
import { MutationOptions } from '../operations/mutation/mutation-options';

export interface QueryManipulator {
    /**
     * Manipulate a GraphQL query or mutation before it is executed.
     */
    manipulateQuery(query: Document, variables: any, options: QueryOptions|WatchQueryOptions|MutationOptions): Document;
}
