import { createClient } from "@/auth/server";
import { prisma } from "@/db/prisma";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const errorDescription = searchParams.get("error_description");
  const nextParam = searchParams.get("next") || "/";

  const nextPath = nextParam.startsWith("/") ? nextParam : "/";

  if (!code) {
    const loginUrl = new URL("/login", process.env.NEXT_PUBLIC_BASE_URL);
    if (errorDescription) {
      loginUrl.searchParams.set("error", errorDescription);
    }
    return NextResponse.redirect(loginUrl);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const loginUrl = new URL("/login", process.env.NEXT_PUBLIC_BASE_URL);
    loginUrl.searchParams.set("error", error.message);
    return NextResponse.redirect(loginUrl);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.id) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: user.email ? { email: user.email } : {},
      create: {
        id: user.id,
        email: user.email ?? "",
      },
    });
  }

  return NextResponse.redirect(
    new URL(nextPath, process.env.NEXT_PUBLIC_BASE_URL),
  );
}
