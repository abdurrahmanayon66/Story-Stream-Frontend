// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse the multipart form data
    const formData = await request.formData();
    
    // Extract the operations and map from form data
    const operationsString = formData.get('operations') as string;
    const mapString = formData.get('map') as string;
    
    if (!operationsString) {
      return NextResponse.json(
        { error: 'Missing operations field' },
        { status: 400 }
      );
    }

    // Parse the GraphQL operation
    const operations = JSON.parse(operationsString);
    const map = mapString ? JSON.parse(mapString) : {};
    
    // Handle file upload if present
    const imageFile = formData.get('0') as File | null;
    
    // Prepare the GraphQL request
    const graphqlFormData = new FormData();
    graphqlFormData.append('operations', operationsString);
    graphqlFormData.append('map', mapString || '{}');
    
    if (imageFile) {
      graphqlFormData.append('0', imageFile);
    }

    // Make request to your GraphQL API with proper headers for Apollo Server
    const graphqlResponse = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
      method: 'POST',
      headers: {
        // Required by Apollo Server to prevent CSRF for multipart requests
        'apollo-require-preflight': 'true',
        // Alternative: you could use 'x-apollo-operation-name': 'Register'
      },
      body: graphqlFormData,
    });

    if (!graphqlResponse.ok) {
      const errorText = await graphqlResponse.text();
      console.error('GraphQL API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to register user' },
        { status: 500 }
      );
    }

    const result = await graphqlResponse.json();

    // Check for GraphQL errors
    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      return NextResponse.json(
        { error: result.errors[0]?.message || 'Registration failed' },
        { status: 400 }
      );
    }

    // Check if registration was successful
    const registerResult = result.data?.register;
    
    if (!registerResult) {
      return NextResponse.json(
        { error: 'No registration result received' },
        { status: 500 }
      );
    }

    // Check if it's an AuthError
    if (registerResult.__typename === 'AuthError' || registerResult.message) {
      return NextResponse.json(
        { 
          error: registerResult.message || 'Registration failed',
          code: registerResult.code 
        },
        { status: 400 }
      );
    }

    // Registration successful - return the result
    // The frontend will handle the automatic login
    return NextResponse.json({
      success: true,
      data: result,
      user: registerResult.user,
      message: 'Registration successful'
    });

  } catch (error) {
    console.error('Registration route error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        details: 'Registration process failed'
      },
      { status: 500 }
    );
  }
}