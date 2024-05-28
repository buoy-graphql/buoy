import { HttpErrorResponse } from '@angular/common/http';

export class NetworkError extends Error {
    constructor(public error: HttpErrorResponse, uri: string) {
        super(`[Buoy NetworkError] Received error ${error.status} from ${uri}.`);
    }
}
