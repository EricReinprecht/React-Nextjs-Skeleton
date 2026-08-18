export class ApplicationError extends Error {
    constructor(
        message: string,
        public readonly statusCode = 500,
        public readonly code = "INTERNAL_ERROR"
    ) {
        super(message);
        this.name = "ApplicationError";
    }
}
