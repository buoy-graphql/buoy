import { QueryOptions } from '../query/query-options';

export interface MutationOptions extends QueryOptions {
    refetchQueries?: number; // TODO
    update?: (proxy, data, query) => any;
    // updateCache // TODO https://www.apollographql.com/docs/react/api/react-apollo/#props-1
}
