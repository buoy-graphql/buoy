import { Buoy } from '../buoy';
import { ApolloLink, RequestHandler } from '@apollo/client/core';
import { FetchResult, NextLink, Operation } from '@apollo/client/link/core/types';
import { Observable } from '@apollo/client/utilities';
import { GraphqlRequest } from './graphql-request';

export class HttpLink extends ApolloLink {
    public requester: RequestHandler;

    constructor(public buoy: Buoy) {
        super();
    }

    request(operation: Operation, forward?: NextLink): Observable<FetchResult> {
        return new Observable((observer: any) => {
            (new GraphqlRequest(this.buoy))
                .fromOperation(operation)
                .then(result => {
                    operation.setContext(result);
                    observer.next(result);
                    observer.complete();
                });
        });
    }
}
