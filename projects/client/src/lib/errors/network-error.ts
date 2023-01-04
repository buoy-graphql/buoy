export class NetworkError extends Error {
    constructor(message: string) {
        super(`[Buoy NetworkError] ${message}`);
    }
}
