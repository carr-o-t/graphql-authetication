import * as z from "zod";

import { client } from "@/components/ApolloWrapper";
import { RegisterSchema } from "@/lib/validations/auth";
import { toast } from "sonner";
import { SIGNUP_MUTATION } from "@/lib/graphql-api";

export const signup = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, firstName, lastName, phoneNumber, username } =
    validatedFields.data;

  try {
    const { data } = await client.mutate({
      mutation: SIGNUP_MUTATION,
      variables: {
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        username,
      },
    });
    return data;
  } catch (error: any) {
    toast.error("Signup failed", {
      description: error.message,
    });
    return {
      error: error.message,
    };
  }
};
