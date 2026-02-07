"use client";

import { TextField } from "@/components/layout/common/input";
import { FieldValues, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { LoginFormParams } from "@/lib/jespo/contracts";
import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import Button from "@/components/layout/common/button";
import { HorizontalLine } from "@/components/layout/common/line";
import { AiOutlineGoogle } from "react-icons/ai";
import Link from "next/link";

interface LoginFormProps extends LoginFormParams {
  nextUrl?: string;
}

export default function LoginForm({
  loggedInUser,
  nextUrl,
}: LoginFormProps): React.ReactElement {
  const header = `Sign in to Jespo Gadgets`;
  const headerClassname = "mb-1";
  const [isLoading, setIsLoading] = useState(false);

  const loginLabel = `${isLoading ? "Loading" : "Log in"}`;
  const googleLoginLabel = `Continue with Google`;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  useEffect(() => {
    if (loggedInUser) {
      router.push("/");
      router.refresh();
    }
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
        setIsLoading(false);
      } else if (result?.ok) {
        toast.success("Login successful!");
        // Redirect to nextUrl if provided, otherwise go to home
        const redirectUrl = nextUrl && nextUrl !== "/" ? nextUrl : "/";
        router.push(redirectUrl);
        router.refresh();
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      setIsLoading(false);
    }
  });

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <TextField
          id={"email"}
          label={"Email"}
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <TextField
          id={"password"}
          label={"Password"}
          disabled={isLoading}
          register={register}
          errors={errors}
          type="password"
          required
        />
      </div>

      <Button label={loginLabel} onClick={onSubmit} disabled={isLoading} />

      <HorizontalLine or />

      <Button
        Icon={AiOutlineGoogle}
        label={googleLoginLabel}
        onClick={() => signIn("google", { callbackUrl: nextUrl || "/" })}
        outline
        disabled={isLoading}
      />

      <div className="text-center">
        <p className="text-gray-600 text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
          >
            Create one here
          </Link>
        </p>
      </div>
    </div>
  );
}
