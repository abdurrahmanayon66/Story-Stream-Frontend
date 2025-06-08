import { useQuery } from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request";
import * as blogQueries from "../graphql/blogQueries";
import { useAuthenticatedGraphqlClient } from "../utils/authClient";
import { useTabStore } from "../stores/tabStore";
import { User } from "@/types/userType";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

interface BlogResponse {
  blogs?: any[];
  forYouBlogs?: any[];
  mostLikedBlogs?: any[];
  followingBlogs?: any[];
  trendingBlogs?: any[];
  myBlogs?: any[];
}

interface BlogByIdResponse {
  blog: any;
}

interface AuthorByBlogIdResponse {
  authorByBlogId: User;
}

const fetchBlogs = async (client: GraphQLClient, tab: string) => {
  let query;

  switch (tab) {
    case "For You":
      query = blogQueries?.GET_FOR_YOU_BLOGS;
      break;
    // case "Following":
    //   query = blogQueries?.GET_FOLLOWING_BLOGS;
    //   break;
    // case "Trending":
    //   query = blogQueries?.GET_TRENDING_BLOGS;
    //   break;
    case "Most Liked":
      query = blogQueries?.GET_MOST_LIKED_BLOGS;
      break;
    case "My Blogs":
      query = blogQueries?.GET_MY_BLOGS;
      break;
    case "Latest":
    default:
      query = blogQueries?.GET_BLOGS;
      break;
  }

  const data = await client.request<BlogResponse>(query);
  return (
    data.blogs || 
    data.forYouBlogs || 
    data.mostLikedBlogs ||
    data.followingBlogs || 
    data.trendingBlogs || 
    data.myBlogs || 
    []
  );
};

export const useBlogs = () => {
  const getClient = useAuthenticatedGraphqlClient();
  const { activeTab } = useTabStore();

  return useQuery({
    queryKey: ["blogs", activeTab],
    queryFn: async () => {
      const client = getClient(new GraphQLClient(API_URL));
      return fetchBlogs(client, activeTab);
    },
    staleTime: 1000 * 60 * 5,
  });
};

const fetchBlogById = async (client: GraphQLClient, id: number) => {
  const data = await client.request<BlogByIdResponse>(blogQueries?.GET_BLOG_BY_ID, { id });
  return data.blog;
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

const fetchAuthorByBlogId = async (client: GraphQLClient, blogId: number) => {
  const data = await client.request<AuthorByBlogIdResponse>(
    blogQueries?.GET_AUTHOR_BY_BLOG_ID,
    { blogId }
  );
  return data.authorByBlogId;
};

export const useAuthorByBlogId = (blogId: number) => {
  const getClient = useAuthenticatedGraphqlClient();
  return useQuery({
    queryKey: ["author", "blog", blogId],
    queryFn: async () => {
      const client = getClient(new GraphQLClient(API_URL));
      return fetchAuthorByBlogId(client, blogId);
    },
    enabled: !!blogId,
  });
};
