import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
    statusCode = 500;
    reason = "Error connection to DB";

    constructor() {
        super("Error connection to DB");
    }

    serilizeErrors() {
        return [
            { message: this.reason }
        ]
    }
}