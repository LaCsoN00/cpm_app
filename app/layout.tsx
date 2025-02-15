import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import RegisterSW from "./register-sw";

export const metadata: Metadata = {
  title: "CPM",
  description: "Le cabinet qui vous accompagne dans vos projets",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="fr" data-theme="light" suppressHydrationWarning>
        <head>
          <meta name="apple-mobile-web-app-title" content="CPM" />
        </head>
        <body>
          <Toaster position="top-center" />
          <RegisterSW />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
