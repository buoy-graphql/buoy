import { ActivatedRoute, Router } from '@angular/router';


interface Options {
    scope: string;
    fetch?: boolean;
}

export interface QueryOptions extends Options {
    subscribe?: boolean;     // TODO: gql
    pagination?: false | string | any;    // TODO
    router?: {
        router: Router,
        route: ActivatedRoute;
    };
}

export interface MutationOptions extends Options {
    asd?: boolean;
}
