import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedGraphqlClient } from "../utils/authClient";
import { 
  GET_COMMENTS_BY_BLOG_ID,
  GET_COMMENTS_BY_BLOG_ID_SIMPLE,
  GET_COMMENTS_BY_BLOG_ID_WITH_USERS,
  CREATE_COMMENT,
  CREATE_COMMENT_SIMPLE,
  DELETE_COMMENT,
  TOGGLE_COMMENT_LIKE,
  type GetCommentsByBlogIdVariables,
  type GetCommentsByBlogIdResponse,
  type CreateCommentVariables,
  type CreateCommentResponse,
  type DeleteCommentVariables,
  type DeleteCommentResponse,
  type ToggleCommentLikeVariables,
  type ToggleCommentLikeResponse
} from "../graphql/commentQueries";
import { GraphQLClient } from "graphql-request";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

// QUERY HOOKS

// Get comments by blog ID (full data)
export const useCommentsByBlogId = (blogId: number, enabled: boolean = true) => {
  const getClient = useAuthenticatedGraphqlClient();

  return useQuery({
    queryKey: ["comments", "blog", blogId],
    queryFn: async () => {
      const baseClient = new GraphQLClient(API_URL);
      const client = getClient(baseClient);
      return client.request<GetCommentsByBlogIdResponse, GetCommentsByBlogIdVariables>(
        GET_COMMENTS_BY_BLOG_ID,
        { blogId }
      );
    },
    enabled,
  });
};

// Get comments by blog ID (simple data)
export const useCommentsByBlogIdSimple = (blogId: number, enabled: boolean = true) => {
  const getClient = useAuthenticatedGraphqlClient();

  return useQuery({
    queryKey: ["comments", "blog", blogId, "simple"],
    queryFn: async () => {
      const baseClient = new GraphQLClient(API_URL);
      const client = getClient(baseClient);
      return client.request<GetCommentsByBlogIdResponse, GetCommentsByBlogIdVariables>(
        GET_COMMENTS_BY_BLOG_ID_SIMPLE,
        { blogId }
      );
    },
    enabled,
  });
};

// Get comments by blog ID (with users)
export const useCommentsByBlogIdWithUsers = (blogId: number, enabled: boolean = true) => {
  const getClient = useAuthenticatedGraphqlClient();

  return useQuery({
    queryKey: ["comments", "blog", blogId, "with-users"],
    queryFn: async () => {
      const baseClient = new GraphQLClient(API_URL);
      const client = getClient(baseClient);
      return client.request<GetCommentsByBlogIdResponse, GetCommentsByBlogIdVariables>(
        GET_COMMENTS_BY_BLOG_ID_WITH_USERS,
        { blogId }
      );
    },
    enabled,
  });
};

// MUTATION HOOKS

// Create comment hook
export const useCreateComment = () => {
  const queryClient = useQueryClient();
  const getClient = useAuthenticatedGraphqlClient();

  return useMutation({
    mutationFn: async (variables: CreateCommentVariables) => {
      const client = getClient(); 
      return client.request<CreateCommentResponse, CreateCommentVariables>(
        CREATE_COMMENT,
        variables
      );
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments"]
      });
      queryClient.setQueryData(
        ["comments", "blog", variables.blogId],
        (oldData: GetCommentsByBlogIdResponse | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            commentsByBlogId: [...oldData.commentsByBlogId, data.createComment]
          };
        }
      );
    },
  });
};


// Create comment simple hook
export const useCreateCommentSimple = () => {
  const queryClient = useQueryClient();
  const getClient = useAuthenticatedGraphqlClient();

  return useMutation({
    mutationFn: async (variables: CreateCommentVariables) => {
      const baseClient = new GraphQLClient(API_URL);
      const client = getClient(baseClient);
      return client.request<CreateCommentResponse, CreateCommentVariables>(
        CREATE_COMMENT_SIMPLE,
        variables
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", "blog", variables.blogId]
      });
      queryClient.invalidateQueries({
        queryKey: ["blog", variables.blogId]
      });
      queryClient.invalidateQueries({
        queryKey: ["blogs"]
      });
    },
  });
};

// Delete comment hook
export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  const getClient = useAuthenticatedGraphqlClient();

  return useMutation({
    mutationFn: async ({ commentId, blogId }: DeleteCommentVariables & { blogId: number }) => {
      const baseClient = new GraphQLClient(API_URL);
      const client = getClient(baseClient);
      return client.request<DeleteCommentResponse, DeleteCommentVariables>(
        DELETE_COMMENT,
        { commentId }
      );
    },
    onSuccess: (_, { commentId, blogId }) => {
      // Invalidate comments for the blog
      queryClient.invalidateQueries({
        queryKey: ["comments", "blog", blogId]
      });
      
      // Invalidate blog queries
      queryClient.invalidateQueries({
        queryKey: ["blog", blogId]
      });
      queryClient.invalidateQueries({
        queryKey: ["blogs"]
      });

      // Optimistically remove comment from cache
      queryClient.setQueryData(
        ["comments", "blog", blogId],
        (oldData: GetCommentsByBlogIdResponse | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            commentsByBlogId: oldData.commentsByBlogId.filter(comment => comment.id !== commentId)
          };
        }
      );
    },
  });
};

// Toggle comment like hook
export const useToggleCommentLike = () => {
  const queryClient = useQueryClient();
  const getClient = useAuthenticatedGraphqlClient();

  return useMutation({
    mutationFn: async ({ commentId, blogId }: ToggleCommentLikeVariables & { blogId: number }) => {
      const baseClient = new GraphQLClient(API_URL);
      const client = getClient(baseClient);
      return client.request<ToggleCommentLikeResponse, ToggleCommentLikeVariables>(
        TOGGLE_COMMENT_LIKE,
        { commentId }
      );
    },
    onSuccess: (data, { commentId, blogId }) => {
      // Invalidate comments for the blog to refresh like counts
      queryClient.invalidateQueries({
        queryKey: ["comments", "blog", blogId]
      });

      // Optionally update like status optimistically
      queryClient.setQueryData(
        ["comments", "blog", blogId],
        (oldData: GetCommentsByBlogIdResponse | undefined) => {
          if (!oldData) return oldData;
          
          const updateCommentLikes = (comments: any[]) => {
            return comments.map(comment => {
              if (comment.id === commentId) {
                // Toggle logic would depend on your current user context
                // This is a simplified version
                return {
                  ...comment,
                  isLiked: data.toggleCommentLike,
                  likesCount: comment.likesCount + (data.toggleCommentLike ? 1 : -1)
                };
              }
              // Also update replies if they exist
              if (comment.replies) {
                return {
                  ...comment,
                  replies: updateCommentLikes(comment.replies)
                };
              }
              return comment;
            });
          };

          return {
            ...oldData,
            commentsByBlogId: updateCommentLikes(oldData.commentsByBlogId)
          };
        }
      );
    },
  });
};

// UTILITY HOOKS

// Get comment count for a blog
export const useCommentCount = (blogId: number) => {
  const { data } = useCommentsByBlogIdSimple(blogId);
  return data?.commentsByBlogId?.length || 0;
};

// Check if user has liked a comment
export const useIsCommentLiked = (commentId: number, userId: number, blogId: number) => {
  const { data } = useCommentsByBlogIdWithUsers(blogId);
  
  const comment = data?.commentsByBlogId?.find(c => c.id === commentId);
  return comment?.likes?.some(like => like.userId === userId) || false;
};

// Get replies for a specific comment
export const useCommentReplies = (parentCommentId: number, blogId: number) => {
  const { data } = useCommentsByBlogId(blogId);
  
  const replies = data?.commentsByBlogId?.filter(
    comment => comment.parentCommentId === parentCommentId
  ) || [];
  
  return replies;
};