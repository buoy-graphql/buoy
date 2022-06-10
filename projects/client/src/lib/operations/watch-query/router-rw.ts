import { Subscription } from 'rxjs';
import { Pagination } from './pagination';

export class RouterRw {
    private _routeSubscription: Subscription;
    private ignoreRouteChanges = false;

    constructor(private _pagination: Pagination) {
        // Subscribe to the Router if defined.
        this.readRoute();
    }

    public destroy() {
        this._routeSubscription.unsubscribe();
    }

    /**
     * Write query params to the current route.
     */
    public writeRoute() {
        if (this._pagination._queryOptions.router) {
            this.ignoreRouteChanges = true;
            this._pagination._queryOptions.router.router.navigate(
                [],
                {
                    queryParams: this._pagination.variables,
                    queryParamsHandling: 'merge'
                }
            );
        }
    }

    /**
     * Read query params from the query and use them for pagination.
     */
    private readRoute() {
        if (this._pagination._queryOptions.router) {
            // TODO Unsubscribe on destroy (memory leak)
            this._routeSubscription = this._pagination._queryOptions.router.route.queryParams.subscribe((params: any) => {
                if (!this.ignoreRouteChanges) {
                    // Loop through all paginators
                    for (const paginator of Object.keys(this._pagination._paginators)) {
                        let page;
                        let limit;

                        // Loop through all query params
                        for (const param of Object.keys(params)) {

                            // Handle page
                            if (this._pagination._paginators[paginator].page === param) {
                                page = params[param];
                            }

                            // Handle limit
                            if (this._pagination._paginators[paginator].limit === param) {
                                limit = params[param];
                            }
                        }

                        // If no values are defined on Query, use global default values
                        if (typeof page === 'undefined') {
                            page = 1;
                        }
                        if (typeof limit === 'undefined') {
                            limit = this._pagination._query._globalOptions.values.defaultLimit;
                        }

                        // Set the values
                        this._pagination.setLimit(limit, paginator);
                        this._pagination.setPage(parseInt(page, 10), paginator, false);
                    }
                    // Read the values and add them to paginators desired values

                    this._pagination._query.refetch();
                }

                // We ignore this event. Act on the next one
                this.ignoreRouteChanges = false;
            });
        }
    }
}
