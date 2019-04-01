import { MutationOptions, QueryOptions } from '../wrappers/options';
import { Document } from 'graphql';

export interface QueryManipulator {
    /**
     * Manipulate a GraphQL query or mutation before it is executed.
     */
    manipulateQuery(query: Document, variables: any, options: QueryOptions|MutationOptions): Document;
}
