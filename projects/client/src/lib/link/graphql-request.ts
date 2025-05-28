import { Operation } from '@apollo/client/link/core/types';
import { print } from 'graphql/language/printer';
import { extractFiles } from 'extract-files';
import { NetworkError } from '../errors/network-error';
import { BuoyConfigRepository } from '../config/buoy-config-repository';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export class GraphqlRequest {
    constructor(
        private config: BuoyConfigRepository,
        private http: HttpClient,
        private operation: Operation,
    ) { }

    public async execute(): Promise<any> {
        try {
            let response = await firstValueFrom(this.http.post(
                this.config.uri,
                this.payload(),
                this.getHttpOptions(),
            ));

            this.config.middleware.forEach((middleware: any) => {
                if (typeof middleware.manipulateResponse === 'function') {
                    response = middleware.manipulateResponse(
                        response,
                        this.operation.query,
                        this.operation.variables
                    );
                }
            });

            return response;
        } catch (error) {
            throw new NetworkError(error, this.config.uri);
        }
    }

    protected getHttpOptions(): any {
        // Add headers
        let headers = this.config.headers();

        // Run Header middleware
        this.config.middleware.forEach((middleware: any) => {
            if (typeof middleware.manipulateHeaders === 'function') {
                headers = middleware.manipulateHeaders(headers, this.operation.query, this.operation.variables);
            }
        });

        return {
            headers,
            withCredentials: this.config.withCredentials
        };
    }

    private payload(): any {
        // Extract files from variables
        const files = extractFiles(this.operation.variables);

        // Define operations
        const operations = {
            operationName: this.operation.operationName,
            query: print(this.operation.query),
            variables: this.operation.variables,
            extensions: this.operation.extensions
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
