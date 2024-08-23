// app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth';
import { NextAuthOptions } from 'next-auth';
import { OAuthConfig } from 'next-auth/providers/oauth';

const SingPassProvider: OAuthConfig<any> = {
  id: 'singpass',
  name: 'SingPass',
  type: 'oauth',
  wellKnown: 'https://stg-id.singpass.gov.sg/.well-known/openid-configuration',
  authorization: {
    params: {
      scope: 'openid',
      response_type: 'code',
    },
  },
  idToken: true,
  checks: ['pkce', 'state'],
  clientId: process.env.SINGPASS_CLIENT_ID,
  clientSecret: process.env.SINGPASS_CLIENT_SECRET,
  profile(profile) {
    return {
      id: profile.sub,
      name: profile.name,
      email: profile.email,
    };
  },
  client: {
    token_endpoint_auth_method: 'client_secret_post',
  },
};

const authOptions: NextAuthOptions = {
  providers: [SingPassProvider],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // Custom logic for sign-in if needed
      return true;
    },
    async session({ session, user }) {
      session.user = user;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
