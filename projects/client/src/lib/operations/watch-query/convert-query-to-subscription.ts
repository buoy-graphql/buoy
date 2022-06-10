import { ArgumentNode, DocumentNode, EnumValueNode, FieldNode, OperationDefinitionNode, StringValueNode } from 'graphql';
import { WatchQuery } from './watch-query';
import { DirectiveLocation } from './detect-directives';
import { scope } from 'ngx-plumber';
import gql from 'graphql-tag';
import { print } from 'graphql';

export interface SubscriptionQuery {
    query?: DocumentNode;
    scope: string;
    variables: any;
    paginated: boolean;
}

export class ConvertQueryToSubscription {
    public definition: OperationDefinitionNode;
    private variables: any = {};
    private paginationIndex?: number|false;

    constructor(
        private watchQuery: WatchQuery,
        private directive: DirectiveLocation,
        private watchQuerySubscriptionIndex: number,
        private queryName: string,
    ) {
        // @ts-ignore
        this.definition = gql(print(this.watchQuery.getQuery())).definitions[0] as OperationDefinitionNode;
    }

    public convert(): SubscriptionQuery {
        const selections = this.definition.selectionSet.selections as FieldNode[];
        for (const selection of selections) {
            if (selection?.alias?.value === this.directive.scope || selection.name.value === this.directive.scope) {
                return {
                    query: this.convertSelection(selection),
                    scope: '',
                    variables: this.variables,
                    paginated: this.paginationIndex !== false,
                };
            }
        }
    }

    private prepareQueryArguments(selection: FieldNode): any {
        const selectedArguments = [];
        const events = [];

        this.directive.arguments.forEach(argument => {
            if (argument.name.value === 'argument' && argument.value.kind === 'StringValue') {
                selectedArguments.push(argument.value.value);
            }
            if (argument.name.value === 'arguments' && argument.value.kind === 'ListValue') {
                argument.value.values.forEach((value: StringValueNode) => selectedArguments.push(value.value));
            }
            if (argument.name.value === 'event' && argument.value.kind === 'EnumValue') {
                events.push(argument.value);
            }
            if (argument.name.value === 'events' && argument.value.kind === 'ListValue') {
                argument.value.values.forEach((value: StringValueNode|EnumValueNode) => events.push(value));
            }
        });
        if (selectedArguments.length === 0) {
            // If no argument has been selected, use the default one
            selectedArguments.push(this.watchQuery._globalOptions.values.subscribeDefaultArgument);
        }

        // Loop through attributes on the query and pick the selected ones
        const subArguments = [];
        const selectedVariables = [];
        selection.arguments.forEach((selectionArg: ArgumentNode) => {
            if (selectedArguments.includes(selectionArg.name.value)) {
                if (selectionArg.value.kind === 'Variable' && !selectedVariables.includes(selectionArg.value.name.value)) {
                    selectedVariables.push(selectionArg.value.name.value);
                    this.variables[selectionArg.value.name.value] = this.watchQuery.getVariables()[selectionArg.value.name.value];
                }
                subArguments.push(selectionArg);
            }

        });

        // Loop through variables in the query and pick the selected ones
        const subVariableDefinitions = [];
        this.definition.variableDefinitions.forEach(variableDefinition => {
            if (selectedVariables.includes(variableDefinition.variable.name.value)) {
                subVariableDefinitions.push(variableDefinition);
            }
        });

        // Add "events" argument to subscription
        if (events.length !== 0) {
            subArguments.push({
                kind: 'Argument',
                name: {
                    kind: 'Name',
                    value: 'events',
                },
                value: {
                    kind: 'ListValue',
                    values: events
                }
            });
        }

        return {
            subArguments,
            subVariableDefinitions,
        };
    }

    private convertSelection(selection: FieldNode): DocumentNode {
        let subscriptionFields = selection.selectionSet;
        let fieldName = selection.name.value;
        const queryArguments = this.prepareQueryArguments(selection);
        this.detectPagination(selection);

        if (this.paginationIndex !== false) {
            if (subscriptionFields.selections[this.paginationIndex].kind === 'Field') {
                // @ts-ignore
                subscriptionFields = subscriptionFields.selections[this.paginationIndex].selectionSet;
                fieldName = selection.name.value.slice(0, -1);
            }
        }

        const test = Math.floor((Math.random() * 10) + 1);

        // Generate the subscription query
        const subscriptionQuery = gql `
            subscription ${this.queryName}_Subscription_${this.watchQuerySubscriptionIndex + 1} {
                subscription {
                    id
                    event
                    model
                }
            }`;

        // Subscribe to the model's subscription
        this.manipulateDocument(
            subscriptionQuery,
            'definitions.0.selectionSet.selections.0.name',
            'value',
            `${fieldName}Modified`
        );

        // Subscribe to the model's fields, that are used in the original query
        this.manipulateDocument(
            subscriptionQuery,
            'definitions.0.selectionSet.selections.0.selectionSet.selections.2',
            'selectionSet',
            subscriptionFields
        );

        // Add variables to subscription
        this.manipulateDocument(
            subscriptionQuery,
            'definitions.0',
            'variableDefinitions',
            queryArguments.subVariableDefinitions
        );

        // Add arguments to subscription
        this.manipulateDocument(
            subscriptionQuery,
            'definitions.0.selectionSet.selections.0',
            'arguments',
            queryArguments.subArguments
        );

        return subscriptionQuery;
    }

    /**
     * Check if the selection is a paginated list or a single model.
     * If paginated and data is queried, returns the index of the data field.
     * Otherwise false is returned.
     */
    private detectPagination(selection: FieldNode): void {
        let result: number|false = false;

        selection.selectionSet.selections.forEach((childSelection, index) => {
            if (childSelection.kind === 'Field') {
                if (childSelection.name.value === 'data') {
                    result = index;
                }
            }
        });

        this.paginationIndex = result;
    }

    private manipulateDocument(document: any, path, attribute, value): any {
        const data = scope(document, path);
        data[attribute] = value;

        return data;
    }
}
