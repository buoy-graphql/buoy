import { DocumentNode, OperationDefinitionNode } from 'graphql';
import { WatchQuery } from './watch-query';
import gql from 'graphql-tag';
import { print } from 'graphql';

export class CleanQuery {
    public query: DocumentNode;
    public definition: OperationDefinitionNode;

    constructor(private watchQuery: WatchQuery) {
        // Clone the query object
        this.query = gql(print(this.watchQuery.getQuery()));
        this.definition = this.query.definitions[0] as OperationDefinitionNode;
    }

    // TODO Refactor this method, to support removing directives on any level of the query.
    public get(): DocumentNode {
        this.definition.selectionSet.selections.forEach(selection => {
            selection.directives.forEach((directive, index) => {
                if (directive.name.value === 'subscribe') {
                    // @ts-ignore
                    delete selection.directives[index];
                }
            });
        });

        return this.query;
    }
}
