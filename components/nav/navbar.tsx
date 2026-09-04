"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { Bell } from "lucide-react";
import { AgentReadyBadge } from "@/components/agent/agent-ready-badge";

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface NavbarProps {
  items?: NavItem[];
  className?: string;
  rightElement?: React.ReactNode;
}

function NotificationsButton() {
  return (
    <button
      type="button"
      className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 cursor-pointer"
      aria-label="Notifications"
    >
      <Bell className="w-5 h-5" strokeWidth={1.8} />
    </button>
  );
}

function ClerkAuthControls() {
  // Lazy-load Clerk components only when they're actually needed
  const { Show, SignInButton, SignUpButton, UserButton } = require("@clerk/nextjs");
  return (
    <>
      <Show when="signed-out">
        <NotificationsButton />
        <SignInButton mode="modal">
          <button
            type="button"
            className="h-9 rounded-[8px] px-3 text-sm font-medium text-neutral-700 transition-colors hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 cursor-pointer"
          >
            Sign In
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button
            type="button"
            className="h-9 rounded-[8px] bg-primary-500 px-3.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 cursor-pointer"
          >
            Sign Up
          </button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <NotificationsButton />
        <UserButton />
      </Show>
    </>
  );
}

function FallbackAuthControls() {
  return (
    <>
      <NotificationsButton />
      <span className="text-xs text-neutral-400 font-medium px-2">Demo Mode</span>
    </>
  );
}

function AuthControls() {
  const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (hasClerk) {
    return <ClerkAuthControls />;
  }
  return <FallbackAuthControls />;
}

export function Navbar({
  items = [
    { label: "Courses", href: "/courses", active: false },
    { label: "My Learning", href: "/my-learning", active: false },
  ],
  rightElement,
  className,
}: NavbarProps) {
  return (
    <header
      className={cn(
        "w-full bg-white/75 backdrop-blur-md border-b border-neutral-200/80 sticky top-0 z-40 px-6 py-2.5 sm:py-3",
        className
      )}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6 sm:gap-8">
          <Link href="/" className="focus-visible:outline-none">
            <Logo size="md" />
          </Link>

          {/* WebMCP Agent Ready indicator in Nav */}
          <AgentReadyBadge />

          <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary-600 focus-visible:outline-none",
                  item.active
                    ? "text-primary-600 font-semibold"
                    : "text-neutral-700"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {rightElement ? (
          <div className="flex items-center gap-3">{rightElement}</div>
        ) : (
          <div className="flex items-center gap-3.5">
            <AuthControls />
          </div>
        )}
      </div>
    </header>
  );
}

