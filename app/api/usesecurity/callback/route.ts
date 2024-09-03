// app/api/singpass/route.ts

import { NextResponse } from 'next/server';
import axios from 'axios';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { JWK } from 'jose';
import * as jose from 'jose'

// jose.exportJWK


// Load your private key
const privateKey = readFileSync(resolve('PrivateKey.pem'), 'utf8');

const CLIENT_ID_SINPASS_UAT = '99gEBb5Bo6stbYJ9jVbmrCFyBZhbeU4I';
const AUD_UAT = 'https://stg-id.singpass.gov.sg';
const AUTH_API_URL_UAT = 'https://stg-id.singpass.gov.sg/token';
const REDIRECT_URL_SINGPASS_CURL = 'https://www.idx-id2021.com/api/usesecurity/callback';
const URL_API_PRIVATE_KEY_JWE = 'http://localhost:8000/api/jwe/decrypted';

// Your JWK key information
const jwk = {
    kty: "EC",
    d: "DDDDD",
    use: "sig",
    crv: "P-256",
    kid: "idx-sig",
    x: "XXXXXXX",
    y: "YYYYYYY",
};


// Convert the private_key_jwt function
const privateKeyJwt = async () => {
    const expEncode = Math.floor(Date.now() / 1000) + 2 * 60;
    const iatEncode = Math.floor(Date.now() / 1000);

    const clientIdSinpass = CLIENT_ID_SINPASS_UAT;
    const aud = AUD_UAT;

    const payload = {
        sub: clientIdSinpass,
        aud: aud,
        iss: clientIdSinpass,
        iat: iatEncode,
        exp: expEncode
    };

    //   return JWT.sign(payload, privateKey, { algorithm: 'ES256' });
    const secret = new TextEncoder().encode(
        privateKey,
    )
    const alg = 'ES256'
    const data = `client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer&client_assertion=${jwtToken}&client_id=${CLIENT_ID_SINPASS_UAT}&grant_type=authorization_code&redirect_uri=${REDIRECT_URL_SINGPASS_CURL}&code=${code}&scope=openid`;


    const jwt = await new jose.SignJWT({ data })
        .setProtectedHeader({ alg })
        .setIssuedAt(payload.iat)
        .setIssuer(payload.iss)
        .setAudience(payload.aud)
        .setExpirationTime(payload.exp)
        .sign(secret)

    console.log('jwt', jwt)
    return jwt;
};

// Convert the id_token function
const idToken = async (jwtToken: string, code: string) => {
    const data = `client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer&client_assertion=${jwtToken}&client_id=${CLIENT_ID_SINPASS_UAT}&grant_type=authorization_code&redirect_uri=${REDIRECT_URL_SINGPASS_CURL}&code=${code}&scope=openid`;

    try {
        const response = await axios.post(AUTH_API_URL_UAT, data, {
            headers: {
                'Charset': 'ISO-8859-1',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error during ID token request:', error);
        throw error;
    }
};

// Convert the api_private_key_jwe function
const apiPrivateKeyJwe = async (response: string) => {
    try {
        const result = await axios.post(URL_API_PRIVATE_KEY_JWE, { code: response }, {
            headers: { 'Content-Type': 'application/json' }
        });
        return result.data;
    } catch (error) {
        console.error('Error during API private key JWE request:', error);
        throw error;
    }
};

// Convert the public_key_jwt function
const publicKeyJwt = async (response: string) => {
    const key = JWK.asKey(jwk);

    try {
        // Verify and decode the JWT
        const { payload } = JWT.verify(response, key);
        return payload;
    } catch (error) {
        console.error('Error during JWT verification:', error);
        throw error;
    }
};

// Convert the convert_sub function
const convertSub = (sub: string) => {
    const parts = sub.split(',');
    const finalSub = parts[0].substring(2);
    return finalSub;
};

// API route handler
export async function POST(request: Request) {
    console.log('Callback from singpas login');
    const { code } = await request.json();
    const jwtToken = await privateKeyJwt();
    const response = await idToken(jwtToken, code);
    const data = response.id_token;
    const jweDecoded = await apiPrivateKeyJwe(data);
    const jwtDecoded = await publicKeyJwt(jweDecoded);
    const sub = jwtDecoded['Jose.Component.Signature.JWS.payload'];
    const subConverted = convertSub(sub);
    console.log('subConverted: ', NextResponse.json({ sub: subConverted }));
    return NextResponse.json({ sub: subConverted });
}
