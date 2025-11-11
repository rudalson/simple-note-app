import { createClient } from "@/auth/server";
import { prisma } from "@/db/prisma";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const errorDescription = searchParams.get("error_description");
  const nextParam = searchParams.get("next") || "/";

  const nextPath = nextParam.startsWith("/") ? nextParam : "/";
  const baseUrl = request.nextUrl.origin;

  if (!code) {
    const loginUrl = new URL("/login", baseUrl);
    if (errorDescription) {
      loginUrl.searchParams.set("error", errorDescription);
    }
    return NextResponse.redirect(loginUrl);
  }

  const supabase = await createClient();
  const { data: exchangeData, error } =
    await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const loginUrl = new URL("/login", baseUrl);
    loginUrl.searchParams.set("error", error.message);
    return NextResponse.redirect(loginUrl);
  }

  const user = exchangeData?.user ?? exchangeData?.session?.user ?? null;

  if (user?.id) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: user.email ? { email: user.email } : {},
      create: {
        id: user.id,
        email: user.email ?? "",
      },
    });
  } else {
    const loginUrl = new URL("/login", baseUrl);
    loginUrl.searchParams.set(
      "error",
      "We couldn't finish signing you in with Google. Please try again.",
    );
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.redirect(new URL(nextPath, baseUrl));
}
