import NextAuth, { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { JWT } from 'next-auth/jwt';
import { DefaultSession } from 'next-auth';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { setCookie } from 'cookies-next';

// Extend Session and JWT types
interface ExtendedSession extends DefaultSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  accessToken: string;
  refreshToken: string;
}

interface ExtendedJWT extends JWT {
  id: string;
  accessToken: string;
  refreshToken: string;
}

// Apollo Client for backend GraphQL
const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_URL,
  cache: new InMemoryCache(),
});

// GraphQL mutation for credentials login
const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ... on AuthPayload {
        accessToken
        refreshToken
        user {
          id
          username
          email
          image
          profileImage
        }
      }
      ... on AuthError {
        message
        code
      }
    }
  }
`;

// GraphQL mutation for Google OAuth login
const OAUTH_LOGIN_MUTATION = gql`
  mutation OAuthLogin($input: OAuthInput!) {
    oauthLogin(input: $input) {
      ... on AuthPayload {
        accessToken
        refreshToken
        user {
          id
          username
          email
          image
          profileImage
        }
      }
      ... on AuthError {
        message
        code
      }
    }
  }
`;

// NextAuth configuration
const authConfig: NextAuthConfig = {
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const { data } = await client.mutate({
            mutation: LOGIN_MUTATION,
            variables: {
              email: credentials.email,
              password: credentials.password,
            },
          });

          const result = data.login;

          if (result.__typename === 'AuthError') {
            throw new Error(result.message);
          }

          // Set client-side cookies (only accessToken and refreshToken)
          const cookieOptions = {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            path: '/',
            domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : undefined,
          };

          setCookie('auth.accessToken', result.accessToken, {
            ...cookieOptions,
            maxAge: 15 * 60, // 15 minutes
          });
          setCookie('auth.refreshToken', result.refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60, // 7 days
          });

          return {
            id: result.user.id.toString(),
            name: result.user.username,
            email: result.user.email,
            image: result.user.image || result.user.profileImage,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
          };
        } catch (error) {
          console.error('Credentials authorization error:', error);
          throw new Error('Invalid credentials');
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'select_account',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === 'google' && profile) {
        try {
          const { data } = await client.mutate({
            mutation: OAUTH_LOGIN_MUTATION,
            variables: {
              input: {
                provider: 'google',
                providerId: profile.sub,
                email: profile.email,
                name: profile.name,
                profileImage: profile.picture,
              },
            },
          });

          const result = data.oauthLogin;

          if (result.__typename === 'AuthError') {
            throw new Error(result.message);
          }

          // Set client-side cookies (only accessToken and refreshToken)
          const cookieOptions = {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            path: '/',
            domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : undefined,
          };

          setCookie('auth.accessToken', result.accessToken, {
            ...cookieOptions,
            maxAge: 15 * 60, // 15 minutes
          });
          setCookie('auth.refreshToken', result.refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60, // 7 days
          });

          account.accessToken = result.accessToken;
          account.refreshToken = result.refreshToken;
          account.userId = result.user.id.toString();
          return true;
        } catch (error) {
          console.error('OAuth signIn error:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        token.id = account.userId || user.id;
        token.accessToken = account.accessToken || user.accessToken;
        token.refreshToken = account.refreshToken || user.refreshToken;
      }
      return token as ExtendedJWT;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session as ExtendedSession;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/home`;
    },
  },
};

const authHandler = NextAuth(authConfig);

export const GET = authHandler;
export const POST = authHandler;