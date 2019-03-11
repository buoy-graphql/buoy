import { MutationOptions } from './options';
import { Wrapper } from './wrapper';
import { Buoy } from '../buoy';

export class Mutation extends Wrapper {
    private _mutation;

    /**
     * Is the mutation ready?
     */
    public _initialized = false;

    /**
     * Contains the scoped response.
     */
    public data: any;

    /**
     * Is the mutation loading?
     */
    public loading = true;

    constructor(buoy: Buoy, id: number, mutation, public _variables, protected _options: MutationOptions) {
        super(buoy, id, 'query');
        this.debug('debug', 'Initializing Query...');

        if (_options.fetch !== false) {
            this.initMutation(mutation);
        }

        return this;
    }

    private initMutation(mutation) {
        this._mutation = this._buoy.apollo.mutate({
            mutation: mutation,
            variables: this.variables
        });
        this._initialized = true;
    }

    private get variables() {
        return [];
    }
}
