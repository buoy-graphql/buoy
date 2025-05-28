import { HttpHeaders } from '@angular/common/http';
import { SubscriptionDriver } from '../drivers/subscriptions/subscription-driver';
import { InjectionToken } from '@angular/core';
import { FetchPolicy, MutationFetchPolicy, WatchQueryFetchPolicy } from '@apollo/client/core/watchQueryOptions';

export interface BuoyConfig {
    uri?: string;
    headers?: () => HttpHeaders;
    withCredentials?: boolean;
    debug?: boolean;
    defaultQueryFetchPolicy?: FetchPolicy;
    defaultWatchQueryFetchPolicy?: WatchQueryFetchPolicy;
    defaultPaginatorFetchPolicy?: WatchQueryFetchPolicy;
    defaultMutationFetchPolicy?: MutationFetchPolicy;
    defaultSubscriptionFetchPolicy?: FetchPolicy;
    middleware?: any[];
    subscriptionDriver?: SubscriptionDriver;
    subscribeDefaultArgument?: string;
    paginatorType?: string;
    defaultLimit?: number;
}
