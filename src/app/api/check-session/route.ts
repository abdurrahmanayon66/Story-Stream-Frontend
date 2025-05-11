import { NextResponse } from 'next/server';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { cookies } from 'next/headers';

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_URL,
  cache: new InMemoryCache(),
});

const CURRENT_USER_QUERY = gql`
  query {
    currentUser {
      id
      email
      username
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
        }
      }
      ... on AuthError {
        message
        code
      }
    }
  }
`;

interface User {
  id: number;
  email: string;
  username: string;
}

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
    // Get cookies directly from the request
    const cookieStore = cookies();
    const allCookies = cookieStore.getAll();
    console.log('All cookies:', allCookies);

    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    console.log('Session Check - Cookies:', {
      accessToken: accessToken ? accessToken.substring(0, 10) + '...' : 'missing',
      refreshToken: refreshToken ? refreshToken.substring(0, 10) + '...' : 'missing'
    });

    if (!accessToken) {
      console.log('Session Check - No access token cookie found');
      return NextResponse.json({ isAuthenticated: false }, { status: 200 });
    }

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
      console.log('Session Check - currentUser response:', {
        data: result.data,
        errors: result.errors,
      });
      return result;
    };

    // Try currentUser query with accessToken from cookie
    let result: GraphQLResponse = await tryCurrentUserQuery(accessToken);

    // Handle token expiration or invalid token
    if (
      result.errors?.some((err) => err.message.includes('Unauthorized')) ||
      result.data.currentUser === null
    ) {
      console.log('Session Check - Token invalid or unauthorized');
      
      // If we have a refresh token, try to refresh
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
            user: refreshData.user,
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

    console.log('Session Check - Success, user authenticated:', result.data.currentUser);
    return NextResponse.json(
      { isAuthenticated: true, user: result.data.currentUser },
      { status: 200 }
    );
  } catch (error) {
    console.error('Session Check - Error:', error);
    return NextResponse.json({ isAuthenticated: false }, { status: 200 });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Get refresh token from cookies instead of body
    const cookieStore = cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;
    
    console.log('Session Check POST - Refresh token from cookies:', 
      refreshToken ? refreshToken.substring(0, 10) + '...' : 'missing');

    if (!refreshToken) {
      console.log('Session Check POST - No refresh token cookie found');
      return NextResponse.json({ isAuthenticated: false, error: 'No refresh token provided' }, { status: 200 });
    }

    const refreshResult = await client.mutate({
      mutation: REFRESH_TOKEN_MUTATION,
      variables: { refreshToken },
    });

    const refreshData = refreshResult.data.refreshToken;
    console.log('Session Check POST - Refresh token response:', refreshData);

    if (refreshData.__typename === 'AuthError') {
      console.error('Session Check POST - Refresh token error:', refreshData.message);
      return NextResponse.json({ isAuthenticated: false, error: refreshData.message }, { status: 200 });
    }

    // Return new tokens to the frontend
    return NextResponse.json({
      isAuthenticated: true,
      accessToken: refreshData.accessToken,
      refreshToken: refreshData.refreshToken,
      user: refreshData.user,
    }, { status: 200 });
  } catch (error) {
    console.error('Session Check POST - Error:', error);
    return NextResponse.json({ isAuthenticated: false }, { status: 200 });
  }
}