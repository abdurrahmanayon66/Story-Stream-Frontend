import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedGraphqlClient } from "../utils/authClient";
import { TOGGLE_LIKE } from "../graphql/likeQueries";
import { GraphQLClient } from "graphql-request";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const useToggleLike = () => {
  const queryClient = useQueryClient();
  const getClient = useAuthenticatedGraphqlClient();

  return useMutation({
    mutationFn: async ({ blogId }: { blogId: number }) => {
      // Create a completely new client instance
      const baseClient = new GraphQLClient(API_URL);
      const client = getClient(baseClient);
      return client.request(TOGGLE_LIKE, { blogId });
    },
    onSuccess: (_, { blogId }) => {
      queryClient.invalidateQueries(["blogs"]);
      queryClient.invalidateQueries(["blog", blogId]);
    }
  });
};

export default useToggleLike;