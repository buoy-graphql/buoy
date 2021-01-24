export interface SubscriptionOptions {
    // Callbacks
    onInitialized?: (id: number) => void;
    onEvent: (id: number, data: any) => void;
}
