export class SubscriptionError {

    /**
     * Contains the result of the query.
     */
    public data: any;

    public errors: any; // TODO

    constructor(data, errors) {
        this.data = data;
        this.errors = errors;
    }

}
