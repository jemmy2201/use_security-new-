
import { NextResponse, NextRequest, } from 'next/server';
import axios from 'axios';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import jwt from 'jsonwebtoken';
import { importJWK, jwtVerify, compactDecrypt, decodeJwt } from 'jose';



const privateKey = readFileSync(resolve('PrivateKey.pem'), 'utf8');
const CLIENT_ID_SINPASS_UAT = '99gEBb5Bo6stbYJ9jVbmrCFyBZhbeU4I';
const AUD_UAT = 'http://localhost:5156/singpass/v2';
const AUTH_API_URL_UAT = 'http://localhost:5156/singpass/v2/token';
const REDIRECT_URL_SINGPASS_CURL = 'http://localhost/api/usesecurity/callback';
const URL_API_PRIVATE_KEY_JWE = 'https://www.idx-id2021.com/oauth2/uat_jwks';

const jwk = {
    kty: "EC",
    use: "sig",
    crv: "P-256",
    kid: "idx-sig",
    x: "vZU7a9zvPgDW0foGqkxtcbzYw796G1uYKLYCj0BGQYo",
    y: "ocA9DH32SmIVzuObjeOMHvZZYuLrD4p66w4KE2gngSU",
    d: "rTMBv7X9HgJfRjZCqyv6XQbOOk-G5C85tIRssTPnhLM",
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

    const secret = new TextEncoder().encode(
        privateKey,
    )

    const token = jwt.sign(payload, privateKey, { algorithm: 'ES256' });
    return token;
};

// Convert the id_token function
const idToken = async (jwtToken: string, code: string) => {
    const data = `client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer&client_assertion=${jwtToken}&client_id=${CLIENT_ID_SINPASS_UAT}&grant_type=authorization_code&redirect_uri=${REDIRECT_URL_SINGPASS_CURL}&code=${code}&scope=openid`;

    console.log('chamil-AUTH_API_URL_UAT', AUTH_API_URL_UAT);
    console.log('chamil-CLIENT_ID_SINPASS_UAT', CLIENT_ID_SINPASS_UAT);
    console.log('chamil-REDIRECT_URL_SINGPASS_CURL', REDIRECT_URL_SINGPASS_CURL);
    console.log('chamil-code', code);
    console.log('chamil-jwtToken', jwtToken);

    const reqBody = {
        client_id: CLIENT_ID_SINPASS_UAT,
        code: code,
        client_assertion: jwtToken,
        client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
        redirect_uri: REDIRECT_URL_SINGPASS_CURL,
        grant_type: 'authorization_code'
    }

    try {
        const response = await axios.post(AUTH_API_URL_UAT, reqBody, {
            headers: {
                'Charset': 'ISO-8859-1',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        console.log('============================ done')
        return response.data;
    } catch (error) {
        console.error('Error during ID token request:', error);
        // throw error; // TODO
    }
};



// Convert the api_private_key_jwe function
const apiPrivateKeyJwe = async (response: string) => {
    try {
        const result = await axios.get(URL_API_PRIVATE_KEY_JWE, {
            params: { code: response },  // Pass `code` as a query parameter
            headers: { 'Content-Type': 'application/json' }  // Headers go here
        });
        console.log('return from apiPrivateKeyJwe: ', result.data);
        return result.data;
    } catch (error) {
        console.error('Error during API private key JWE request:');
        //throw error;
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
        console.log('plaintext:', plaintext);
        const decodedToken = decodeJwt(new TextDecoder().decode(plaintext));
        console.log('decodedToken:', decodedToken);
        const subject = decodedToken.sub;
        console.log('Decrypted subject:', subject);
        return subject;
    } catch (error) {
        console.error('Error during JWE decryption:', error);
        throw error;
    }
}

// Convert the public_key_jwt function

const publicKeyJwt = async (response: string) => {
    const key = await importJWK(jwk);

    // Ensure the response is a string
    if (typeof response !== 'string') {
        throw new Error('JWT response must be a string');
    }

    try {
        const { payload } = await jwtVerify(response, key);
        console.log('payload: ', payload);
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

export async function GET(request: NextRequest, res: NextResponse) {
    try {

        console.log('Callback from Singpass login');

        // Extract the `code` query parameter from the URL
        const { searchParams } = new URL(request.url);
        const code = searchParams.get('code');

        if (!code) {
            return NextResponse.json({ error: 'Authorization code is missing' }, { status: 400 });
        }

        console.log('Callback from Singpass login, auth code:', code);

        // Step 1: Obtain JWT token using privateKeyJwt (assuming this is your custom function)
        const jwtToken = await privateKeyJwt();
        console.log("jwtToken-chamil", jwtToken);

        // Step 2: Obtain ID token using the authorization code and JWT token
        const response = await idToken(jwtToken, code);
        const dataToken = response.id_token;

        console.log('id token received: ', dataToken);

        // Step 3: Decrypt the JWE token (assuming apiPrivateKeyJwe is your custom decryption function)
        console.log('calling apiPrivateKeyJwe');
        //const jweDecoded = await apiPrivateKeyJwe(data);
        const jweDecoded = await privateKeyJwe(dataToken) as string;

        console.log('end calling apiPrivateKeyJwe, jweDecoded', jweDecoded);

        // Step 4: Decode the JWT token to get user information (assuming publicKeyJwt is your custom JWT decoding function)
        console.log('calling publicKeyJwt');


        /** 
            const jwtDecoded = await publicKeyJwt(jweDecoded);
            console.log('end calling publicKeyJwt jwtDecoded: ', jwtDecoded);

            // Extract `sub` and convert it using your function (assuming convertSub is your custom function)
            console.log('calling jwtDecoded');
            const sub = jwtDecoded['Jose.Component.Signature.JWS.payload'] as string;
            console.log('end calling jwtDecoded, sub: ', sub);
            const subConverted = convertSub(sub); 
        */

        const subConverted = convertSub(jweDecoded);
        console.log('nric returned: ', subConverted);
        const userId = subConverted;

    return NextResponse.redirect(new URL('/dashboard', request.url));

    } catch (error) {
        console.error('Error processing Singpass callback:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

