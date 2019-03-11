import { HttpHeaders } from '@angular/common/http';
import { Middleware } from './middleware/middleware';

export class BuoyConfig {
    /**
     * The endpoint that Buoy will query.
     */
    endpoint ? = '/graph';

    /**
     * How should queries and mutations be sent to the server?
     *
     * get = use a GET-request (not recommended).
     * json = use a POST-request with a JSON-body containing the query, params, etc.
     * multipart = use a multipart/form POST-request.
     * opportunistic = use a 'json'-mode when possible. If there are files in the parameters, a multipart-request will be used.
     */
    httpMode?: 'get' | 'json'| 'multipart' | 'opportunistic' = 'json';

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
