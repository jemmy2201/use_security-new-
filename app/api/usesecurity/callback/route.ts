
import { NextResponse, NextRequest, } from 'next/server';
import axios from 'axios';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import jwt from 'jsonwebtoken';
import { importJWK, compactDecrypt, decodeJwt } from 'jose';
import { createSession } from '../../../../lib/session';

const privateKey = readFileSync(resolve('PrivateKey.pem'), 'utf8');

const CLIENT_ID = process.env.SINGPASS_CLIENT_ID;
const AUD_URL = process.env.SINGPASS_AUD_URL;
const AUTH_API_URL = process.env.SINGPASS_AUTH_API_URL as string;
const REDIRECT_URL_SINGPASS_CURL = process.env.SINGPASS_REDIRECT_URI;

const privateKeyJwt = async () => {
    const expEncode = Math.floor(Date.now() / 1000) + 20 * 60;
    const iatEncode = Math.floor(Date.now() / 1000);

    const clientIdSinpass = CLIENT_ID;
    const aud = AUD_URL;

    const payload = {
        sub: clientIdSinpass,
        aud: aud,
        iss: clientIdSinpass,
        iat: iatEncode,
        exp: expEncode
    };
    const token = jwt.sign(payload, privateKey, { algorithm: 'ES256' });
    return token;
};

const idToken = async (jwtToken: string, code: string) => {
    const reqBody = {
        client_id: CLIENT_ID,
        code: code,
        client_assertion: jwtToken,
        client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
        redirect_uri: REDIRECT_URL_SINGPASS_CURL,
        grant_type: 'authorization_code'
    }

    try {
        const response = await axios.post(AUTH_API_URL, reqBody, {
            headers: {
                'Charset': 'ISO-8859-1',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error during ID token request:', error);
    }
};


async function privateKeyJwe(code: string) {

    const jwkEnv = process.env.SINGPASS_PRIVATE_JWE;

    if (!jwkEnv) {
        throw new Error('JWK not found in environment variables');
    }

    let jwk;
    try {
        jwk = JSON.parse(jwkEnv);
    } catch (error) {
        throw new Error('Error parsing JWK from environment variables');
    }

    const key = await importJWK(jwk);

    try {
        const { plaintext } = await compactDecrypt(code, key);
        const decodedToken = decodeJwt(new TextDecoder().decode(plaintext));
        const subject = decodedToken.sub;
        console.log('Decrypted subject:', subject);
        return subject;
    } catch (error) {
        console.error('Error during JWE decryption:', error);
        throw error;
    }
}

const convertSub = (sub: string) => {
    const parts = sub.split(',');
    const finalSub = parts[0].substring(2);
    return finalSub;
};

export async function GET(request: NextRequest, res: NextResponse) {
    try {
        const redirectUrlToTerms = process.env.NEXT_PUBLIC_URL + '/terms';
        console.log('redirect url to terms and condition:', redirectUrlToTerms);
        const { searchParams } = new URL(request.url);
        const code = searchParams.get('code');

        if (!code) {
            return NextResponse.json({ error: 'Authorization code is missing' }, { status: 400 });
        }

        console.log('Callback from Singpass login, auth code:', code);

        const jwtToken = await privateKeyJwt();

        const response = await idToken(jwtToken, code);
        const dataToken = response.id_token;

        console.log('id token received (first 10 char): ', dataToken.substring(0,10));

        const jweDecoded = await privateKeyJwe(dataToken) as string;
        console.log('Id Token decoded:', jweDecoded);

        const userId = convertSub(jweDecoded);
        console.log('nric / userId : ', userId);
        await createSession(userId, dataToken);
        return NextResponse.redirect(new URL(redirectUrlToTerms, request.url));

    } catch (error) {
        console.error('Error processing Singpass callback:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

