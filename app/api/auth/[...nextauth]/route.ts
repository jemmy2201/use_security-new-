// app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions } from 'next-auth';
import { OAuthConfig } from 'next-auth/providers/oauth';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

// Read the private and public keys from the file system
const privateKey = fs.readFileSync(path.join(process.cwd(), 'path/to/private-key.pem'), 'utf8');
const publicKey = fs.readFileSync(path.join(process.cwd(), 'path/to/public-key.pem'), 'utf8');

// Define the SingPass provider configuration
const SingPassProvider: OAuthConfig<any> = {
  id: 'singpass',
  name: 'SingPass',
  type: 'oauth',
  wellKnown: process.env.SINGPASS_WELLKNOWN_URL as string,
  authorization: {
    params: {
      scope: 'openid',
      response_type: 'code',
      redirect_uri: process.env.SINGPASS_REDIRECT_URI as string, 
    },
  },
  idToken: true,
  checks: ['pkce', 'state'],
  clientId: process.env.SINGPASS_CLIENT_ID as string, 
  clientSecret: process.env.SINGPASS_CLIENT_SECRET as string, 
  profile(profile) {
    return {
      id: profile.sub,
      name: profile.name,
      email: profile.email,
    };
  },
  client: {
    token_endpoint_auth_method: 'private_key_jwt',
    privateKey: privateKey,
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
    jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
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
    async signIn({ user, account, profile }) {
      return true;
    },
    async session({ session, token, user }) {
      session.user = user;
      return session;
    },
    async jwt({ token, account }) {
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
