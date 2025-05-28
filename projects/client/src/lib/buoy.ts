import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { QueryOptions } from './operations/query/query-options';
import { QueryResult } from './operations/query/query-result';
import { QueryError } from './operations/query/query-error';
import { Query } from './operations/query/query';
import { InMemoryCache } from '@apollo/client/core';
import { MutationOptions } from './operations/mutation/mutation-options';
import { MutationResult } from './operations/mutation/mutation-result';
import { MutationError } from './operations/mutation/mutation-error';
import { Mutation } from './operations/mutation/mutation';
import { SubscriptionOptions } from './operations/subscription/subscription-options';
import { Subscription } from './operations/subscription/subscription';
import { WatchQuery } from './operations/watch-query/watch-query';
import { WatchQueryOptions } from './operations/watch-query/watch-query-options';
import { PaginatorOptions } from './operations/paginator/paginator-options';
import { WsLink } from './link/ws-link';
import { SubscriptionDriver } from './drivers/subscriptions/subscription-driver';
import { DebugService } from './internal/debug.service';
import { Paginator } from './operations/paginator/paginator';
import { BuoyConfigRepository } from './config/buoy-config-repository';

let operationId = 1;

@Injectable({
    providedIn: 'root'
})
export class Buoy {
    public middleware = [];

    constructor(
        public readonly apollo: Apollo,
        private readonly debug: DebugService,
        public readonly config: BuoyConfigRepository,
    ) {
    }

    public get cache(): InMemoryCache {
        return this.apollo.use('buoy').client.cache as InMemoryCache;
    }

    /**
     * Run a single-run query.
     */
    public async query<T = any>(query, variables?: any, options?: QueryOptions): Promise<QueryResult<T>|QueryError<T>> {
        return new Query(this, operationId++, query, variables, options).execute();
    }

    /**
     * Run a mutation.
     */
    public async mutate<T = any>(mutation, variables?: any, options?: MutationOptions): Promise<MutationResult<T>|MutationError<T>> {
        return new Mutation(this, operationId++, mutation, variables, options).execute();
    }

    /**
     * Run an asynchronous query that can be subscribed to.
     */
    public watchQuery<T = any>(query, variables?: any, options?: WatchQueryOptions): WatchQuery<T> {
        return new WatchQuery(this, operationId++, query, variables, options);
    }

    /**
     * Create a paginated, asynchronous query that can be subscribed to.
     */
    public paginator<T = any>(query, variables?: any, options?: PaginatorOptions): Paginator<T> {
        return new Paginator(this, operationId++, query, variables, options);
    }

    /**
     * Subscribe to server-side events.
     */
    public subscribe(subscription, variables?: any, options?: SubscriptionOptions): Subscription {
        return new Subscription(this, this.debug, operationId++, subscription, variables, options);
    }

    public registerMiddleware(middleware: any, args: any[]): void {
        this.middleware.push(new middleware(...args));
    }

    /**
     * Clear the underlying Apollo cache completely.
     */
    public clearCache(): void {
        this.apollo.use('buoy').client.clearStore();
    }
}
