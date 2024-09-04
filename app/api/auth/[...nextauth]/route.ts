
import NextAuth, { NextAuthOptions } from 'next-auth';
import { OAuthConfig } from 'next-auth/providers/oauth';
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Read the private and public keys from the file system
const privateKey = readFileSync(resolve('PrivateKey.pem'), 'utf8');

// Define the SingPass provider configuration
const SingPassProvider: OAuthConfig<any> = {
  id: 'singpass',
  name: 'SingPass',
  type: 'oauth',
  wellKnown: process.env.SINGPASS_WELLKNOWN_URL,
  authorization: {
    params: {
      scope: 'openid',
      response_type: 'code',
      redirect_uri: process.env.SINGPASS_REDIRECT_URI,
      nonce: 'dummySessionState',
      state: 'dummySessionState'
    },
  },
  idToken: true,
  checks: ['pkce', 'state'],
  clientId: process.env.SINGPASS_CLIENT_ID,
  clientSecret: process.env.SINGPASS_CLIENT_SECRET,
  client: {
    token_endpoint_auth_method: 'private_key_jwt',
    privateKey: privateKey,
    clientSecret: process.env.SINGPASS_CLIENT_SECRET,
  },  
  profile(profile) {
    return {
      id: profile.sub,
      name: profile.name,
      email: profile.email,
    };
  },
};

// Function to fetch MyInfo data using access token
async function fetchMyInfoData(accessToken: string) {
  const response = await fetch(`${process.env.MYINFO_API_BASE_URL}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch MyInfo data');
  }

  const myInfoData = await response.json();
  return myInfoData;
}

// Function to verify JWT using the public key
async function verifyToken(token: string) {
  return new Promise<any>((resolve, reject) => {
    //jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
    jwt.verify(token, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

// Define NextAuth options
const authOptions: NextAuthOptions = {
  providers: [SingPassProvider],
  callbacks: {
    async redirect({ url, baseUrl }) {
      console.log('inside redirect call');
      return `${baseUrl}/dashboard`; // Adjust to your dashboard route
    },
    async signIn({ user, account, profile }) {
      console.log('sign in------', user, account, profile);
      return true;
    },
    async session({ session, token, user }) {
      console.log('inside session --- user: ', user);
      session.user = user;
      return session;
    },
    async jwt({ token, account }) {
      console.log('inside jwt ---')
      if (account) {
        token.accessToken = account.access_token;

        try {
          // Fetch MyInfo data using access token
          const myInfoData = await fetchMyInfoData(token.accessToken as string);

          // Attach MyInfo data to the JWT token
          token.myInfo = myInfoData;

          // Verify JWT if needed (Example)
          const decoded = await verifyToken(token.accessToken as string);
          console.log('Decoded JWT:', decoded);
        } catch (error) {
          console.error('Failed to fetch MyInfo data:', error);
        }
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET as string, // Type assertion
};

// Define the handler for GET and POST requests
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };