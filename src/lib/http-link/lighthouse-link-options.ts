import { Options as ApolloOptions } from 'apollo-angular-link-http-common';
import { HttpHeaders } from '@angular/common/http';
import { SubscriptionDriver } from '../subscription-drivers/subscription-driver';
import Pusher from '../subscription-drivers/pusher';

export declare type LighthouseLinkOptions = {
    /**
     * The GraphQL-endpoint of which you want to use.
     */
    uri?: string;

    /**
     * How should queries and mutations be sent to the server?
     *
     * get = use a GET-request (not recommended).
     * json = use a POST-request with a JSON-body containing the query, params, etc.
     * multipart = use a multipart/form POST-request.
     * opportunistic = use a 'json'-mode when possible. If there are files in the parameters, a multipart-request will be used.
     */
    httpMode?: 'get' | 'json'| 'multipart' | 'opportunistic';

    /**
     * Should file-uploads be allowed?
     * Please note: if file-uploads are enabled, httpMode cannot be 'get'.
     *
     * false = no. All files will be replaced with NULL.
     * inline = send the files as base64-encoded strings within the JSON-parameters.
     * inlineWithMetaData = send the files inline, but include metadata (name, mime-type, last change date, etc.)
     */
    fileUploads?: false | 'inline' | 'inlineWithMetaData';

    /**
     * Would you like to add any custom headers to the requests? Define a callback,
     * that will be used to add custom headers on all requests.
     */
    headers?: () => HttpHeaders;

    /**
     * Would you like to add any custom extensions to the requests? Define a callback,
     * that will be used to add extensions to all queries / mutation.
     */
    // extensions?: () => any; // TODO

    /**
     * Would you like to subscribe to changes server-side?
     */
    subscriptions?: {
        driver: 'pusher',
        driverOptions?: ''  // TODO: Find a Type sutable for options
    } | false;
} & ApolloOptions;

export declare type Options = LighthouseLinkOptions & ApolloOptions;
export declare type Context = LighthouseLinkOptions & ApolloOptions;
