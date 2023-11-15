import {default as PusherClient} from 'pusher-js';
import { SubscriptionDriver } from '../subscription-driver';
import { FetchResult } from '@apollo/client/link/core/types';
import { LighthouseOptions } from './lighthouse-options';
import { Buoy } from '../../../buoy';

export class Lighthouse implements SubscriptionDriver {
    private pusher;

    constructor(
        public buoy: Buoy,
        options: LighthouseOptions
    ) {
        // TODO Add an option to not initialize the pusher client until the user is authenticated.
        // TODO Add a way to reset the pusher client (ie. for change of authenticated user)
        this.pusher = new PusherClient(options.appKey, options.pusher);
    }

    createSubscription(observer, response: FetchResult): string|null {
        const channel = response.extensions?.lighthouse_subscriptions?.channel;
        if (channel) {
            this.pusher
                .subscribe(channel)
                .bind('lighthouse-subscription', payload => {
                    if (!payload.more) {
                        this.pusher.unsubscribe(channel);
                        observer.complete();
                    }
                    const result = payload.result;

                    if (result) {
                        observer.next(result);
                    }
                });

            return channel;
        }

        return null;
    }

    destroySubscription(subscriptionId: string): void {
        this.pusher.unsubscribe(subscriptionId);
    }
}
