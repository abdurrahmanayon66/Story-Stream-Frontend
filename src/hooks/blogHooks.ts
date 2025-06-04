import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { useBlogStore, TabType, BlogConnection, Blog, BlogFilters, BlogSortBy } from '../stores/blogStore';
import { GraphQLClient } from 'graphql-request';
import { useSession } from 'next-auth/react';

const graphqlClient = new GraphQLClient(process.env.NEXT_PUBLIC_API_URL!);

export const useAuthenticatedGraphqlClient = () => {
  const { data: session } = useSession();
  return (client = graphqlClient) => {
    if (!session?.accessToken) {
      return client;
    }

    return new GraphQLClient(client.url, {
      headers: {
        authorization: `Bearer ${session.accessToken}`,
      },
    });
  };
};

const GET_BLOGS = `
  query GetBlogs($input: BlogsInput!) {
    blogs(input: $input) {
      blogs {
        id
        title
        slug
        content
        image
        genre
        author {
          id
          fullName
          username
          image
          profileImage
        }
        createdAt
      }
      pagination {
        currentPage
        totalPages
        totalCount
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

const GET_FOR_YOU_BLOGS = `
  query GetForYouBlogs($input: BlogsInput!) {
    forYouBlogs(input: $input) {
      blogs {
        id
        title
        slug
        content
        image
        genre
        author {
          id
          fullName
          username
          image
          profileImage
        }
        createdAt
      }
      pagination {
        currentPage
        totalPages
        totalCount
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

const GET_FOLLOWING_BLOGS = `
  query GetFollowingBlogs($input: BlogsInput!) {
    followingBlogs(input: $input) {
      blogs {
        id
        title
        slug
        content
        image
        genre
        author {
          id
          fullName
          username
          image
          profileImage
        }
        createdAt
      }
      pagination {
        currentPage
        totalPages
        totalCount
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

// NEW: Random blogs query
const GET_RANDOM_BLOGS = `
  query GetRandomBlogs($input: BlogsInput!) {
    randomBlogs(input: $input) {
      blogs {
        id
        title
        slug
        content
        image
        genre
        author {
          id
          fullName
          username
          image
          profileImage
        }
        createdAt
      }
      pagination {
        currentPage
        totalPages
        totalCount
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

// NEW: Blogs by genres query
const GET_BLOGS_BY_GENRES = `
  query GetBlogsByGenres($genres: [String!]!, $input: BlogsInput!) {
    blogsByGenres(genres: $genres, input: $input) {
      blogs {
        id
        title
        slug
        content
        image
        genre
        author {
          id
          fullName
          username
          image
          profileImage
        }
        createdAt
      }
      pagination {
        currentPage
        totalPages
        totalCount
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

const GET_BLOG_BY_ID = `
  query GetBlog($id: Int!) {
    blog(id: $id) {
      id
      title
      slug
      content
      image
      genre
      author {
        id
        fullName
        username
        image
        profileImage
      }
      createdAt
      updatedAt
      comments {
        id
        content
        createdAt
        user {
          id
          name
          username
          image
        }
      }
      likes {
        id
        user {
          id
          name
          username
        }
      }
      bookmarks {
        id
        user {
          id
          name
          username
        }
      }
    }
  }
`;

export const blogKeys = {
  all: ['blogs'] as const,
  lists: () => [...blogKeys.all, 'list'] as const,
  list: (tab: TabType, filters: BlogFilters, sortBy: BlogSortBy, page: number, limit: number) =>
    [...blogKeys.lists(), tab, filters, sortBy, page, limit] as const,
  details: () => [...blogKeys.all, 'detail'] as const,
  detail: (id: number) => [...blogKeys.details(), id] as const,
  // NEW: Keys for new queries
  random: (page: number, limit: number, sortBy: BlogSortBy) =>
    [...blogKeys.all, 'random', page, limit, sortBy] as const,
  genres: (genres: string[], page: number, limit: number, sortBy: BlogSortBy) =>
    [...blogKeys.all, 'genres', genres, page, limit, sortBy] as const,
};

const useTabQueryVariables = () => {
  const { activeTab, filters, sortBy, currentPage, limit } = useBlogStore();

  const getQueryVariables = (tab: TabType = activeTab) => ({
    input: {
      page: currentPage,
      limit,
      sortBy: sortBy.toUpperCase() as any,
      filters: Object.keys(filters).length > 0 ? filters : undefined,
    },
  });

  const getQueryAndVariables = (tab: TabType = activeTab) => {
    const variables = getQueryVariables(tab);
    switch (tab) {
      case 'For You':
        return { query: GET_FOR_YOU_BLOGS, variables };
      case 'Following':
        return { query: GET_FOLLOWING_BLOGS, variables };
      case 'Trending':
        return {
          query: GET_BLOGS,
          variables: {
            input: {
              ...variables.input,
              sortBy: 'TRENDING',
            },
          },
        };
      case 'Latest':
        return {
          query: GET_BLOGS,
          variables: {
            input: {
              ...variables.input,
              sortBy: 'LATEST',
            },
          },
        };
      case 'Most Liked':
        return {
          query: GET_BLOGS,
          variables: {
            input: {
              ...variables.input,
              sortBy: 'MOST_LIKED',
            },
          },
        };
      case 'Explore':
      default:
        return { query: GET_BLOGS, variables };
    }
  };

  return { getQueryVariables, getQueryAndVariables };
};

export const useBlogs = (options?: Partial<UseQueryOptions<BlogConnection>>) => {
  const { activeTab, filters, sortBy, currentPage, limit, setBlogData, setLoading, setError } = useBlogStore();
  const { getQueryAndVariables } = useTabQueryVariables();
  const getAuthClient = useAuthenticatedGraphqlClient();

  const { query, variables } = getQueryAndVariables();

  return useQuery({
    queryKey: blogKeys.list(activeTab, filters, sortBy, currentPage, limit),
    queryFn: async (): Promise<BlogConnection> => {
      setLoading(activeTab, true);
      setError(activeTab, null);
      try {
        const authClient = getAuthClient(graphqlClient);
        const response = await authClient.request(query, variables);
        const data = response.blogs || response.forYouBlogs || response.followingBlogs;
        setBlogData(activeTab, data);
        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch blogs';
        setError(activeTab, errorMessage);
        throw error;
      } finally {
        setLoading(activeTab, false);
      }
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useBlogsForTab = (tab: TabType, options?: Partial<UseQueryOptions<BlogConnection>>) => {
  const { filters, sortBy, currentPage, limit, setBlogData, setLoading, setError } = useBlogStore();
  const { getQueryAndVariables } = useTabQueryVariables();
  const getAuthClient = useAuthenticatedGraphqlClient();

  const { query, variables } = getQueryAndVariables(tab);

  return useQuery({
    queryKey: blogKeys.list(tab, filters, sortBy, currentPage, limit),
    queryFn: async (): Promise<BlogConnection> => {
      setLoading(tab, true);
      setError(tab, null);
      try {
        const authClient = getAuthClient(graphqlClient);
        const response = await authClient.request(query, variables);
        const data = response.blogs || response.forYouBlogs || response.followingBlogs;
        setBlogData(tab, data);
        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch blogs';
        setError(tab, errorMessage);
        throw error;
      } finally {
        setLoading(tab, false);
      }
    },
    enabled: false,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useBlog = (id: number, options?: Partial<UseQueryOptions<Blog>>) => {
  const getAuthClient = useAuthenticatedGraphqlClient();

  return useQuery({
    queryKey: blogKeys.detail(id),
    queryFn: async (): Promise<Blog> => {
      const authClient = getAuthClient(graphqlClient);
      const response = await authClient.request(GET_BLOG_BY_ID, { id });
      return response.blog;
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    ...options,
  });
};

// NEW: Hook for random blogs
export const useRandomBlogs = (
  page: number = 1,
  limit: number = 10,
  sortBy: BlogSortBy = 'latest',
  options?: Partial<UseQueryOptions<BlogConnection>>
) => {
  const getAuthClient = useAuthenticatedGraphqlClient();

  return useQuery({
    queryKey: blogKeys.random(page, limit, sortBy),
    queryFn: async (): Promise<BlogConnection> => {
      const authClient = getAuthClient(graphqlClient);
      const response = await authClient.request(GET_RANDOM_BLOGS, {
        input: {
          page,
          limit,
          sortBy: sortBy.toUpperCase(),
        },
      });
      return response.randomBlogs;
    },
    staleTime: 2 * 60 * 1000, // Shorter stale time for random content
    cacheTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...options,
  });
};

// NEW: Hook for blogs by genres
export const useBlogsByGenres = (
  genres: string[],
  page: number = 1,
  limit: number = 10,
  sortBy: BlogSortBy = 'latest',
  options?: Partial<UseQueryOptions<BlogConnection>>
) => {
  const getAuthClient = useAuthenticatedGraphqlClient();

  return useQuery({
    queryKey: blogKeys.genres(genres, page, limit, sortBy),
    queryFn: async (): Promise<BlogConnection> => {
      const authClient = getAuthClient(graphqlClient);
      const response = await authClient.request(GET_BLOGS_BY_GENRES, {
        genres,
        input: {
          page,
          limit,
          sortBy: sortBy.toUpperCase(),
        },
      });
      return response.blogsByGenres;
    },
    enabled: genres.length > 0,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const usePrefetchBlogs = () => {
  const queryClient = useQueryClient();
  const { getQueryAndVariables } = useTabQueryVariables();
  const getAuthClient = useAuthenticatedGraphqlClient();

  const prefetchTab = async (tab: TabType) => {
    const { query, variables } = getQueryAndVariables(tab);
    await queryClient.prefetchQuery({
      queryKey: blogKeys.list(tab, {}, 'latest', 1, 10),
      queryFn: async () => {
        const authClient = getAuthClient(graphqlClient);
        const response = await authClient.request(query, variables);
        return response.blogs || response.forYouBlogs || response.followingBlogs;
      },
      staleTime: 5 * 60 * 1000,
    });
  };

  // NEW: Prefetch random blogs
  const prefetchRandomBlogs = async () => {
    await queryClient.prefetchQuery({
      queryKey: blogKeys.random(1, 10, 'latest'),
      queryFn: async () => {
        const authClient = getAuthClient(graphqlClient);
        const response = await authClient.request(GET_RANDOM_BLOGS, {
          input: { page: 1, limit: 10, sortBy: 'LATEST' },
        });
        return response.randomBlogs;
      },
      staleTime: 2 * 60 * 1000,
    });
  };

  // NEW: Prefetch blogs by genres
  const prefetchBlogsByGenres = async (genres: string[]) => {
    if (genres.length === 0) return;
    
    await queryClient.prefetchQuery({
      queryKey: blogKeys.genres(genres, 1, 10, 'latest'),
      queryFn: async () => {
        const authClient = getAuthClient(graphqlClient);
        const response = await authClient.request(GET_BLOGS_BY_GENRES, {
          genres,
          input: { page: 1, limit: 10, sortBy: 'LATEST' },
        });
        return response.blogsByGenres;
      },
      staleTime: 5 * 60 * 1000,
    });
  };

  return { prefetchTab, prefetchRandomBlogs, prefetchBlogsByGenres };
};