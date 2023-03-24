export class QueryResult<T = any> {

    /**
     * Contains the result of the query.
     */
    public data: T;

    constructor(data) {
        this.data = data;
    }

}
