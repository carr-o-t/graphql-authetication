import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  firstName: z.string().min(1, {
    message: "fisrt name is required",
  }),
  lastName: z.string().optional(),
  username: z
    .string()
    .min(3, {
      message: "username should be atleats 3 characters in length",
    })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: "username can only have a-z,A-Z, and 0-9",
    }),
  phoneNumber: z.string(),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});
