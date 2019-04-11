import { Injectable, Optional } from '@angular/core';
import { Query } from './wrappers/query';
import { Mutation } from './wrappers/mutation';
import { Apollo } from 'apollo-angular';
import { MutationOptions, QueryOptions } from './wrappers/options';
import { BuoyConfig } from './buoy-config';
import { LighthouseLink } from './http-link/lighthouse-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WatchQuery } from './wrappers/watch-query';

let uniqueId = 1;

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
    public query(query, variables?: any, options?: QueryOptions): Query {
        return new Query(this, uniqueId++, query, variables, options);
    }

    /**
     * Run a query - with observable data.
     */
    public watchQuery(query, variables?: any, options?: QueryOptions): WatchQuery {
        return new WatchQuery(this, uniqueId++, query, variables, options);
    }

    /**
     * Run a mutation.
     */
    public mutate(mutation, variables?: any, options?: MutationOptions): Observable<any> {
        return new Mutation(this, uniqueId++, mutation, variables, options).execute();
    }

    public get config(): BuoyConfig {
        return this._config;
    }

    public registerMiddleware(middleware: any, args: any[]): void {
        this._middleware.push(new middleware(...args));
    }

    public resetCache(): void {
        this.cache.reset();
    }
}
