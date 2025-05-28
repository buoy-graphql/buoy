import { HttpHeaders } from '@angular/common/http';
import { FetchPolicy, WatchQueryFetchPolicy } from '@apollo/client/core';
import { MutationFetchPolicy } from '@apollo/client/core/watchQueryOptions';

export class BuoyOptions {
    /**
     * Would you like to add any custom extensions to the requests? Define a callback,
     * that will be used to add extensions to all queries / mutation.
     */
    extensions?: () => any;

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


}
