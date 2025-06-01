import { NextResponse } from 'next/server';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/utils/authConfig'; 
import { User } from '@/types/user';

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_URL,
  cache: new InMemoryCache(),
});

const CURRENT_USER_QUERY = gql`
  query {
    currentUser {
      id
      username
      email
      image
      profileImage
      createdAt
    }
  }
`;

const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      ... on AuthPayload {
        accessToken
        refreshToken
        user {
          id
          username
          email
          image
          profileImage
          createdAt
        }
      }
      ... on AuthError {
        message
        code
      }
    }
  }
`;

interface GraphQLResponse {
  data: {
    currentUser?: User;
    refreshToken?: {
      __typename: string;
      accessToken?: string;
      refreshToken?: string;
      user?: User;
      message?: string;
      code?: string;
    };
  };
  errors?: Array<{ message: string }>;
}

export async function GET(request: Request): Promise<NextResponse> {
  try {
    // Get session from NextAuth
    const session = await getServerSession(authConfig);

    console.log('Session Check - Session:', {
      accessToken: session?.accessToken ? session.accessToken.substring(0, 10) + '...' : 'missing',
      refreshToken: session?.refreshToken ? session.refreshToken.substring(0, 10) + '...' : 'missing',
    });

    if (!session || !session.accessToken) {
      console.log('Session Check - No session or access token found');
      return NextResponse.json({ isAuthenticated: false }, { status: 200 });
    }

    const accessToken = session.accessToken;
    const refreshToken = session.refreshToken;

    const tryCurrentUserQuery = async (token: string) => {
      console.log('Session Check - Querying currentUser with token:', token.substring(0, 10) + '...');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: CURRENT_USER_QUERY.loc?.source.body }),
      });

      const result = await response.json();
      return result;
    };

    let result: GraphQLResponse = await tryCurrentUserQuery(accessToken);
    if (
      result.errors?.some((err) => err.message.includes('Unauthorized')) ||
      result.data.currentUser === null
    ) {
      if (refreshToken) {
        console.log('Attempting token refresh...');
        const refreshResult = await client.mutate({
          mutation: REFRESH_TOKEN_MUTATION,
          variables: { refreshToken },
        });

        const refreshData = refreshResult.data.refreshToken;
        if (refreshData.__typename === 'AuthPayload') {
          console.log('Token refresh successful');
          return NextResponse.json({
            isAuthenticated: true,
            accessToken: refreshData.accessToken,
            refreshToken: refreshData.refreshToken,
            user: {
              id: refreshData.user.id,
              username: refreshData.user.username,
              email: refreshData.user.email,
              image: refreshData.user.image,
              profileImage: refreshData.user.profileImage,
              createdAt: refreshData.user.createdAt,
            },
          }, { status: 200 });
        }
      }

      return NextResponse.json({ isAuthenticated: false, error: 'Invalid or expired token' }, { status: 200 });
    }

    if (result.errors || !result.data.currentUser) {
      console.log('Session Check - Final check failed:', {
        errors: result.errors,
        currentUser: result.data.currentUser,
      });
      return NextResponse.json({ isAuthenticated: false }, { status: 200 });
    }

    return NextResponse.json({
      isAuthenticated: true,
      accessToken,
      refreshToken,
      user: {
        id: result.data.currentUser.id,
        username: result.data.currentUser.username,
        email: result.data.currentUser.email,
        image: result.data.currentUser.image,
        profileImage: result.data.currentUser.profileImage,
        createdAt: result.data.currentUser.createdAt,
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Session Check - Error:', error);
    return NextResponse.json({ isAuthenticated: false }, { status: 200 });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession(authConfig);

    if (!session || !session.refreshToken) {
      console.log('Session Check POST - No session or refresh token found');
      return NextResponse.json({ isAuthenticated: false, error: 'No refresh token provided' }, { status: 200 });
    }

    const refreshToken = session.refreshToken;

    const refreshResult = await client.mutate({
      mutation: REFRESH_TOKEN_MUTATION,
      variables: { refreshToken },
    });

    const refreshData = refreshResult.data.refreshToken;

    if (refreshData.__typename === 'AuthError') {
      console.error('Session Check POST - Refresh token error:', refreshData.message);
      return NextResponse.json({ isAuthenticated: false, error: refreshData.message }, { status: 200 });
    }

    // Return new tokens and user data
    return NextResponse.json({
      isAuthenticated: true,
      accessToken: refreshData.accessToken,
      refreshToken: refreshData.refreshToken,
      user: {
        id: refreshData.user.id,
        username: refreshData.user.username,
        email: refreshData.user.email,
        image: refreshData.user.image,
        profileImage: refreshData.user.profileImage,
        createdAt: refreshData.user.createdAt,
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Session Check POST - Error:', error);
    return NextResponse.json({ isAuthenticated: false }, { status: 200 });
  }
}