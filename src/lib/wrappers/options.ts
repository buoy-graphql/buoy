import { ActivatedRoute, Router } from '@angular/router';
import { OnChangeEvent } from '../events/on-change.event';


interface Options {
    scope: string;
    fetch?: boolean;
    onChange?: (event: OnChangeEvent) => void;
}

export interface QueryOptions extends Options {
    subscribe?: boolean;     // TODO: gql
    pagination?: false | string | any;    // TODO
    router?: {
        router: Router,
        route: ActivatedRoute;
    };
    fetchPolicy?: 'cache-first' | 'cache-and-network' | 'network-only' | 'cache-only' | 'no-cache' | 'standby';
}

export interface MutationOptions extends Options {
    asd?: boolean;
}
