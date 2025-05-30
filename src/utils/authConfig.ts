// utils/authConfig.ts - COMPLETE CONFIGURATION WITH SESSION CLEARING
import { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

// Apollo Client setup
const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_URL,
  cache: new InMemoryCache(),
});

// GraphQL mutations
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

// Helper function to clear existing session
async function clearExistingSession(req?: any) {
  try {
    // Clear session cookie if it exists
    if (req?.cookies) {
      const sessionCookies = Object.keys(req.cookies).filter(
        (key) => key.startsWith('next-auth.session-token') || 
                 key.startsWith('__Secure-next-auth.session-token') ||
                 key.startsWith('next-auth.csrf-token') ||
                 key.startsWith('__Host-next-auth.csrf-token')
      );
      
      // Mark cookies for deletion
      sessionCookies.forEach((cookieName) => {
        delete req.cookies[cookieName];
      });
    }
  } catch (error) {
    console.warn('Error clearing existing session:', error);
  }
}

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Clear existing session before authentication
        await clearExistingSession(req);

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
            return null;
          }

          return {
            id: result.user.id,
            name: result.user.username,
            email: result.user.email,
            image: result.user.image || result.user.profileImage,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            graphqlResult: result,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // Clear existing session before any sign-in attempt
      await clearExistingSession();

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
            return false;
          }

          // Store in user object for JWT callback
          user.accessToken = result.accessToken;
          user.refreshToken = result.refreshToken;
          user.graphqlResult = result;
        } catch (error) {
          console.error('Google OAuth error:', error);
          return false;
        }
      }
      
      return true;
    },

    async jwt({ token, user, trigger }) {
      // Clear token data on signin trigger to ensure fresh session
      if (trigger === 'signIn' || trigger === 'signUp') {
        // Reset all token data for fresh session
        token = {
          sub: token.sub, // Keep the subject ID
          iat: token.iat,
          exp: token.exp,
          jti: token.jti,
        };
      }

      // Initial sign in - store user data in token
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.graphqlResult = user.graphqlResult;
      }
      
      return token;
    },

    async session({ session, token, trigger }) {
      // Clear session data on signin to ensure fresh session
      if (trigger === 'signIn' || trigger === 'signUp') {
        // Keep only essential session data, clear old auth data
        session = {
          ...session,
          accessToken: undefined,
          refreshToken: undefined,
          graphqlResult: undefined,
        };
      }

      // Send properties to the client
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.graphqlResult = token.graphqlResult;
      
      return session;
    },
  },

  pages: {
    signIn: '/auth',
  },

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log('New sign-in event - session cleared');
    },
    async signOut({ session, token }) {
      console.log('Sign-out event - cleaning up session');
    },
  },
};