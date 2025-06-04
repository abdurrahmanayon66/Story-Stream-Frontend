import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/utils/authConfig";

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_API_URL;

const CREATE_BLOG_MUTATION = `
  mutation CreateBlog($title: String!, $content: JSON!, $image: Upload!, $genre: [String!]!) {
    createBlog(title: $title, content: $content, image: $image, genre: $genre) {
      id
      title
      content
      image
      genre
      createdAt
      author {
        id
        username
        email
      }
    }
  }
`;

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const session = await getServerSession(authConfig);
    if (!session || !session.accessToken) {
      return NextResponse.json(
        { error: "Please log in to create a post" }, 
        { status: 401 }
      );
    }

    const accessToken = session.accessToken;
    
    // Parse form data
    let formData;
    try {
      formData = await request.formData();
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid form data" }, 
        { status: 400 }
      );
    }

    const title = formData.get("title") as string;
    const contentRaw = formData.get("content") as string;
    const genresRaw = formData.get("genres") as string;
    const imageFile = formData.get("featuredImage") as File;

    // Validate required fields
    if (!title?.trim()) {
      return NextResponse.json(
        { error: "Title is required" }, 
        { status: 400 }
      );
    }

    if (!contentRaw) {
      return NextResponse.json(
        { error: "Content is required" }, 
        { status: 400 }
      );
    }

    if (!genresRaw) {
      return NextResponse.json(
        { error: "At least one genre is required" }, 
        { status: 400 }
      );
    }

    if (!imageFile || imageFile.size === 0) {
      return NextResponse.json(
        { error: "Featured image is required" }, 
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(imageFile.type)) {
      return NextResponse.json(
        { error: "Invalid image format. Please upload JPEG, PNG, WebP, or GIF files only" }, 
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    const maxSize = 2 * 1024 * 1024;
    if (imageFile.size > maxSize) {
      return NextResponse.json(
        { error: "Image file too large. Maximum size is 2MB" }, 
        { status: 413 }
      );
    }

    // Parse JSON fields
    let content, genre;
    try {
      content = JSON.parse(contentRaw);
      if (!content || typeof content !== 'object') {
        throw new Error("Invalid content structure");
      }
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid content format" }, 
        { status: 400 }
      );
    }

    try {
      genre = JSON.parse(genresRaw);
      if (!Array.isArray(genre) || genre.length === 0) {
        throw new Error("Invalid genres");
      }
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid genres format" }, 
        { status: 400 }
      );
    }

    // Prepare GraphQL request
    const operations = JSON.stringify({
      query: CREATE_BLOG_MUTATION,
      variables: {
        title: title.trim(),
        content,
        image: null,
        genre,
      },
    });

    const map = JSON.stringify({
      "0": ["variables.image"],
    });

    const uploadData = new FormData();
    uploadData.append("operations", operations);
    uploadData.append("map", map);
    uploadData.append("0", imageFile);

    // Make GraphQL request
    let response;
    try {
      response = await fetch(GRAPHQL_ENDPOINT + "/graphql", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'apollo-require-preflight': 'true',
        },
        body: uploadData,
      });
    } catch (error) {
      console.error("GraphQL request failed:", error);
      return NextResponse.json(
        { error: "Failed to connect to server. Please try again later" }, 
        { status: 500 }
      );
    }

    // Handle GraphQL response
    if (!response.ok) {
      console.error(`GraphQL HTTP Error: ${response.status} ${response.statusText}`);
      
      if (response.status === 401) {
        return NextResponse.json(
          { error: "Your session has expired. Please log in again" }, 
          { status: 401 }
        );
      } else if (response.status === 413) {
        return NextResponse.json(
          { error: "File too large for server" }, 
          { status: 413 }
        );
      } else if (response.status >= 500) {
        return NextResponse.json(
          { error: "Server is currently unavailable. Please try again later" }, 
          { status: 500 }
        );
      } else {
        return NextResponse.json(
          { error: "Failed to create post. Please check your data and try again" }, 
          { status: response.status }
        );
      }
    }

    let result;
    try {
      result = await response.json();
    } catch (error) {
      console.error("Failed to parse GraphQL response:", error);
      return NextResponse.json(
        { error: "Server returned invalid response" }, 
        { status: 500 }
      );
    }

    // Handle GraphQL errors
    if (result.errors && result.errors.length > 0) {
      const firstError = result.errors[0];
      console.error("GraphQL errors:", result.errors);
      
      // Handle specific GraphQL error types
      if (firstError.extensions?.code === 'UNAUTHENTICATED') {
        return NextResponse.json(
          { error: "Authentication failed. Please log in again" }, 
          { status: 401 }
        );
      } else if (firstError.extensions?.code === 'BAD_USER_INPUT') {
        return NextResponse.json(
          { error: firstError.message || "Invalid input data" }, 
          { status: 400 }
        );
      } else if (firstError.message?.includes('duplicate') || firstError.message?.includes('already exists')) {
        return NextResponse.json(
          { error: "A post with this title already exists" }, 
          { status: 409 }
        );
      } else {
        return NextResponse.json(
          { error: firstError.message || "Failed to create post" }, 
          { status: 500 }
        );
      }
    }

    // Check if data was returned
    if (!result.data?.createBlog) {
      console.error("No data returned from GraphQL:", result);
      return NextResponse.json(
        { error: "Post creation failed. No data returned from server" }, 
        { status: 500 }
      );
    }

    return NextResponse.json(result.data.createBlog, { status: 200 });

  } catch (error) {
    console.error("Unexpected error in create-blog API:", error);
    
    // Don't expose internal error details to client
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later" }, 
      { status: 500 }
    );
  }
}