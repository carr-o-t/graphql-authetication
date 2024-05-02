import * as z from "zod";

import { client } from "@/components/ApolloWrapper";
import { LOGIN_MUTATION } from "@/lib/graphql-api";
import { LoginSchema } from "@/lib/validations/auth";
import { toast } from "sonner";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;

  try {
    const { data } = await client.mutate({
      mutation: LOGIN_MUTATION,
      variables: { email, password },
    });

    return data;
  } catch (error: any) {
    toast.error("Login failed", {
      description: error.message,
    });
    return {
      error: error.message,
    };
  }
};
