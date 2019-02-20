import {Apollo} from 'apollo-angular';
import {MutationOptions} from './options';

export class Mutation {
    private _query;

    constructor(private apollo: Apollo, query, options: MutationOptions) {

    }
}
