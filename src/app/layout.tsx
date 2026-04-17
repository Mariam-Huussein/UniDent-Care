import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import StoreProvider from "@/components/providers/storeProvider";
import "../styles/globals.css";
import StoreInitializer from "@/components/providers/storeInitializer";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import icon from "../assets/images/favicon.ico";

export const metadata: Metadata = {
  title: "UniDent Care",
  description: "Your Trusted Dental Care Companion",
  icons: {
    icon: icon.src,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1e40af" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],};

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jakarta.className} font-medium bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300`}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <LanguageProvider>
              <StoreProvider>
                <StoreInitializer />
                {children}
              </StoreProvider>
            </LanguageProvider>
          </ThemeProvider>
      </body>
    </html>
  );
}
