import { ApolloLink } from '@apollo/client/core';
import { FetchResult, NextLink, Operation } from '@apollo/client/link/core/types';
import { Observable } from '@apollo/client/utilities';
import { GraphqlRequest } from './graphql-request';
import { BuoyConfigRepository } from '../config/buoy-config-repository';
import { HttpClient } from '@angular/common/http';

export class HttpLink extends ApolloLink {
    constructor(
        private config: BuoyConfigRepository,
        private http: HttpClient,
    ) {
        super();
    }

    request(operation: Operation, forward?: NextLink): Observable<FetchResult> {
        return new Observable((observer: any) => {
            (new GraphqlRequest(this.config, this.http, operation))
                .execute()
                .then(result => {
                    operation.setContext(result);
                    observer.next(result);
                    observer.complete();
                });
        });
    }
}
