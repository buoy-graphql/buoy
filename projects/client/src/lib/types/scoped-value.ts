type PathSplit<S extends string> =
    S extends `${infer Head}.${infer Tail}`
        ? [Head, ...PathSplit<Tail>]
        : [S];

type PathValue<T, P extends readonly string[]> =
    P extends [infer Head extends keyof T & string, ...infer Rest extends string[]]
        ? PathValue<T[Head], Rest>
        : T;

export type ScopedValue<T, K extends string> = PathValue<T, PathSplit<K>>;
