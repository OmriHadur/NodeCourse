export abstract class CustomError extends Error {
    abstract statusCode: number;

    constructor(message:string) {
        super(message);
    }

    abstract serilizeErrors(): { message: string; field?: string }[];
}