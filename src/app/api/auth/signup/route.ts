// File: app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { gql } from '@apollo/client';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_API_URL!;

// Define mutation inline
const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      ... on AuthPayload {
        accessToken
        refreshToken
        user {
          id
          username
          email
          image
        }
      }
      ... on AuthError {
        message
        code
      }
    }
  }
`;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const operations = formData.get('operations') as string;
    const map = JSON.parse(formData.get('map') as string);

    const body = new FormData();
    body.set('operations', operations);
    body.set('map', JSON.stringify(map));

    // Append files to new formData for forward to GraphQL server
    for (const key of Object.keys(map)) {
      const file = formData.get(key);
      if (file instanceof File) {
        body.set(key, file);
      }
    }

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      body,
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Registration API Error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
