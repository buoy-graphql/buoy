import { Buoy } from '../buoy';
import { ApolloLink, RequestHandler } from '@apollo/client/core';
import { FetchResult, NextLink, Operation } from '@apollo/client/link/core/types';
import { Observable } from '@apollo/client/utilities';

export class WsLink extends ApolloLink {
    public requester: RequestHandler;

    constructor(private buoy: Buoy) {
        super();
    }

    request(operation: Operation, forward?: NextLink): Observable<FetchResult> {
        const subscribeObservable = new Observable((observer: any) => {});

        // @ts-ignore
        subscribeObservable.subscribe = (observerOrNext, onError, onComplete) => {
            const observer = this.getObserver(observerOrNext, onError, onComplete);
            let subscriptionId;

            forward(operation).subscribe({
                next: (response) => {
                    if (this.buoy.subscriptionDriver !== undefined) {
                        subscriptionId = this.buoy.subscriptionDriver.createSubscription(observer, response);
                    }

                    // No subscription - return the response
                    if (!subscriptionId) {
                        observer.next(response);
                        observer.complete();
                    }
                },
            });

            // Return an object that will unsubscribe_if the query was a subscription
            return {
                closed: false,
                unsubscribe: () => {
                    if (subscriptionId) {
                        this.buoy.subscriptionDriver.destroySubscription(subscriptionId);
                    }
                },
            };
        };

        return subscribeObservable;
    }

    private getObserver(observerOrNext, onError, onComplete): any {
        if (typeof observerOrNext === 'function') {
            // Duck-type an observer
            return {
                next: (v) => observerOrNext(v),
                error: (e) => onError && onError(e),
                complete: () => onComplete && onComplete(),
            };
        } else {
            // Make an object that calls to the given object, with safety checks
            return {
                next: (v) => observerOrNext.next && observerOrNext.next(v),
                error: (e) => observerOrNext.error && observerOrNext.error(e),
                complete: () => observerOrNext.complete && observerOrNext.complete(),
            };
        }
    }
}
