interface Options {
    scope: string;
}

export interface QueryOptions extends Options {
    subscribe?: boolean;     // TODO: gql
    pagination?: false | string | any;    // TODO

}

export interface MutationOptions extends Options {
    asd: boolean;
}
