import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Enter a valid email",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  firstName: z.string().min(1, {
    message: "First name is required",
  }),
  lastName: z.string().optional(),
  username: z
    .string()
    .min(3, {
      message: "Username must be at least 3 characters",
    })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: "Username can only contain letters and numbers",
    }),
  phoneNumber: z.string(),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Enter a valid email",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});
