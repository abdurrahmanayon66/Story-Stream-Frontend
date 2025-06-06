// userHooks.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request";
import * as userQueries from "../graphql/userQueries";
import { useAuthenticatedGraphqlClient } from "../utils/authClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

// export const useUserProfile = (userId: number) => {
//   const getClient = useAuthenticatedGraphqlClient();

//   return useQuery({
//     queryKey: ["user", userId],
//     queryFn: async () => {
//       const client = getClient(new GraphQLClient(API_URL));
//       return fetchUserById(client, userId);
//     },
//     enabled: !!userId,
//   });
// };

// // Follow user mutation
// export const useFollowUser = () => {
//   const queryClient = useQueryClient();
//   const getClient = useAuthenticatedGraphqlClient();

//   return useMutation({
//     mutationFn: async ({ userId }: { userId: number }) => {
//       const baseClient = new GraphQLClient(API_URL);
//       const client = getClient(baseClient);
//       return client.request(FOLLOW_USER, { userId });
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries(["followerSuggestions"]);
//       queryClient.invalidateQueries(["user"]);
//     }
//   });
// };

// // Toggle bookmark mutation
// export const useToggleBookmark = () => {
//   const queryClient = useQueryClient();
//   const getClient = useAuthenticatedGraphqlClient();

//   return useMutation({
//     mutationFn: async ({ blogId }: { blogId: number }) => {
//       const baseClient = new GraphQLClient(API_URL);
//       const client = getClient(baseClient);
//       return client.request(TOGGLE_BOOKMARK, { blogId });
//     },
//     onSuccess: (_, { blogId }) => {
//       queryClient.invalidateQueries(["blogs"]);
//       queryClient.invalidateQueries(["blog", blogId]);
//       queryClient.invalidateQueries(["currentUser"]);
//     }
//   });
// };