export interface ResponseManipulator {
    /**
     * Manipulate a HTTP-response before it's returned to Buoy.
     */
    manipulateResponse(response: any, query: any, variables: any): any;
}
