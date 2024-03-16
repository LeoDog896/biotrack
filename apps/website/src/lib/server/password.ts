import crypto from 'crypto';
import { promisify } from 'util';
const pbkdf2 = promisify(crypto.pbkdf2);

export interface PasswordData {
	hash: string;
	salt: string;
}

export async function makePassword(password: string): Promise<PasswordData> {
	const salt = crypto.randomBytes(32).toString('hex');
	const hash = (await pbkdf2(password, salt, 1000, 100, 'sha512')).toString('hex');

	return { hash, salt };
}

export async function verifyPassword(password: string, hash: string, salt: string) {
    const newHash = (await pbkdf2(password, salt, 1000, 100, 'sha512')).toString('hex');
    return newHash === hash;
}
