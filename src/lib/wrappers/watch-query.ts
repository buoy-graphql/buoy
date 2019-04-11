import { BehaviorSubject } from 'rxjs';
import { scope } from 'ngx-plumber';
import { OnChangeEvent } from '../events/on-change.event';
import { Query } from './query';
import { Buoy } from '../buoy';
import { QueryOptions } from './options';

export class WatchQuery extends Query {
    public data: BehaviorSubject<any>;

    constructor(buoy: Buoy,
                id: number,
                query,
                variables,
                options: QueryOptions) {
        super(buoy, id, query, variables, options);
        this.initData();
    }

    protected initData() {
        if (typeof this.data === 'undefined') {
            this.data = new BehaviorSubject(null);
        }
    }


    protected mapResponse(data, mode: 'http' | 'ws'): void {
        // Init data if is hasn't been initialized yet
        this.initData();

        // Set loading
        this.loading = data.loading; // TODO Necessary?

        this._queryPagination.readPaginationFromResponse(data);

        // Set data
        this.data.next(scope(data.data, this._options.scope));

        // OnChange event
        if (typeof this._options.onChange !== 'undefined') {
            this._options.onChange(new OnChangeEvent(this.data));
        }
    }

    public reset(): void {
        if (this.data !== null && typeof this.data !== 'undefined') {
            this.data.next({});
        }
    }
}
