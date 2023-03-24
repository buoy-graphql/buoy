export class MutationResult<T = any> {

    /**
     * Contains the result of the mutation.
     */
    public data: T;

    constructor(data) {
        this.data = data;
    }

}
