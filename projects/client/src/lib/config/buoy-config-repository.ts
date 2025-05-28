import { BuoyConfig } from './buoy-config';
import { HttpHeaders } from '@angular/common/http';
import { SubscriptionDriver } from '../drivers/subscriptions/subscription-driver';
import { MutationFetchPolicy, WatchQueryFetchPolicy } from '@apollo/client/core/watchQueryOptions';
import { FetchPolicy } from '@apollo/client/core';

export class BuoyConfigRepository {
    constructor(private config: BuoyConfig) {
    }

    public get uri(): string {
        return this.config.uri ?? 'graphql';
    }

    public get headers(): () => HttpHeaders {
        return this.config.headers ?? (() => new HttpHeaders());
    }

    public get withCredentials(): boolean {
        return this.config.withCredentials ?? false;
    }

    public get debug(): boolean {
        return this.config.debug ?? false;
    }

    public get defaultQueryFetchPolicy(): FetchPolicy {
        return this.config.defaultQueryFetchPolicy ?? 'network-only';
    }

    public get defaultWatchQueryFetchPolicy(): WatchQueryFetchPolicy {
        return this.config.defaultWatchQueryFetchPolicy ?? 'cache-and-network';
    }

    public get defaultPaginatorFetchPolicy(): WatchQueryFetchPolicy {
        return this.config.defaultPaginatorFetchPolicy ?? 'cache-and-network';
    }

    public get defaultMutationFetchPolicy(): MutationFetchPolicy {
        return this.config.defaultMutationFetchPolicy ?? 'network-only';
    }

    public get defaultSubscriptionFetchPolicy(): FetchPolicy {
        return this.config.defaultSubscriptionFetchPolicy ?? 'network-only';
    }

    public get middleware(): any[] {
        return this.config.middleware ?? [];
    }

    public get subscriptionDriver(): SubscriptionDriver|undefined {
        return this.config.subscriptionDriver;
    }

    public get subscribeDefaultArgument(): string {
        return this.config.subscribeDefaultArgument ?? 'id';
    }

    public get paginatorType(): string {
        return this.config.paginatorType ?? 'paginator';
    }

    public get defaultLimit(): number {
        return this.config.defaultLimit ?? 25;
    }
}
