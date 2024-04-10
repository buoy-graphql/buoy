import { Operation } from '../operation';
import { Buoy } from '../../buoy';
import { SubscriptionOptions } from './subscription-options';
import { Subscription as rxjsSubscription } from 'rxjs';
import { scope } from 'ngx-plumber';
import { OptionsService } from '../../internal/options.service';
import { DebugService } from '../../internal/debug.service';
import { print, parse } from 'graphql';

export class Subscription extends Operation {
    protected _apolloOperation;
    protected _apolloSubscription: rxjsSubscription;

    constructor(
        buoy: Buoy,
        private debug: DebugService,
        globalOptions: OptionsService,
        id: number,
        query,
        variables,
        options: SubscriptionOptions
    ) {
        query = parse(print(query).replace(/@skipSubscription/g, '@skip(if: true)'));
        super(buoy, globalOptions, id, query, variables, options, 'subscription');

        this.initSubscription();

        return this;
    }

    protected initSubscription(): void {
        if (this._globalOptions.values.subscriptionDriver === undefined) {
            throw new Error('You must select a subscription-driver before subscribing.');
        }

        this._apolloOperation = this._buoy.apollo.use('buoy').subscribe({
            query: this.getSubscriptionQuery(),
            variables: this.getVariables(),
            fetchPolicy: this._options.fetchPolicy,
        });

        this._apolloSubscription = this._apolloOperation.subscribe((data) => this.handleEvent(data));

        this.emitOnInitialized();
    }

    public destroy(): void {
        this._apolloSubscription?.unsubscribe();
    }

    /**
     * Set variable value.
     */
    public setVariable(variable: string, value: any): this {
        this._variables[variable] = value;

        return this;
    }

    public refetch(): this {
        this._apolloSubscription?.unsubscribe();
        this.initSubscription();

        return this;
    }

    private handleEvent(data): void {
        this.debug.subscriptionEvent(this, data);
        this.emitOnEvent(scope(data.data, this._options.scope ?? ''));
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

    /**
     * Replace all @skipSubscription with @skip(true).
     */
    private getSubscriptionQuery(): any {
        const query = print(this.getQuery())
            .replace(/@skipSubscription/g, '@skip(if: true)');

        return parse(query);
    }
}
