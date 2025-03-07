import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { TRPCProvider } from "@/trpc/client";
import { Toaster } from "@/components/ui/sonner";
import { AuthModalProvider } from "./(auth)/sign-in/providers/auth-modal-provider";
import { IconAlertSquareRounded, IconBug, IconChecks, IconInfoSquareRounded, IconLoader } from "@tabler/icons-react";

const figtree = Figtree({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "tkiara",
  description: "tkiara is a video sharing platform that allows users to watch, upload, and share videos.",
  keywords: "video sharing, streaming, entertainment, social media, content creation, online videos",
};

type Props = {
  children: ReactNode;
}

const Layout = ({children}: Props) => {
  return (
    <html lang="en">
      <body className={`${figtree.className}`}>
        <TRPCProvider>
          <AuthModalProvider>
            <Toaster
              icons={{
                success: <IconChecks />,
                info: <IconInfoSquareRounded />,
                warning: <IconAlertSquareRounded />,
                error: <IconBug />,
                loading: <IconLoader />,
              }}
            />
            {children}
          </AuthModalProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}

export default Layout;
