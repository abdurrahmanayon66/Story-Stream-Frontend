import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/utils/authConfig";

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_API_URL;

const CREATE_BLOG_MUTATION = `
  mutation CreateBlog($title: String!, $description: String!, $content: String!, $image: Upload!, $genre: [String!]!) {
    createBlog(title: $title, description: $description, content: $content, image: $image, genre: $genre) {
      id
      title
      description
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
    const formData = await request.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const content = formData.get("content") as string;
    const genresRaw = formData.get("genres") as string;
    const imageFile = formData.get("featuredImage") as File;
    const genre = JSON.parse(genresRaw);

    // Prepare GraphQL request
    const operations = JSON.stringify({
      query: CREATE_BLOG_MUTATION,
      variables: {
        title: title.trim(),
        description: description.trim(),
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
    const response = await fetch(GRAPHQL_ENDPOINT + "/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "apollo-require-preflight": "true",
      },
      body: uploadData,
    });

    const result = await response.json();

    // Handle GraphQL errors
    if (result.errors && result.errors.length > 0) {
      const firstError = result.errors[0];
      console.error("GraphQL errors:", result.errors);
      return NextResponse.json(
        { error: firstError.message || "Failed to create post" },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data.createBlog, { status: 200 });
  } catch (error) {
    console.error("Unexpected error in create-blog API:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later" },
      { status: 500 }
    );
  }
}
