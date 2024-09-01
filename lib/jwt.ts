// lib/jwt.ts
import { sign } from 'jsonwebtoken';
import { readFileSync } from 'fs';
import path from 'path';

const privateKey = readFileSync(path.resolve(process.cwd(), 'PrivateKey.pem'), 'utf8');

interface JwtPayload {
    [key: string]: any;
}

export const createJWT = (payload: JwtPayload) => {
    return sign(payload, privateKey, { algorithm: 'ES256' });
};
