import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { TRPCProvider } from "@/trpc/client";
import { Toaster } from "@/components/ui/sonner";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Youtube",
  description: "Youtube is a video sharing platform that allows users to watch, upload, and share videos.",
  keywords: "youtube, video sharing, streaming, entertainment, social media, content creation, online videos",
};

type Props = {
  children: ReactNode;
}

const Layout = ({children}: Props) => {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.className} antialiased tracking-tight font-normal`}>
        <TRPCProvider>
          <Toaster />
          {children}
        </TRPCProvider>
      </body>
    </html>
  );
}

export default Layout;
