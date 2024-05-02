"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { signup } from "@/actions/signup";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormControl, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RegisterSchema } from "@/lib/validations/auth";
import Button from "@mui/material/Button";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";
import { useRouter } from "next/navigation";

export const SignUpForm = () => {
  const router = useRouter();
  const [error, setError] = useState<any | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      username: "",
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      signup(values)
        .then((data: any) => {
          if (data?.error) {
            setError(data?.error);
          } else {
            form.reset();
            setSuccess("Signup success. Redirecting to Login...");
            router.push("/auth/login");
          }
        })
        .catch((error: any) => {
          const e = error;
          setError("Signup failed");
        });
    });
  };

  return (
    <CardWrapper
      headerLabel="Create an account"
      headerHeading="Sign up"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
    >
      {/* <Form {...form}> */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div
          className="space-y-4 flex flex-col"
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div style={{ display: "flex", flexDirection: "row", gap: "0.5rem" }}>
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
                First name
              </FormLabel>
              <Input
                control={form.control}
                name="firstName"
                placeholder="John"
                type="text"
                disabled={isPending}
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
                Last name
              </FormLabel>
              <Input
                control={form.control}
                name="lastName"
                placeholder="Doe"
                type="text"
                disabled={isPending}
                className="mui-input"
              />
            </FormControl>
          </div>
          <div style={{ display: "flex", flexDirection: "row", gap: "0.5rem" }}>
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
                Username
              </FormLabel>
              <Input
                control={form.control}
                name="username"
                placeholder="Doe"
                type="text"
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
                Phone
              </FormLabel>
              <Input
                control={form.control}
                name="phoneNumber"
                placeholder="Doe"
                type="text"
                disabled={isPending}
                className="mui-input"
              />
            </FormControl>
          </div>

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
            style={{ cursor: isPending ? "not-allowed" : "pointer" }}
          >
            Signup
          </Button>
        </div>
      </form>
      {/* </Form> */}
    </CardWrapper>
  );
};
