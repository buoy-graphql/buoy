import { QueryOptions } from '../wrappers/options';

export interface QueryManipulator {
    /**
     * Manipulate a GraphQL query before it is executed.
     */
    manipulateQuery(query: any, options: QueryOptions): any;
}
