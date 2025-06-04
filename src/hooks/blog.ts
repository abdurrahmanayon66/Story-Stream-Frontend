import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { useBlogStore, TabType, BlogConnection, Blog, BlogFilters, BlogSortBy } from '../stores/blog';
import { GraphQLClient } from 'graphql-request';

// Initialize GraphQL client
const graphqlClient = new GraphQLClient('/api/graphql', {
  credentials: 'include', // Include cookies for authentication
});

// GraphQL queries
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
          name
          username
          image
          profileImage
        }
        createdAt
        updatedAt
        likesCount
        commentsCount
        bookmarksCount
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
          name
          username
          image
          profileImage
        }
        createdAt
        updatedAt
        likesCount
        commentsCount
        bookmarksCount
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
          name
          username
          image
          profileImage
        }
        createdAt
        updatedAt
        likesCount
        commentsCount
        bookmarksCount
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
        name
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
      likesCount
      commentsCount
      bookmarksCount
    }
  }
`;

const CREATE_BLOG = `
  mutation CreateBlog($title: String!, $content: JSON!, $image: Upload, $genre: [String!]!) {
    createBlog(title: $title, content: $content, image: $image, genre: $genre) {
      id
      title
      slug
      content
      image
      genre
      author {
        id
        name
        username
        image
        profileImage
      }
      createdAt
      updatedAt
      likesCount
      commentsCount
      bookmarksCount
    }
  }
`;

const LIKE_BLOG = `
  mutation LikeBlog($blogId: Int!) {
    likeBlog(blogId: $blogId) {
      id
      user {
        id
        name
        username
      }
      blog {
        id
        likesCount
      }
    }
  }
`;

const UNLIKE_BLOG = `
  mutation UnlikeBlog($blogId: Int!) {
    unlikeBlog(blogId: $blogId) {
      success
      message
    }
  }
`;

// Query key factory
export const blogKeys = {
  all: ['blogs'] as const,
  lists: () => [...blogKeys.all, 'list'] as const,
  list: (tab: TabType, filters: BlogFilters, sortBy: BlogSortBy, page: number, limit: number) =>
    [...blogKeys.lists(), tab, filters, sortBy, page, limit] as const,
  details: () => [...blogKeys.all, 'detail'] as const,
  detail: (id: number) => [...blogKeys.details(), id] as const,
};

// Custom hook to get query variables based on tab
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

// Hook to fetch blogs for current tab
export const useBlogs = (options?: Partial<UseQueryOptions<BlogConnection>>) => {
  const { activeTab, filters, sortBy, currentPage, limit, setBlogData, setLoading, setError } = useBlogStore();
  const { getQueryAndVariables } = useTabQueryVariables();

  const { query, variables } = getQueryAndVariables();

  return useQuery({
    queryKey: blogKeys.list(activeTab, filters, sortBy, currentPage, limit),
    queryFn: async (): Promise<BlogConnection> => {
      setLoading(activeTab, true);
      setError(activeTab, null);
      
      try {
        const response = await graphqlClient.request(query, variables);
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
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};

// Hook to fetch blogs for a specific tab
export const useBlogsForTab = (tab: TabType, options?: Partial<UseQueryOptions<BlogConnection>>) => {
  const { filters, sortBy, currentPage, limit, setBlogData, setLoading, setError } = useBlogStore();
  const { getQueryAndVariables } = useTabQueryVariables();

  const { query, variables } = getQueryAndVariables(tab);

  return useQuery({
    queryKey: blogKeys.list(tab, filters, sortBy, currentPage, limit),
    queryFn: async (): Promise<BlogConnection> => {
      setLoading(tab, true);
      setError(tab, null);
      
      try {
        const response = await graphqlClient.request(query, variables);
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
    enabled: false, // Only fetch when explicitly called
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...options,
  });
};

// Hook to fetch a single blog
export const useBlog = (id: number, options?: Partial<UseQueryOptions<Blog>>) => {
  return useQuery({
    queryKey: blogKeys.detail(id),
    queryFn: async (): Promise<Blog> => {
      const response = await graphqlClient.request(GET_BLOG_BY_ID, { id });
      return response.blog;
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes for individual blog posts
    cacheTime: 30 * 60 * 1000, // 30 minutes
    ...options,
  });
};

// Hook to create a blog
export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  const { activeTab, addBlogToTab } = useBlogStore();

  return useMutation({
    mutationFn: async (variables: {
      title: string;
      content: any;
      image?: File;
      genre: string[];
    }) => {
      const response = await graphqlClient.request(CREATE_BLOG, variables);
      return response.createBlog;
    },
    onSuccess: (newBlog: Blog) => {
      // Add the new blog to the current tab
      addBlogToTab(activeTab, newBlog);
      
      // Invalidate and refetch blog lists
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
      
      // Update individual blog cache
      queryClient.setQueryData(blogKeys.detail(newBlog.id), newBlog);
    },
    onError: (error) => {
      console.error('Failed to create blog:', error);
    },
  });
};

// Hook to like a blog
export const useLikeBlog = () => {
  const queryClient = useQueryClient();
  const { updateBlogInTab } = useBlogStore();

  return useMutation({
    mutationFn: async (blogId: number) => {
      const response = await graphqlClient.request(LIKE_BLOG, { blogId });
      return response.likeBlog;
    },
    onSuccess: (likeData, blogId) => {
      // Update all tabs that might contain this blog
      const tabs: TabType[] = ['For You', 'Following', 'Trending', 'Latest', 'Most Liked', 'Explore'];
      
      tabs.forEach(tab => {
        updateBlogInTab(tab, blogId, {
          likesCount: likeData.blog.likesCount,
        });
      });

      // Update individual blog cache
      queryClient.setQueryData(
        blogKeys.detail(blogId),
        (old: Blog | undefined) => 
          old ? { ...old, likesCount: likeData.blog.likesCount } : old
      );

      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to like blog:', error);
    },
  });
};

// Hook to unlike a blog
export const useUnlikeBlog = () => {
  const queryClient = useQueryClient();
  const { updateBlogInTab } = useBlogStore();

  return useMutation({
    mutationFn: async (blogId: number) => {
      const response = await graphqlClient.request(UNLIKE_BLOG, { blogId });
      return response.unlikeBlog;
    },
    onSuccess: (_, blogId) => {
      // Update all tabs that might contain this blog
      const tabs: TabType[] = ['For You', 'Following', 'Trending', 'Latest', 'Most Liked', 'Explore'];
      
      tabs.forEach(tab => {
        updateBlogInTab(tab, blogId, {
          likesCount: Math.max(0, (useBlogStore.getState().blogData[tab]?.blogs.find(b => b.id === blogId)?.likesCount || 1) - 1),
        });
      });

      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to unlike blog:', error);
    },
  });
};

// Hook to prefetch blogs for a tab
export const usePrefetchBlogs = () => {
  const queryClient = useQueryClient();
  const { getQueryAndVariables } = useTabQueryVariables();

  const prefetchTab = async (tab: TabType) => {
    const { query, variables } = getQueryAndVariables(tab);
    
    await queryClient.prefetchQuery({
      queryKey: blogKeys.list(tab, {}, 'latest', 1, 10),
      queryFn: async () => {
        const response = await graphqlClient.request(query, variables);
        return response.blogs || response.forYouBlogs || response.followingBlogs;
      },
      staleTime: 5 * 60 * 1000,
    });
  };

  return { prefetchTab };
};