import { Operation } from '../operation';
import { Buoy } from '../../buoy';
import { SubscriptionOptions } from './subscription-options';
import { Subscription as rxjsSubscription } from 'rxjs';

export class Subscription extends Operation {
    protected _apolloOperation;
    protected _apolloSubscription: rxjsSubscription;

    constructor(
        buoy: Buoy,
        id: number,
        query,
        variables,
        options: SubscriptionOptions
    ) {
        super(buoy, id, query, variables, options, 'subscription');

        this.initSubscription();

        return this;
    }

    protected initSubscription(): void {
        if (this._buoy.options.subscriptionDriver === undefined) {
            throw new Error('You must select a subscription-driver before subscribing.');
        }

        this._apolloOperation = this._buoy.apollo.use('buoy').subscribe({
            query: this.getQuery(),
            variables: this.getVariables(),
            fetchPolicy: this.getFetchPolicy(),
        });

        this._apolloSubscription = this._apolloOperation.subscribe((data) => this.handleEvent(data));

        this.emitOnInitialized();
    }

    public destroy(): void {
        this._apolloSubscription.unsubscribe();
    }

    private handleEvent(data): void {
        this.emitOnEvent(data.data);
    }

    private emitOnInitialized(): void {
        if (this._options.onInitialized !== undefined) {
            this._options.onInitialized(this._id);
        }
    }

    private emitOnEvent(data): void {
        if (this._options.onEvent !== undefined) {
            this._options.onEvent(this._id, data);
        }
    }
}
