
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

// Convert the private_key_jwt function
const privateKeyJwt = async () => {
    const expEncode = Math.floor(Date.now() / 1000) + 2 * 60;
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

// Convert the id_token function
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
    const jwk = {
        kty: "EC",
        d: "7FaRgw1cJmzGA1hss0YcLK4483zkKJ6JPafOwEoMlIw",
        use: "enc",
        crv: "P-256",
        kid: "idx-enc",
        x: "9Is-VbNwtijojiwRxWAbXxg-UTndznGFISU0RlQpfoY",
        y: "t67FS3cT-sohO_x5qsBvAnM5HTNkk_wNQza32YJg-6A",
        alg: "ECDH-ES+A128KW"
    };

    // Import the JWK
    const key = await importJWK(jwk);

    try {
        // Decrypt the JWE using the imported key
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

// Convert the convert_sub function
const convertSub = (sub: string) => {
    const parts = sub.split(',');
    const finalSub = parts[0].substring(2);
    return finalSub;
};

export async function GET(request: NextRequest, res: NextResponse) {
    try {
        // Extract the `code` query parameter from the URL
        const { searchParams } = new URL(request.url);
        const code = searchParams.get('code');

        if (!code) {
            return NextResponse.json({ error: 'Authorization code is missing' }, { status: 400 });
        }

        console.log('Callback from Singpass login, auth code:', code);

        // Step 1: Obtain JWT token using privateKeyJwt (assuming this is your custom function)
        const jwtToken = await privateKeyJwt();

        // Step 2: Obtain ID token using the authorization code and JWT token
        const response = await idToken(jwtToken, code);
        const dataToken = response.id_token;

        console.log('id token received: ', dataToken);

        // Step 3: Decrypt the JWE token (assuming apiPrivateKeyJwe is your custom decryption function)
        const jweDecoded = await privateKeyJwe(dataToken) as string;

        const subConverted = convertSub(jweDecoded);
        console.log('nric : ', subConverted);

        
        await createSession(subConverted)
        //redirect('/terms')
        return NextResponse.redirect(new URL('/terms', request.url));

    } catch (error) {
        console.error('Error processing Singpass callback:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

