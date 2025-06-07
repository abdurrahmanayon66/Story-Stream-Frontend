import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request";
import * as followQueries from "../graphql/followQueries";
import { useAuthenticatedGraphqlClient } from "../utils/authClient";
import { useSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const fetchFollowSuggestions = async (
  client: GraphQLClient,
  cursor?: number
) => {
  const data = await client.request(followQueries.GET_FOLLOWER_SUGGESTIONS, {
    cursor,
    limit: 5,
  });
  return data.followerSuggestions || { users: [], nextCursor: null };
};

// New infinite query hook
export const useInfiniteFollowerSuggestions = () => {
  const { status } = useSession();
  const getClient = useAuthenticatedGraphqlClient();

  return useInfiniteQuery({
    queryKey: ["infiniteFollowSuggestions"],
    queryFn: async ({ pageParam = null }) => {
      const client = getClient(new GraphQLClient(API_URL));
      const result = await fetchFollowSuggestions(client, pageParam);
      return result.users || [];
    },
    getNextPageParam: (lastPage, allPages) => {
      // If the last page has less than 5 items, there are no more pages
      if (lastPage.length < 5) {
        return undefined;
      }
      // Use the last user's id as the cursor for the next page
      return lastPage[lastPage.length - 1]?.id || undefined;
    },
    staleTime: 1000 * 60 * 5,
    initialPageParam: null,
    enabled: status === "authenticated",
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
      queryClient.invalidateQueries({
        queryKey: ["infiniteFollowSuggestions"],
      });
    },
  });
};
