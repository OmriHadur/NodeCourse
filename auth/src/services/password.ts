import { scrypt, randomBytes } from 'crypto'
import { promisify } from 'util'

const scryptAsync = promisify(scrypt);

export class PasswordService {
    static async toHash(passsword: string) {
        const salt = randomBytes(8).toString('hex');
        const buf = (await scryptAsync(passsword, salt, 64)) as Buffer;
        const hashedPasssword =  `${buf.toString('hex')}.${salt}`
        return hashedPasssword;
    }

    static async compare(storedPassword: string, suppliedPassword: string) {
        const [hashedPassword, salt] = storedPassword.split('.');
        const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
        return buf.toString('hex') === hashedPassword;
    }
}