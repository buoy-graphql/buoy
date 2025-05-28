export class MutationResult<T = any> {
    constructor(
        public readonly data: T,
        public readonly extensions: any,
    ) {
    }
}
