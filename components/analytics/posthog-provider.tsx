"use client";

import { useEffect, useRef } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PostHogJsProvider } from "posthog-js/react";
import { useAuth, useUser } from "@clerk/nextjs";

// Links captured events to the signed-in learner by their Clerk user id, so
// per-user analytics stay consistent with the id that keys learner progress.
function PostHogIdentity() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const wasSignedIn = useRef(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && userId) {
      posthog.identify(userId, {
        email: user?.primaryEmailAddress?.emailAddress,
        name: user?.fullName ?? undefined,
      });
      wasSignedIn.current = true;
    } else if (wasSignedIn.current) {
      posthog.reset();
      wasSignedIn.current = false;
    }
  }, [isLoaded, isSignedIn, userId, user]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <PostHogJsProvider client={posthog}>
      <PostHogIdentity />
      {children}
    </PostHogJsProvider>
  );
}
