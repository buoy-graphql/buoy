import {Injectable, Optional} from '@angular/core';
import {Query} from './wrappers/query';
import {Mutation} from './wrappers/mutation';
import {Apollo} from 'apollo-angular';
import {MutationOptions, QueryOptions} from './wrappers/options';
import {BuoyConfig} from "./buoy-config";
import {LighthouseLink} from "./http-link/lighthouse-link";
import {LighthouseLinkOptions} from "./http-link/lighthouse-link-options";
import {InMemoryCache} from "apollo-cache-inmemory";
import {environment} from "../../../example/environments/environment";
import {HttpClient} from "@angular/common/http";

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

        console.log('CONFIG', this._config);

        // Initialize apollo-client
        this.apollo.create({
            link: new LighthouseLink(this),
            cache: new InMemoryCache()
        });
    }

    /**
     * Run a query.
     */
    public query(query, parameters?: any, options?: QueryOptions): Query {
        return new Query(this, uniqueId++, query, options);
    }

    /**
     * Run a mutation.
     */
    public mutate(mutation, parameters?: any, options?: MutationOptions): Mutation {
        return new Mutation(this.apollo, mutation, options);
    }

    public get config(): BuoyConfig {
        return this._config;
    }

    public debug(id: number|string, type: 'buoy'|'query'|'mutation', forced: boolean, severity: 'debug', message: string, data: any): void {
        // Warning: #E5E643
        // Danger: #E73F2B

        let name: string;

        if (type === 'buoy') {
            name = <string>id;
        } else if (type === 'query') {
            name = 'Query ' + id;
        } else {
            name = 'Mutation' + id;
        }

        // TODO show message? Is it forced through?

        switch (severity) {
            case 'debug':
                if (data !== null) {
                    console.info(
                        '%c [Buoy :: ' + name + ' :: DEBUG]',
                        'color: #4AA7B2',
                        message,
                        data
                    );
                } else {
                    console.info(
                        '%c [Buoy :: ' + name + ' :: DEBUG]',
                        'color: #4AA7B2',
                        message
                    );
                }
                break;
        }
    }
}
