import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "DevLog — Track your developer journey",
    template: "%s | DevLog",
  },
  description:
    "Log what you learn daily, visualize your streaks, and share your developer journey publicly.",
  keywords: ["developer", "learning", "progress", "streak", "log"],
  openGraph: {
    title: "DevLog",
    description: "Track your developer learning journey.",
    siteName: "DevLog",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-[var(--background)] text-stone-900 dark:text-stone-50">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
