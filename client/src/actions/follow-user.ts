import * as z from "zod";

import { client } from "@/components/ApolloWrapper";
import { toast } from "sonner";
import { FOLLOW_USER } from "@/lib/graphql-api";
import { AUTH_TOKEN_KEY } from "@/config";
import Cookies from "js-cookie";

export const followUser = async (ID: string, username: string) => {
  const token = Cookies.get(AUTH_TOKEN_KEY);

  try {
    const { data } = await client.mutate({
      mutation: FOLLOW_USER,
      variables: { userId: ID },
      context: {
        headers: {
          Authorization: token,
        },
      },
    });

    return data;
  } catch (error: any) {
    toast.error(`Failed to follow user ${username}`, {
      description: error.message,
    });
    return {
      error: error.message,
    };
  }
};
