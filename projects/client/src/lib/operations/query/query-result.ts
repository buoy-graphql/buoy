export class QueryResult<T = any> {
    constructor(
        public readonly data: T,
    ) {
    }
}
