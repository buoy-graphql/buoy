export function generateField(name: string, selections?): any {
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
        field['selectionSet'] = {
            kind: 'SelectionSet',
            selections
        };
    }

    return field;
}
