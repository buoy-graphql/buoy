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

let uniqueId = 1;

@Injectable({
    providedIn: 'root'
})
export class Buoy {
    public _config: BuoyConfig;

    constructor(
        @Optional() config: BuoyConfig,
        public apollo: Apollo,
        public http: HttpClient
    ) {
        // Load default config and overwrite with the users configuration.
        this._config = Object.assign(new BuoyConfig(), config);

        // Initialize apollo-client
        this.apollo.create({
            link: new LighthouseLink(this),
            cache: new InMemoryCache()
        });
    }

    /**
     * Run a query.
     */
    public query(query, variables?: any, options?: QueryOptions): Query {
        return new Query(this, uniqueId++, query, variables, options);
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
}
