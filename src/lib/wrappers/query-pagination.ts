import { dotsToCamelCase, scope, scopeChild, scopeCount, issetElse } from 'ngx-plumber';
import { QueryOptions } from './options';
import { Query } from './query';
import { QueryRoute } from './query-route';

export class QueryPagination {
    public _paginators = {};
    private _queryRoute: QueryRoute;

    constructor(public _query: Query, private _gqlQuery, public _queryOptions: QueryOptions, variables: any) {
        if (typeof this._queryOptions.pagination !== 'undefined') {
            this.getPaginatorScopes(variables);

            this.findPaginatorsInQuery();

            // Subscribe to the Router if defined.
            this._queryRoute = new QueryRoute(this);
        }
    }

    public destroy(): void {
        if (this._queryRoute) {
            this._queryRoute.destroy();
        }
    }

    /**
     * Returns all pagination-variables
     */
    public get variables() {
        if (typeof this._paginators === 'undefined') {
            return {};
        }

        console.log('GENERATING VARIABLES', this._paginators);
        const variables = {};

        if (Object.keys(this._paginators).length === 1) {
            const paginator = Object.keys(this._paginators)[0];
            variables[`page`] = this._paginators[paginator].desiredPage;
            variables[`limit`] = this._paginators[paginator].desiredLimit;
        } else {
            for (const paginator in this._paginators) {
                if (this._paginators[paginator].type === 'paginator') {
                    variables[`${dotsToCamelCase(paginator)}Page`] = this._paginators[paginator].desiredPage;
                    variables[`${dotsToCamelCase(paginator)}Limit`] = this._paginators[paginator].desiredLimit;
                } else {
                    // TODO add support for connection
                }
            }
        }

        return variables;
    }

    /**
     * Returns all pagination-values (page, lastPage, etc.)
     */
    public get pagination() {
        let pagination = {};

        if (Object.keys(this._paginators).length === 1) {
            pagination = this._paginators[Object.keys(this._paginators)[0]].pagination;
        } else {
            for (const paginator of Object.keys(this._paginators)) {
                pagination[paginator] = this._paginators[paginator].pagination;
            }
        }

        return pagination;
    }

    /**
     * Save lastPage, currentPage, etc. for all paginators.
     */
    public readPaginationFromResponse(data: any): void {
        for (const paginator in this._paginators) {
            if (this._paginators[paginator].type === 'paginator') {
                const paginatorInfo = scope(data.data, paginator).paginatorInfo;
                this._paginators[paginator].pagination = {
                    currentPage: paginatorInfo.currentPage,
                    lastPage: paginatorInfo.lastPage
                };
            } else {
                // TODO add support for connection
            }
        }
    }

    /**
     * Returns the manipulated query (graphql-tag).
     */
    public get query() {
        console.log('PA FINAL QUERY', this._gqlQuery);
        return this._gqlQuery;
    }

    /**
     * Go to the previous page.
     */
    public prevPage(paginator?: string): boolean {
        paginator = this.checkPaginator(paginator, 'page');

        // Only continue if the page actually is available
        if (this.checkIfPageExists(paginator, '-')) {
            this._paginators[paginator].desiredPage--;
            this._queryRoute.writeRoute();

            // TODO add support for connection
            return true;
        }

        return false;
    }

    /**
     * Go the the next page.
     */
    public nextPage(paginator?: string): boolean {
        paginator = this.checkPaginator(paginator, 'page');

        // Only continue if the page actually is available
        if (this.checkIfPageExists(paginator, '+')) {
            this._paginators[paginator].desiredPage++;
            this._queryRoute.writeRoute();

            // TODO add support for connection
            return true;
        }

        return false;
    }

    /**
     * Set the page.
     */
    public setPage(page: number | string, paginator?: string, checkPage = true): boolean {
        paginator = this.checkPaginator(paginator, 'page');

        // Only continue if the page actually is available
        if (this.checkIfPageExists(paginator, page) || checkPage === false) {
            this._paginators[paginator].desiredPage = page;
            if (this._query._initialized) {
                this._queryRoute.writeRoute();
            }
            return true;
        }

        return false;
    }

    /**
     * Set the limit for a paginator
     */
    public setLimit(limit: number, paginator: string, checkPage = true): void {
        paginator = this.checkPaginator(paginator, 'limit');

        if (this._paginators[paginator].desiredLimit !== limit) {
            // Jump back to page 1 if the limit was changed.
            this._paginators[paginator].desiredPage = 1;
            if (this._query._initialized) {
                this._queryRoute.writeRoute();
            }
        }

        this._paginators[paginator].desiredLimit = limit;
    }

    /**
     * Check if the paginator exists.
     */
    private checkPaginator(paginator: string, variable: 'page'|'limit'): string {
        // Check if there are any paginators
        if (Object.keys(this._paginators).length === 0) {
            throw new Error('There are no paginators in this query.');
        }

        // If no paginator is defined,
        if (typeof paginator === 'undefined') {
            if (Object.keys(this._paginators).length > 1) {
                // If there are more than one paginator, and no one is selected, we can't continue
                throw new Error('You must define in which paginator you ' +
                    `want to change the ${variable}, when there are multiple paginators in a query!`);
            } else {
                // If there is only one paginator, change the value of paginator to that
                paginator = Object.keys(this._paginators)[0];
            }
        }

        return paginator;
    }

    /**
     * Check if a page exists in the paginator.
     */
    private checkIfPageExists(paginator: string, page: number|string|'-'|'+'): boolean {
        try {
            if (typeof paginator !== 'undefined') {
                if (this._paginators[paginator].type === 'paginator') {
                    if (page === '-') {
                        if (typeof this._paginators[paginator].pagination !== 'undefined') {
                            if (this._paginators[paginator].pagination.currentPage - 1 >= 1) {
                                return true;
                            }
                        }
                    } else if (page === '+') {
                        if (typeof this._paginators[paginator].pagination !== 'undefined') {
                            if (this._paginators[paginator].pagination.currentPage + 1 <= this._paginators[paginator].pagination.lastPage) {
                                return true;
                            }
                        }
                    } else if (!isNaN(<number>page)) {
                        if (page === this._paginators[paginator].desiredPage) {
                            return false; // The page is already the desired page
                        } else if (page <= this._paginators[paginator].pagination.lastPage) {
                            return true;
                        }
                    } else {
                        throw new Error(`Invalid page "${page}" for type "paginator".`);
                    }
                    switch (page) {
                        case '-':
                            break;
                        case '+':
                            break;
                    }
                } else {
                    // TODO add support for connection
                }
            }
        } catch (e) {
            return false;
        }

        return false;
    }

    /**
     * Converts the pagination parameter from QueryOptions into an object with paginators
     */
    private getPaginatorScopes(variables: any): void {
        if (typeof this._queryOptions.pagination === 'string') {
            // Simple pagination
            this._paginators = this.convertScopesToPaginators([this._queryOptions.pagination], variables);
        } else {
            if (this._queryOptions.pagination instanceof Array) {
                // Multiple paginators
                this._paginators = this.convertScopesToPaginators(this._queryOptions.pagination, variables);
            } else {
                // Advanced pagination
                this._paginators = this._queryOptions.pagination;
                // TODO Validate input and throw Exception if there are errors.
            }
        }
    }

    /**
     * Converts a list of scopes to an object with paginators.
     */
    private convertScopesToPaginators(scopes: string[], variables: any) {
        const paginators = {};

        scopes.forEach((scopeStr) => {
            const prefix = dotsToCamelCase(scopeStr);
            if (this._query._buoy._config.paginatorType === 'paginator') {
                paginators[scopeStr] = {
                    type: 'paginator',
                    page: scopes.length === 1 ? 'page' : `${prefix}Page`,
                    limit: scopes.length === 1 ? 'limit' : `${prefix}Limit`,
                    desiredPage: scopes.length === 1 ? issetElse(variables['page'], 1) : issetElse(variables[`${prefix}Page`], 1),
                    desiredLimit: scopes.length === 1 ?
                        issetElse(variables['limit'], this._query._buoy.config.defaultLimit) :
                        issetElse(variables[`${prefix}Limit`], this._query._buoy.config.defaultLimit)
                };
            } else {
                paginators[scopeStr] = {
                    type: 'connection',
                    after: `${prefix}After`,
                    limit: `${prefix}Limit`
                    // TODO page
                };
            }
        });

        return paginators;
    }

    /**
     * Find paginators in the query
     */
    private findPaginatorsInQuery(): void {
        // Loop through all paginators
        for (const paginator of Object.keys(this._paginators)) {
            // Loop through all definitions in query
            scope(this._gqlQuery, 'definitions').forEach((definition, definitionI) => {
                // Loop through all definitions
                this.queryScoped(`definitions.${definitionI}.selectionSet.selections`)
                    .forEach((selection, selectionI) => {
                        this.findPaginatorInSelection(selection, paginator, 0,
                            `definitions.${definitionI}.selectionSet.selections.${selectionI}`);
                    });
            });
        }
    }

    /**
     * Find paginators in a selection and inject the necessary parameters.
     */
    private findPaginatorInSelection(selection, paginator: string, level: number, queryPath: string): void {
        const queryScoped = this.queryScoped(queryPath);

        // Check if this selection is in the scope
        if (scopeChild(paginator, level, true) === queryScoped.name.value) {
            // Check if this is the last level in the scope
            if (scopeCount(paginator) === level + 1) {
                this.injectPaginationInSelection(paginator, queryPath); // TODO: Add parameters
            } else {
                // The final level is a child of this level - run findPaginatorInSelection on all children.
                this.queryScoped(`${queryPath}.selectionSet.selections`)
                    .forEach((childSelection, selectionI) => {
                        this.findPaginatorInSelection(childSelection, paginator, level + 1,
                            `${queryPath}.selectionSet.selections.${selectionI}`);
                    });
            }
        }
    }

    /**
     * Inject parameters into a paginator
     */
    private injectPaginationInSelection(paginator, queryPath): void {
        const selection = this.queryScoped(queryPath);

        // Check if pagination variables are defined. Otherwise, add them.
        this.checkVariablesOnQuery(paginator);

        // Check if pagination arguments are defined. Otherwise, add them.
        this.checkPaginatorArguments(paginator, queryPath);

        // Check if the necessary parameters are queried. Otherwise, add them.
        if (this._paginators[paginator].type === 'paginator') {
            // Check if "paginatorInfo" exists
            let paginationSelectionId;
            selection.selectionSet.selections.forEach((subSelection, i) => {
                if (subSelection.name.value === 'paginatorInfo') {
                    paginationSelectionId = i;
                }
            });

            // paginatorInfo does not exist. Add the necessary parameters
            if (typeof paginationSelectionId === 'undefined') {
                selection.selectionSet.selections.push(
                    this.generateField('paginatorInfo',
                        [
                            this.generateField('lastPage'),
                            this.generateField('currentPage'),
                            this.generateField('perPage'),
                        ]
                    )
                );
            } else {
                // Make sure the necessary variables are inside "paginatorInfo"
                let lastPageId;
                let currentPageId;
                let perPageId;

                selection.selectionSet.selections[paginationSelectionId].selectionSet.selections.forEach((subSelection, i) => {
                    switch (subSelection.name.value) {
                        case 'lastPage':    lastPageId = i; break;
                        case 'currentPage': currentPageId = i; break;
                        case 'perPage':     perPageId = i; break;
                    }
                });

                if (typeof lastPageId === 'undefined') {
                    selection.selectionSet.selections[paginationSelectionId].selectionSet.selections.push(
                        this.generateField('lastPage')
                    );
                }

                if (typeof currentPageId === 'undefined') {
                    selection.selectionSet.selections[paginationSelectionId].selectionSet.selections.push(
                        this.generateField('currentPage')
                    );
                }

                if (typeof perPageId === 'undefined') {
                    selection.selectionSet.selections[paginationSelectionId].selectionSet.selections.push(
                        this.generateField('perPage')
                    );
                }
            }


        } else {
            // TODO add support for connection.
        }
    }

    /**
     * Check if the necessary variables for a specific paginator are added to the query. Otherwise add them.
     */
    private checkVariablesOnQuery(paginator) {

        if (this._paginators[paginator].type === 'paginator') {
            let pageVariableId;
            let limitVariableId;

            // Loop through all variables in the query
            this._gqlQuery.definitions[0].variableDefinitions.forEach((variableDefinition, i) => {
                switch (variableDefinition.variable.name.value) {
                    case this._paginators[paginator].page:  pageVariableId = i; break;
                    case this._paginators[paginator].limit: limitVariableId = i; break;
                }
            });

            if (typeof pageVariableId === 'undefined') {
                this._gqlQuery.definitions[0].variableDefinitions.push(this.generateVariable(
                    this._paginators[paginator].page,
                    'Int'
                ));
            }

            if (typeof limitVariableId === 'undefined') {
                this._gqlQuery.definitions[0].variableDefinitions.push(this.generateVariable(
                    this._paginators[paginator].limit,
                    'Int'
                ));
            }


            console.log(`PA CVOQ :: VARIABLE
            `,
                this._gqlQuery.definitions[0].variableDefinitions
            );
        } else {
            // TODO add support for connection.
        }
    }

    /**
     * Check if the necessary arguments are defined on a specific paginator. Otherwise, add them.
     */
    private checkPaginatorArguments(paginator, queryPath): void {
        if (this._paginators[paginator].type === 'paginator') {
            // TODO
        } else {
            // TODO add support for connection.
        }
    }

    private generateField(name: string, selections?) {
        const field = {
            alias: undefined,
            arguments: [],
            directives: [],
            kind: 'Field',
            name: {
                kind: 'Name',
                value: name
            }
        };

        if (typeof selections !== 'undefined') {
            field['selectionSet'] =  {
                kind: 'SelectionSet',
                    selections: selections
            };
        }

        return field;
    }

    private generateVariable(name: string, type: string) {
        const kind = 'NonNullType'; // TODO: Make dynamic

        return {
            defaultValue: undefined,
            directives: [],
            kind: 'VariableDefinition',
            type: {
                kind: kind,
                type: {
                    kind: 'NamedType',
                    name: {
                        kind: 'Name',
                        value: type
                    }
                }
            },
            variable: {
                kind: 'Variable',
                name: {
                    kind: 'Name',
                    value: name
                }
            }
        };
    }

    private queryScoped(scopeStr): any {
        return scope(this._gqlQuery, scopeStr);
    }
}
