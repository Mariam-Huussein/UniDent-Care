import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../styles/globals.css";
import StoreProvider from "@/components/providers/storeProvider";

export const metadata: Metadata = {
  title: "UniDent Care",
  description: "Your Trusted Dental Care Companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
