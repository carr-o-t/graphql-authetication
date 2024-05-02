"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { login } from "@/actions/login";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormControl, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginSchema } from "@/lib/validations/auth";
import Button from "@mui/material/Button";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";
import { setCookie } from "@/actions/set-cookie";
import { AUTH_TOKEN_KEY } from "@/config";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const LoginForm = () => {
  const router = useRouter();
  const [error, setError] = useState<any | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values)
        .then((data: any) => {
          if (data?.error) {
            setError(data?.error);
          } else {
            form.reset();
            setSuccess("Login success. Redirecting to Dashboard...");

            toast.promise(
              async () =>
                await setCookie(
                  AUTH_TOKEN_KEY,
                  data.signin.token,
                  parseInt(data.signin.expiresIn)
                ),
              {
                loading: "redirecting to dashboard...",
                success: (data) => {
                  router.push("/dashboard");
                  return `Welcome to Dashboard`;
                },
                error: "Error",
              }
            );
          }
        })
        .catch((error: any) => {
          const e = error;
          setError("Login failed");
        });
    });
  };

  return (
    <CardWrapper
      headerLabel="Welcome back!"
      headerHeading="Sign in"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/signup"
    >
      {/* <Form {...form}> */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div
          className="space-y-4 flex flex-col"
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <FormControl
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <FormLabel
              style={{
                color: "hsl(215 20.2% 65.1%)",
                fontSize: "14px !important",
              }}
            >
              Email
            </FormLabel>
            <Input
              control={form.control}
              name="email"
              placeholder="john.doe@example.com"
              type="email"
              disabled={isPending}
              className="mui-input"
            />
          </FormControl>
          <FormControl
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <FormLabel
              style={{
                color: "hsl(215 20.2% 65.1%)",
                fontSize: "14px !important",
              }}
            >
              Password
            </FormLabel>
            <Input
              control={form.control}
              name="password"
              placeholder="******"
              type="password"
              disabled={isPending}
              className="mui-input"
            />
          </FormControl>
        </div>
        <FormError message={error} />
        <FormSuccess message={success} />
        <div
          className=""
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "end",
            marginTop: "1rem",
          }}
        >
          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
            variant="outlined"
            // style={{ color: "#9957ff" }}
          >
            Login
          </Button>
        </div>
      </form>
      {/* </Form> */}
    </CardWrapper>
  );
};
