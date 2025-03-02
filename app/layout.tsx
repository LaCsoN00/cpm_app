import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "CPM",
  description: "Le cabinet qui vous accompagne dans vos projets",
  icons: {
    icon: "/icons/favicon.svg",
  },
  manifest: "/manifest.ts",
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
          <link rel="shortcut icon" href="/favicon.svg" />
          <meta name="apple-mobile-web-app-title" content="cpm app" />
          <link rel="manifest" href="/manifest.ts" />
        </head>
        <body>
          <Toaster position="top-center" />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
