
import { NextResponse, NextRequest, } from 'next/server';
import axios from 'axios';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import jwt from 'jsonwebtoken';
import { importJWK, compactDecrypt, decodeJwt } from 'jose';
import { createSession } from '../../../../lib/session';
import crypto from 'crypto';

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

const idToken = async (jwtToken: string, code: string, codeVerifier: string) => {
    const reqBody = {
        client_id: CLIENT_ID ?? '',
        code: code ?? '',
        client_assertion: jwtToken ?? '',
        client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
        redirect_uri: REDIRECT_URL_SINGPASS_CURL ?? '',
        grant_type: 'authorization_code',
		code_verifier: codeVerifier ?? ''
    }

    // Convert to URL-encoded string
    const urlEncodedBody = new URLSearchParams(reqBody).toString();

    console.log('idToken request body:', reqBody);
    console.log('idToken request url:', AUTH_API_URL);

    try {
        const response = await axios.post(AUTH_API_URL, urlEncodedBody, {
            headers: {
                'Charset': 'ISO-8859-1',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        console.log('idToken response status:', response.status);
        console.log('idToken response data:', response.data);
        return response.data;
    } catch (error) {
        if (typeof error === 'object' && error !== null && 'response' in error) {
            // Axios error
            const axiosError = error as any;
            console.error('Axios error status:', axiosError.response?.status);
            console.error('Axios error data:', axiosError.response?.data);
            console.error('Axios error headers:', axiosError.response?.headers);
        } else {
            // Other error
            console.error('Error during ID token request:', error);
        }
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

function generateCodeChallenge(codeVerifier: string): string {
    return crypto
        .createHash('sha256')
        .update(codeVerifier)
        .digest('base64url');
}

export async function GET(request: NextRequest, res: NextResponse) {
    const redirectUrlToTerms = process.env.NEXT_PUBLIC_URL + '/terms';
    console.log('redirect url to terms and condition:', redirectUrlToTerms);
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
        return NextResponse.json({ error: 'Authorization code is missing' }, { status: 400 });
    }
	
	try {
		const codeVerifier = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk";
        
        const codeChallenge = generateCodeChallenge(codeVerifier);
        console.log('Code Verifier:', codeVerifier);
        console.log('Code Challenge:', codeChallenge);
				
		const jwtToken = await privateKeyJwt();
		console.log('JWT Token generated:', jwtToken);

        const response = await idToken(jwtToken, code, codeVerifier);
		console.log('ID Token response:', response);

		if (!response || !response.id_token) {
			throw new Error('No id_token in response');
		}

		const dataToken = response.id_token;
		const jweDecoded = await privateKeyJwe(dataToken) as string;
		console.log('JWE Decoded:', jweDecoded);

		const userId = convertSub(jweDecoded);
		console.log('User ID:', userId);

		await createSession(userId, dataToken);
		return NextResponse.redirect(new URL(redirectUrlToTerms, request.url));
	} catch (error) {
		console.error('Error processing Singpass callback:', error);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}

