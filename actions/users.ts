"use server";

import { createClient } from "@/auth/server";
import { prisma } from "@/db/prisma";
import { handleError } from "@/lib/utils";
import { headers } from "next/headers";

export const loginAction = async (email: string, password: string) => {
  try {
    const { auth } = await createClient();

    const { error } = await auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const logOutAction = async () => {
  try {
    const { auth } = await createClient();

    const { error } = await auth.signOut();
    if (error) throw error;

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const signUpAction = async (email: string, password: string) => {
  try {
    const { auth } = await createClient();

    const { data, error } = await auth.signUp({
      email,
      password,
    });
    if (error) throw error;

    const userId = data.user?.id;
    if (!userId) throw new Error("Error signing up");

    await prisma.user.create({
      data: {
        id: userId,
        email,
      },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

type SignInWithGoogleResult = {
  errorMessage: string | null;
  url?: string;
};

export const signInWithGoogleAction = async (): Promise<SignInWithGoogleResult> => {
  try {
    const client = await createClient();
    const requestHeaders = await headers();
    const baseUrl =
      requestHeaders.get("origin") ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.NEXT_PUBLIC_SITE_URL;

    if (!baseUrl) {
      throw new Error(
        "Missing NEXT_PUBLIC_BASE_URL (or site URL) environment variable.",
      );
    }

    const redirectUrl = new URL("/auth/callback", baseUrl);
    redirectUrl.searchParams.set("next", "/");
    const { data, error } = await client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl.toString(),
      },
    });

    if (error) throw error;

    if (!data?.url) {
      throw new Error("Failed to start Google sign-in");
    }

    return { errorMessage: null, url: data.url };
  } catch (error) {
    return handleError(error);
  }
};