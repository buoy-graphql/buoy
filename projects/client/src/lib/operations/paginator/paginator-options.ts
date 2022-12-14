import { WatchQueryFetchPolicy } from '@apollo/client/core';

export interface PaginatorOptions {
    scope: string;
    fetch?: boolean;
    fetchPolicy?: WatchQueryFetchPolicy;

    // Callbacks
    onInitialized?: (id: number) => void;
    onLimitChange?: (id: number, paginator: string, limit: number) => void;
    onPageChange?: (id: number, paginator: string, page: number) => void;
    onLoadingStart?: (id: number) => void;
    onLoadingFinish?: (id: number) => void;
    onChange?: (id: number, data: any) => void;

    onCreateEvent?: (id: number, data: any) => void; // TODO
    onUpdateEvent?: (id: number, data: any) => void; // TODO
    onDeleteEvent?: (id: number, data: any) => void; // TODO
}
