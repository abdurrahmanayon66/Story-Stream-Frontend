import { useQuery } from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request";
import { GET_BLOGS, GET_BLOG_BY_ID, GET_FOR_YOU_BLOGS } from "../graphql/blogQueries";
import { useAuthenticatedGraphqlClient } from "../utils/authClient";
import { useTabStore } from "../stores/tabStore"; 

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

// Unified fetch function that handles all query types
const fetchBlogs = async (client: GraphQLClient, queryName: string) => {
  let query;
  
  switch(queryName) {
    case "GET_FOR_YOU_BLOGS":
      query = GET_FOR_YOU_BLOGS;
      break;
    case "GET_BLOGS":
    default:
      query = GET_BLOGS;
      break;
    // Add more cases as you implement other queries
  }

  const data = await client.request(query);
  return data.blogs || data.forYouBlogs?.blogs || []; // Handle different response structures
};

const fetchBlogById = async (client: GraphQLClient, id: number) => {
  const data = await client.request(GET_BLOG_BY_ID, { id });
  return data.blog;
};

// Single hook for all blog listings
export const useBlogs = () => {
  const getClient = useAuthenticatedGraphqlClient();
  const { getActiveResolver } = useTabStore();
  
  return useQuery({
    queryKey: ["blogs", getActiveResolver()], // Include resolver in query key
    queryFn: async () => {
      const client = getClient(new GraphQLClient(API_URL));
      return fetchBlogs(client, getActiveResolver());
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useBlog = (id: number) => {
  const getClient = useAuthenticatedGraphqlClient();
  return useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const client = getClient(new GraphQLClient(API_URL));
      return fetchBlogById(client, id);
    },
    enabled: !!id,
  });
};