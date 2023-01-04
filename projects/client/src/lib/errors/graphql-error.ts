export class GraphQLError extends Error {
    constructor(message: string, public locations: any, public path: any) {
        super(`[Buoy GraphQLError] ${message}`);
    }
}
