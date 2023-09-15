import { CustomError } from "./custom-error";

export class BadReqeustError extends CustomError {
    statusCode = 400;
    constructor(public message: string) {
        super(message);
    }

    serilizeErrors() {
        return [{ message: this.message }]
    }
}