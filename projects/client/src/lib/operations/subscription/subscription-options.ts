import { FetchPolicy } from '@apollo/client/core';

export interface SubscriptionOptions {
    scope?: string;
    fetchPolicy?: FetchPolicy;

    // Callbacks
    onInitialized?: (id: number) => void;
    onEvent: (id: number, data: any) => void;
}
