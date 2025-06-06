import { GraphQLClient } from 'graphql-request';
import { useSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const defaultClient = new GraphQLClient(API_URL);

export const useAuthenticatedGraphqlClient = () => {
  const { data: session } = useSession();

  return (client: GraphQLClient = defaultClient) => {
    if (!session?.accessToken) {
      return client;
    }

    return new GraphQLClient(client.url ?? API_URL, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });
  };
};
