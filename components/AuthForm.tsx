"use client";

import { toast } from "sonner"
import { useRouter } from "next/navigation";
import { CardContent, CardFooter } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState, useTransition } from "react";
import type { SVGProps } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import {
  loginAction,
  signInWithGoogleAction,
  signUpAction,
} from "@/actions/users";
import { Separator } from "./ui/separator";

type Props = {
  type: "login" | "signUp";
};

function AuthForm({ type }: Props) {
  const isLoginForm = type === "login";

  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<"password" | "google" | null>(null);

  const handleSubmit = (formData: FormData) => {
    setPendingAction("password");
    startTransition(async () => {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      let errorMessage;
      if (isLoginForm) {
        errorMessage = (await loginAction(email, password)).errorMessage;
      } else {
        errorMessage = (await signUpAction(email, password)).errorMessage;
      }

      if (!errorMessage) {
        router.replace(`/?toastType=${type}`);
      } else {
        toast("Error", {
          description: errorMessage,
          //   variant: "destructive",
        });
      }

      setPendingAction(null);
    });
  };

  const handleGoogleSignIn = () => {
    setPendingAction("google");
    startTransition(async () => {
      try {
        const result = await signInWithGoogleAction();

        if (result?.errorMessage) {
          toast("Error", {
            description: result.errorMessage,
          });
          setPendingAction(null);
          return;
        }

        setPendingAction(null);
      } catch {
        setPendingAction(null);
      }
    });
  };

  return (
    <form action={handleSubmit}>
      <CardContent className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="Enter your email"
            type="email"
            required
            disabled={isPending}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            placeholder="Enter your password"
            type="password"
            required
            disabled={isPending}
          />
        </div>
      </CardContent>
      <CardFooter className="mt-4 flex flex-col gap-6">
        <Button className="w-full" disabled={isPending}>
          {isPending && pendingAction === "password" ? (
            <Loader2 className="animate-spin" />
          ) : isLoginForm ? (
            "Login"
          ) : (
            "Sign Up"
          )}
        </Button>
        <div className="w-full space-y-4">
          <div className="flex items-center gap-4">
            <Separator className="flex-1" />
            <span className="text-muted-foreground text-xs uppercase tracking-wide">
              Or continue with
            </span>
            <Separator className="flex-1" />
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isPending}
          >
            {isPending && pendingAction === "google" ? (
              <Loader2 className="animate-spin" />
            ) : (
              <span className="flex items-center justify-center gap-2">
                <GoogleIcon className="size-4" />
                Continue with Google
              </span>
            )}
          </Button>
        </div>
        <p className="text-xs">
          {isLoginForm
            ? "Don't have an account yet?"
            : "Already have an account?"}{" "}
          <Link
            href={isLoginForm ? "/sign-up" : "/login"}
            className={`text-blue-500 underline ${isPending ? "pointer-events-none opacity-50" : ""}`}
          >
            {isLoginForm ? "Sign Up" : "Login"}
          </Link>
        </p>
      </CardFooter>
    </form>
  );
}

export default AuthForm;

function GoogleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      focusable="false"
      {...props}
    >
      <path
        d="M23.49 12.27c0-.84-.07-1.63-.21-2.4H12v4.54h6.44c-.28 1.45-1.12 2.68-2.38 3.51v2.92h3.85c2.25-2.07 3.58-5.12 3.58-8.57z"
        fill="#4285F4"
      />
      <path
        d="M12 24c3.24 0 5.96-1.07 7.95-2.89l-3.85-2.92c-1.07.72-2.45 1.15-4.1 1.15-3.15 0-5.82-2.13-6.78-4.99H1.21v3.14C3.19 21.76 7.27 24 12 24z"
        fill="#34A853"
      />
      <path
        d="M5.22 14.35c-.24-.72-.38-1.49-.38-2.35s.14-1.63.38-2.35V6.51H1.21A11.96 11.96 0 0 0 0 12c0 1.92.46 3.74 1.21 5.49l4.01-3.14z"
        fill="#FBBC05"
      />
      <path
        d="M12 4.77c1.76 0 3.33.61 4.57 1.8l3.42-3.42C17.96 1.21 15.24 0 12 0 7.27 0 3.19 2.24 1.21 6.51l4.01 3.14C6.18 6.9 8.85 4.77 12 4.77z"
        fill="#EA4335"
      />
    </svg>
  );
}

