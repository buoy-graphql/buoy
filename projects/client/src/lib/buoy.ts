import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { HttpClient } from '@angular/common/http';
import { QueryOptions } from './operations/query/query-options';
import { QueryResult } from './operations/query/query-result';
import { QueryError } from './operations/query/query-error';
import { Query } from './operations/query/query';
import { ApolloLink, InMemoryCache, split } from '@apollo/client/core';
import { HttpLink } from './link/http-link';
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
import { ErrorService } from './internal/error.service';
import { OptionsService } from './internal/options.service';
import { Paginator } from './operations/paginator/paginator';

let operationId = 1;

@Injectable({
    providedIn: 'root'
})
export class Buoy {
    // The version of the docs that exception messages will link to.
    public static docsVersion = '1.0';

    public middleware = [];

    readonly cache: InMemoryCache;
    readonly subscriptionDriver: SubscriptionDriver;

    constructor(
        public apollo: Apollo,
        public http: HttpClient,
        private error: ErrorService,
        private debug: DebugService,
        public options: OptionsService,
    ) {
        // Register middleware
        if (typeof this.options.values.middleware !== 'undefined') {
            for (const middleware of this.options.values.middleware) {
                this.registerMiddleware(middleware, []);
            }
        }

        // Create links
        const httpLink = new HttpLink(this, this.options);
        const wsLink = new WsLink(this);

        // Switch between links based on operation type
        const link = ApolloLink.from([
            wsLink,
            httpLink,
        ]);

        // Initialize cache
        this.cache = new InMemoryCache();

        // Initialize apollo-client
        this.apollo.createNamed('buoy', {
            link,
            cache: this.cache,
        });

        // Initialize the subscription driver (if enabled)
        if (this.options.values.subscriptionDriver !== undefined) {
            this.subscriptionDriver = new this.options.values.subscriptionDriver(this, this.options.values.subscriptionDriverOptions);
        }
    }

    /**
     * Run a query.
     */
    public query(query, variables?: any, options?: QueryOptions): Promise<QueryResult|QueryError> {
        return new Query(this, this.options, operationId++, query, variables, options).execute();
    }

    /**
     * Run an asynchronous query, that can be subscribed to.
     */
    public watchQuery(query, variables?: any, options?: WatchQueryOptions): WatchQuery {
        return new WatchQuery(this, this.options, operationId++, query, variables, options);
    }

    /**
     * Create a paginated, asynchronous query, that can be subscribed to.
     */
    public paginator(query, variables?: any, options?: PaginatorOptions): Paginator {
        return new Paginator(this, this.options, operationId++, query, variables, options);
    }

    /**
     * Run a mutation.
     */
    public mutate(mutation, variables?: any, options?: MutationOptions): Promise<MutationResult|MutationError> {
        return new Mutation(this, this.options, operationId++, mutation, variables, options).execute();
    }

    /**
     * Subscribe to server-side events.
     */
    public subscribe(subscription, variables?: any, options?: SubscriptionOptions): Subscription {
        return new Subscription(this, this.debug, this.options, operationId++, subscription, variables, options);
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
