import { FetchResult } from '@apollo/client/link/core/types';

export interface SubscriptionDriver {
    /**
     * If a subscription is initialized, a unique identifier must be returned.
     * If no subscription is initialized, return null.
     */
    createSubscription(observer, response: FetchResult): string|null;

    destroySubscription(subscriptionId: string): void;
}
