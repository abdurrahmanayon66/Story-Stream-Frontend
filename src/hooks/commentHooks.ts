import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedGraphqlClient } from "../utils/authClient";
import {
  GET_COMMENTS_BY_BLOG_ID,
  CREATE_COMMENT,
  DELETE_COMMENT,
  TOGGLE_COMMENT_LIKE,
  type GetCommentsByBlogIdVariables,
  type GetCommentsByBlogIdResponse,
  type CreateCommentVariables,
  type CreateCommentResponse,
  type DeleteCommentVariables,
  type DeleteCommentResponse,
  type ToggleCommentLikeVariables,
  type ToggleCommentLikeResponse,
} from "../graphql/commentQueries";
import { GraphQLClient } from "graphql-request";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export const useCommentsByBlogId = (
  blogId: number,
  enabled: boolean = true
) => {
  const getClient = useAuthenticatedGraphqlClient();

  return useQuery({
    queryKey: ["comments", "blog", blogId],
    queryFn: async () => {
      const baseClient = new GraphQLClient(API_URL);
      const client = getClient(baseClient);

      const res = await client.request<
        GetCommentsByBlogIdResponse,
        GetCommentsByBlogIdVariables
      >(GET_COMMENTS_BY_BLOG_ID, { blogId });
      return {
        comments: res.commentsByBlogId,
      };
    },
    enabled,
  });
};

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
        queryKey: ["comments"],
      });
      queryClient.setQueryData(
        ["comments", "blog", variables.blogId],
        (oldData: GetCommentsByBlogIdResponse | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            commentsByBlogId: [...oldData.commentsByBlogId, data.createComment],
          };
        }
      );
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  const getClient = useAuthenticatedGraphqlClient();

  return useMutation({
    mutationFn: async ({
      commentId,
      blogId,
    }: DeleteCommentVariables & { blogId: number }) => {
      const baseClient = new GraphQLClient(API_URL);
      const client = getClient(baseClient);
      return client.request<DeleteCommentResponse, DeleteCommentVariables>(
        DELETE_COMMENT,
        { commentId }
      );
    },
    onSuccess: (_, { commentId, blogId }) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", "blog", blogId],
      });

      queryClient.invalidateQueries({
        queryKey: ["blog", blogId],
      });
      queryClient.invalidateQueries({
        queryKey: ["blogs"],
      });

      queryClient.setQueryData(
        ["comments", "blog", blogId],
        (oldData: GetCommentsByBlogIdResponse | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            commentsByBlogId: oldData.commentsByBlogId.filter(
              (comment) => comment.id !== commentId
            ),
          };
        }
      );
    },
  });
};

export const useToggleCommentLike = () => {
  const queryClient = useQueryClient();
  const getClient = useAuthenticatedGraphqlClient();

  return useMutation({
    mutationFn: async ({
      commentId,
      blogId,
    }: ToggleCommentLikeVariables & { blogId: number }) => {
      const baseClient = new GraphQLClient(API_URL);
      const client = getClient(baseClient);
      return client.request<
        ToggleCommentLikeResponse,
        ToggleCommentLikeVariables
      >(TOGGLE_COMMENT_LIKE, { commentId });
    },
    onSuccess: (data, { commentId, blogId }) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", "blog", blogId],
      });

      queryClient.setQueryData(
        ["comments", "blog", blogId],
        (oldData: GetCommentsByBlogIdResponse | undefined) => {
          if (!oldData) return oldData;

          const updateCommentLikes = (comments: any[]) => {
            return comments.map((comment) => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  isLiked: data.toggleCommentLike,
                  likesCount:
                    comment.likesCount + (data.toggleCommentLike ? 1 : -1),
                };
              }

              if (comment.replies) {
                return {
                  ...comment,
                  replies: updateCommentLikes(comment.replies),
                };
              }
              return comment;
            });
          };

          return {
            ...oldData,
            commentsByBlogId: updateCommentLikes(oldData.commentsByBlogId),
          };
        }
      );
    },
  });
};
