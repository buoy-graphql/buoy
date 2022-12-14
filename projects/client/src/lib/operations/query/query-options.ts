import { FetchPolicy } from '@apollo/client/core';

export interface QueryOptions {
    scope: string;
    fetchPolicy?: FetchPolicy;
}
