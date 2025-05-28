export class QueryError<T = any> {
    constructor(
        public readonly data: T,
        public readonly errors: any
    ) {
    }

}
