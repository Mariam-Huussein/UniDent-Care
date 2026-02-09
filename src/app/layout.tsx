import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Plus_Jakarta_Sans } from 'next/font/google'
import StoreProvider from "@/components/providers/storeProvider";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "UniDent Care",
  description: "Your Trusted Dental Care Companion",
};

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
})


export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jakarta.className} font-medium`}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
