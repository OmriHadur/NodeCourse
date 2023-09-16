import { CustomError } from './custom-error';

export class NotAuthorizedError extends CustomError {
    statusCode = 401;
    constructor() {
        super("Not Authorized Error");
    }

    serilizeErrors() {
        return [{ message: 'Not authorized' }];
    }
}