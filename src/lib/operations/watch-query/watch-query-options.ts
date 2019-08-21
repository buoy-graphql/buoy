import { QueryOptions } from '../query/query-options';
import { ActivatedRoute, Router } from '@angular/router';
import { OnChangeEvent } from '../../events/on-change.event';

export interface WatchQueryOptions extends QueryOptions {
    subscribe?: boolean;     // TODO: gql
    pagination?: false | string | any;    // TODO
    router?: {
        router: Router,
        route: ActivatedRoute;
    };
    fetch?: boolean;
    onChange?: (event: OnChangeEvent) => void; // TODO ADD OTHER EVENTS
}
