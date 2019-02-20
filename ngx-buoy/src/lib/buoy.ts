import {Injectable} from '@angular/core';
import {Query} from './wrappers/query';
import {Mutation} from './wrappers/mutation';
import {Apollo} from 'apollo-angular';
import {MutationOptions, QueryOptions} from './wrappers/options';

@Injectable({
    providedIn: 'root'
})
export class Buoy {
    constructor(
        private apollo: Apollo
    ) {

    }

    /**
     * Run a query.
     */
    public query(query, parameters?: any, options?: QueryOptions): Query {
        return new Query(this.apollo, query, options);
    }

    /**
     * Run a mutation.
     */
    public mutate(mutation, parameters?: any, options?: MutationOptions): Mutation {
        return new Mutation(this.apollo, mutation, options);
    }

    public init(): void {

    }
}
