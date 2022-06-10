export interface SubscriptionOptions {
    scope?: string;
    fetchPolicy?: 'cache-first' | 'cache-and-network' | 'network-only' | 'cache-only' | 'no-cache' | 'standby';

    // Callbacks
    onInitialized?: (id: number) => void;
    onEvent: (id: number, data: any) => void;
}
