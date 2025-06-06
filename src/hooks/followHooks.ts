import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request";
import * as followQueries from "../graphql/followQueries";
import { useAuthenticatedGraphqlClient } from "../utils/authClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const fetchFollowSuggestions = async (client: GraphQLClient) => {
  const data = await client.request(followQueries.GET_FOLLOWER_SUGGESTIONS);
  return data.followerSuggestions || [];
};

export const useFollowerSuggestions = () => {
  const getClient = useAuthenticatedGraphqlClient();

  return useQuery({
    queryKey: ["followSuggestions"],
    queryFn: async () => {
      const client = getClient(new GraphQLClient(API_URL));
      return fetchFollowSuggestions(client);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Toggle follow mutation
export const useToggleFollow = () => {
  const queryClient = useQueryClient();
  const getClient = useAuthenticatedGraphqlClient();

  return useMutation({
    mutationFn: async ({ followerId }: { followerId: number }) => {
      const baseClient = new GraphQLClient(API_URL);
      const client = getClient(baseClient);
      return client.request(followQueries.TOGGLE_FOLLOW, { followerId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["followSuggestions"]);
    }
  });
};