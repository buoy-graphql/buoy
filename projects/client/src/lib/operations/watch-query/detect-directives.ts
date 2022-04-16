import { ArgumentNode, DocumentNode, FieldDefinitionNode, FieldNode, OperationDefinitionNode } from 'graphql';
import { BuoyError } from '../../errors/buoy-error';
import { WatchQuery } from './watch-query';

export interface DirectiveLocation {
    scope: string;
    directive: string;
    arguments: readonly ArgumentNode[];
}

export class DetectDirectives {
    public directives: DirectiveLocation[] = [];

    constructor(public watchQuery: WatchQuery) { }

    public detect(): this {
        const definition = this.watchQuery.getQuery().definitions[0] as OperationDefinitionNode;

        this.detectDirectives('', definition);

        // Validate the detected directives
        this.directives.forEach((directive) => {
            if (directive.directive === 'subscribe' && directive.scope.includes('.')) {
                throw new BuoyError(`The @subscribe directive can only be applied to top-level fields. Illegal directive usage in "${directive.scope}"!`, '/operations/watch-query.html#subscribe');
            }
        });

        return this;
    }

    private detectDirectives(scope: string, node: any): void {
        node.directives.forEach(directive => {
            this.directives.push({
                scope,
                directive: directive.name.value,
                arguments: directive.arguments,
            });
        });

        if (node.selectionSet) {
            if (node.kind === 'OperationDefinition' || node.kind === 'Field') {
                node.selectionSet.selections.forEach((selection) => {
                    // Temporarily ignore fragments
                    if (selection.kind !== 'InlineFragment') {
                        const name = selection?.alias?.value ?? selection.name.value;
                        let selectionScope = scope;
                        if (selectionScope === '') {
                            selectionScope = name;
                        } else {
                            selectionScope = `${scope}.${name}`;
                        }

                        this.detectDirectives(selectionScope, selection);
                    }
                });
            }
        }
    }
}
