import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { authConfig } from '@/utils/authConfig';  // Adjust path as needed

// 🔒 Custom NextAuth Type Augmentation
declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    graphqlResult?: any;
  }

  interface User {
    accessToken?: string;
    refreshToken?: string;
    graphqlResult?: any;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    graphqlResult?: any;
  }
}

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

// Override authConfig providers and callbacks with full logic
authConfig.providers = [
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
];

authConfig.callbacks!.signIn = async ({ account, profile }) => {
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

      account.accessToken = result.accessToken;
      account.refreshToken = result.refreshToken;
      account.graphqlResult = result;

      return true;
    } catch (error) {
      console.error('Google OAuth error:', error);
      return false;
    }
  }
  return true;
};

const handler = NextAuth(authConfig);
export { handler as GET, handler as POST };