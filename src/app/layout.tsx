import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-zinc-200 py-6 text-center text-xs text-zinc-400 dark:border-zinc-800">
          DevLog © {new Date().getFullYear()} — Built by{" "}
          <a
            href="https://github.com/SultanZhalifa"
            className="hover:text-indigo-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            Sultan Zhalifunnas Musyaffa
          </a>
        </footer>
      </body>
    </html>
  );
}
