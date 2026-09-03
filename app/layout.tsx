import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import { PostHogIdentify } from "@/components/posthog-identify";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Verbatim - Design System",
  description: "A unified design language for Verbatim learning platform.",
};

import { WebMCPProvider } from "@/components/webmcp/webmcp-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#FAFCF9] text-neutral-900">
        <ClerkProvider>
          <WebMCPProvider>
            <PostHogIdentify />
            {children}
          </WebMCPProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
