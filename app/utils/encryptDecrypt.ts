import crypto from 'crypto';

export function encryptDecrypt(input: string, action = 'decrypt') {
    const algorithm = 'aes-256-cbc';
    const secretKey = process.env.SECRET_KEY;
    const secretIv = process.env.SECRET_IV;


    if (!secretKey || !secretIv) {
        throw new Error("Environment variables SECRET_KEY and SECRET_IV must be set");
    }

    const key = crypto.createHash('sha256').update(secretKey).digest('hex').slice(0, 32);
    const iv = crypto.createHash('sha256').update(secretIv).digest('hex').slice(0, 16);

    if (action === 'encrypt') {
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(input, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return Buffer.from(encrypted, 'utf8').toString('base64');
    } else if (action === 'decrypt') {
        const toDecrypt = Buffer.from(input, 'base64').toString('utf8');
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(toDecrypt, 'base64', 'utf8');
        return decrypted + decipher.final('utf8');
    }

    return null;
}

export default encryptDecrypt;
