import { HttpHeaders } from '@angular/common/http';
import { FetchPolicy, WatchQueryFetchPolicy } from '@apollo/client/core';
import { MutationFetchPolicy } from '@apollo/client/core/watchQueryOptions';

export class BuoyOptions {
    /**
     * The GraphQL endpoint.
     */
    uri ? = 'graph';

    /**
     * Add any custom headers here.
     */
    headers?: () => HttpHeaders;

    /**
     * Should cookies be included in HTTP-requests?
     */
    withCredentials = false;

    /**
     * Would you like to add any custom extensions to the requests? Define a callback,
     * that will be used to add extensions to all queries / mutation.
     */
    extensions?: () => any;

    /**
     * Register global middleware.
     */
    middleware?: any[] = [];

    /**
     * Enter the subscription driver to use for GraphQL subscription.
     */
    subscriptionDriver?: any; // TODO Add a better type for this

    /**
     * Enter the options for the driver you are using.
     */
    subscriptionDriverOptions?: any;

    /**
     * The default argument that will be used for single-model subscriptions (@subscribe).
     */
    subscribeDefaultArgument = 'id';

    /**
     * Enter the default type of paginator that is used.
     * Currently only "paginator" is supported.
     */
    paginatorType: 'paginator';

    /**
     * Default limit to be used in pagination.
     */
    defaultLimit ? = 25;

    /**
     * Enabling debug will print all query and mutation responses and subscription events in the console.
     */
    debug ? = false;

    defaultFetchPolicy?: FetchPolicy;

    defaultWatchQueryFetchPolicy?: WatchQueryFetchPolicy;

    defaultMutationFetchPolicy?: MutationFetchPolicy;
}
