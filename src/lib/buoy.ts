import { Injectable, Optional } from '@angular/core';
import { Query } from './operations/query/query';
import { Mutation } from './operations/mutation/mutation';
import { Apollo } from 'apollo-angular';
import { BuoyConfig } from './buoy-config';
import { LighthouseLink } from './http-link/lighthouse-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpClient } from '@angular/common/http';
import { WatchQuery } from './operations/watch-query/watch-query';
import { QueryResult } from './operations/query/query-result';
import { QueryError } from './operations/query/query-error';
import { QueryOptions } from './operations/query/query-options';
import { WatchQueryOptions } from './operations/watch-query/watch-query-options';
import { MutationOptions } from './operations/mutation/mutation-options';
import { MutationResult } from './operations/mutation/mutation-result';
import { MutationError } from './operations/mutation/mutation-error';
import { Subscription } from './operations/subscription/subscription';
import { SubscriptionOptions } from './operations/subscription/subscription-options';

let operationId = 1;

@Injectable({
    providedIn: 'root'
})
export class Buoy {
    public _config: BuoyConfig;

    public _middleware = [];

    public cache: InMemoryCache;

    constructor(
        @Optional() config: BuoyConfig,
        public apollo: Apollo,
        public http: HttpClient
    ) {
        // Load default config and overwrite with the users configuration.
        this._config = Object.assign(new BuoyConfig(), config);

        // Register middleware
        if (typeof this._config.middleware !== 'undefined') {
            for (const middleware of this._config.middleware) {
                this.registerMiddleware(middleware, []);
            }
        }

        // Initialize cache
        this.cache = new InMemoryCache();

        // Initialize apollo-client
        this.apollo.create({
            link: new LighthouseLink(this),
            cache: this.cache
        });
    }

    /**
     * Run a query.
     */
    public query(query, variables?: any, options?: QueryOptions): Promise<QueryResult|QueryError> {
        return new Query(this, operationId++, query, variables, options).execute();
    }

    /**
     * Run an asynchronous query, that can be subscribed to.
     */
    public watchQuery(query, variables?: any, options?: WatchQueryOptions): WatchQuery {
        return new WatchQuery(this, operationId++, query, variables, options);
    }

    /**
     * Run a mutation.
     */
    public mutate(mutation, variables?: any, options?: MutationOptions): Promise<MutationResult|MutationError> {
        return new Mutation(this, operationId++, mutation, variables, options).execute();
    }

    /**
     * Subscribe to changes server-side.
     */
    public subscribe(subscription, variables?: any, options?: SubscriptionOptions): Subscription {
        return new Subscription(subscription, variables, options);
    }

    public get config(): BuoyConfig {
        return this._config;
    }

    public registerMiddleware(middleware: any, args: any[]): void {
        this._middleware.push(new middleware(...args));
    }

    /**
     * Reset the Buoy cache.
     */
    public resetCache(): void {
        this.cache.reset();
    }
}
