import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const hasClerkKey = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

const clerk = hasClerkKey ? clerkMiddleware() : undefined;

export default function proxy(request: any, event: any) {
  if (clerk) {
    return clerk(request, event);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};

