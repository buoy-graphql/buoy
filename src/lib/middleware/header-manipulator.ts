import { HttpHeaders } from '@angular/common/http';

export interface HeaderManipulator {
    /**
     * Manipulate a headers for HTTP-request before they are sent off.
     */
    manipulateHeaders(headers: HttpHeaders, query: any, variables: any): HttpHeaders;
}
