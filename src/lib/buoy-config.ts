import { HttpHeaders } from '@angular/common/http';
import { Middleware } from './middleware/middleware';

export class BuoyConfig {
    /**
     * The endpoint that Buoy will query.
     */
    uri ? = '/graph';

    /**
     * Would you like to add any custom headers to the requests? Define a callback,
     * that will be used to add custom headers on all requests.
     */
    headers?: () => HttpHeaders; // TODO: Add parameters

    /**
     * Would you like to add any custom extensions to the requests? Define a callback,
     * that will be used to add extensions to all queries / mutation.
     */
    extensions?: () => any; // TODO: Add parameters

    /**
     * Register global middleware.
     */
    middleware?: any = [];

    /**
     * Would you like to subscribe to changes server-side?
     */
    subscriptions?: Array<Middleware>;

    /**
     * Which type of paginators does the GraphQL server use as a default?
     */
    paginatorType?: 'paginator' = 'paginator'; // TODO Add support for 'connection'

    /**
     * Default limit to be used in paginators.
     */
    defaultLimit ? = 25;
}
