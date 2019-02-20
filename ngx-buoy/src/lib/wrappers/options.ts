interface Options {
    scope: string;
}

export interface QueryOptions extends Options {
    subscribe: boolean;     // TODO: gql
    pagination: boolean;    // TODO

}

export interface MutationOptions extends Options {
    asd: boolean;
}
