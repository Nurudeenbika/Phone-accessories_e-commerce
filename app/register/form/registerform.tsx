"use client";

import { LoggedInUserParams } from "@/lib/jespo/contracts";
import React, { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { TextField } from "@/components/layout/common/input";
import Button from "@/components/layout/common/button";
import { HorizontalLine } from "@/components/layout/common/line";
import { signIn } from "next-auth/react";
import { AiOutlineGoogle } from "react-icons/ai";
import Link from "next/link";
import toast from "react-hot-toast";

interface RegisterFormProps extends LoggedInUserParams {
  nextUrl?: string;
}

export default function RegisterForm({
  loggedInUser,
  nextUrl,
}: RegisterFormProps): React.ReactElement {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (loggedInUser) {
      router.push("/");
      router.refresh();
    }
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Account created successfully! Please sign in.");
        // Redirect to login with nextUrl if provided
        const loginUrl = nextUrl
          ? `/login?next=${encodeURIComponent(nextUrl)}`
          : "/login";
        router.push(loginUrl);
      } else {
        toast.error(result.error || "Registration failed");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <TextField
          id="name"
          label="Full Name"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <TextField
          id="email"
          label="Email"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <TextField
          id="password"
          label="Password"
          disabled={isLoading}
          register={register}
          errors={errors}
          type="password"
          required
        />
      </div>

      <Button
        label={isLoading ? "Creating Account..." : "Create Account"}
        onClick={onSubmit}
        disabled={isLoading}
      />

      <HorizontalLine or />

      <Button
        label={"Sign up with Google"}
        onClick={() => signIn("google", { callbackUrl: nextUrl || "/" })}
        Icon={AiOutlineGoogle}
        outline
        disabled={isLoading}
      />

      <div className="text-center">
        <p className="text-gray-600 text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
