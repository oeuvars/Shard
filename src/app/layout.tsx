import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { TRPCProvider } from "@/trpc/client";
import { Toaster } from "@/components/ui/sonner";
import { AuthModalProvider } from "./(auth)/sign-in/providers/auth-modal-provider";

const figtree = Figtree({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shard",
  description: "Shard is a video sharing platform that allows users to watch, upload, and share videos.",
  keywords: "video sharing, streaming, entertainment, social media, content creation, online videos",
};

type Props = {
  children: ReactNode;
}

const Layout = ({children}: Props) => {
  return (
    <html lang="en">
      <body className={`${figtree.className} antialiased tracking-tight font-normal`}>
        <TRPCProvider>
          <AuthModalProvider>
            <Toaster />
            {children}
          </AuthModalProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}

export default Layout;
