import { Buoy } from '../buoy';
import { Operation } from '@apollo/client/link/core/types';
import { print } from 'graphql/language/printer';
import { extractFiles } from 'extract-files';
import { isFunction } from 'ngx-plumber';

export class GraphqlRequest {
    constructor(public buoy: Buoy) { }

    public fromOperation(operation: Operation): Promise<any> {
        return new Promise((resolve) => {
            this.buoy.http.post(this.buoy.options.uri, this.payload(operation), this.getHttpOptions(operation)).toPromise().then(
                result => {
                    // TODO Check returned data - throw exception if invalid
                    // TODO Handle GraphQL errors properly

                    // Run ResponseManipulator middleware
                    this.buoy.middleware.forEach((middleware: any) => {
                        if (isFunction(middleware.manipulateResponse)) {
                            result = middleware.manipulateResponse(result, operation.query, operation.variables);
                        }
                    });
                    resolve(result);
                },
                error => {
                    // TODO Throw a proper error if HTTP request failed
                }
            );
        });
    }

    protected getHttpOptions(operation): any {
        // Add headers
        let headers;
        if (this.buoy.options.headers !== undefined) {
            headers = this.buoy.options.headers();
        }

        // Run Header middleware
        this.buoy.middleware.forEach((middleware: any) => {
            if (isFunction(middleware.manipulateHeaders)) {
                headers = middleware.manipulateHeaders(headers, operation.query, operation.variables);
            }
        });

        return {
            headers,
            withCredentials: this.buoy.options.withCredentials
        };
    }

    private payload(operation: Operation): any {
        // Extract files from variables
        const files = extractFiles(operation.variables);

        // Define operations
        const operations = {
            operationName: operation.operationName,
            query: print(operation.query),
            variables: operation.variables,
            extensions: operation.extensions
        };

        if (files.files.size === 0) {
            return operations;
        }

        const payload = new FormData();

        // Generate map
        const map = {};
        let i = 0;

        for (const [file, path] of files.files.entries()) {
            map[i] = ['variables.' + path];
            payload.append(i.toString(), file, file.name);
            i++;
        }

        payload.append('operations', JSON.stringify(operations));
        payload.append('map', JSON.stringify(map));

        return payload;
    }
}
