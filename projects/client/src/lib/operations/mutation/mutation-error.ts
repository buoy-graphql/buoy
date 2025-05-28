export class MutationError<T = any> {
    constructor(
        public readonly data: Partial<T>,
        public readonly errors: any, // TODO
        public readonly extensions: any,
    ) {
    }
}
