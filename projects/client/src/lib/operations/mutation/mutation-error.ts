export class MutationError<T = any> {

    /**
     * Contains the result of the query.
     */
    public data: T;

    public errors: any; // TODO

    constructor(data, errors) {
        this.data = data;
        this.errors = errors;
    }

}
