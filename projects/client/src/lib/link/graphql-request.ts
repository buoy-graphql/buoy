import { Buoy } from '../buoy';
import { Operation } from '@apollo/client/link/core/types';
import { print } from 'graphql/language/printer';
import { extractFiles } from 'extract-files';
import { isFunction } from 'ngx-plumber';
import { OptionsService } from '../internal/options.service';
import { NetworkError } from '../errors/network-error';

export class GraphqlRequest {
    constructor(
        public buoy: Buoy,
        public options: OptionsService,
    ) { }

    public fromOperation(operation: Operation): Promise<any> {
        return new Promise((resolve) => {
            this.buoy.http.post(this.options.values.uri, this.payload(operation), this.getHttpOptions(operation)).toPromise().then(
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
                    throw new NetworkError(error, this.options.values.uri);
                },
            );
        });
    }

    protected getHttpOptions(operation): any {
        // Add headers
        let headers;
        if (this.options.values.headers !== undefined) {
            headers = this.options.values.headers();
        }

        // Run Header middleware
        this.buoy.middleware.forEach((middleware: any) => {
            if (isFunction(middleware.manipulateHeaders)) {
                headers = middleware.manipulateHeaders(headers, operation.query, operation.variables);
            }
        });

        return {
            headers,
            withCredentials: this.options.values.withCredentials
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
