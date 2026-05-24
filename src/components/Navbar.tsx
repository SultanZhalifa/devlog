import Link from "next/link";
import Image from "next/image";
import { auth, signOut } from "@/lib/auth";
import { FiZap, FiLogOut, FiUser, FiPlusSquare, FiBarChart2, FiCompass, FiSettings } from "react-icons/fi";

export async function Navbar() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400">
          <FiZap className="h-5 w-5" />
          <span>DevLog</span>
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            <Link
              href="/write"
              className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
            >
              <FiPlusSquare className="h-4 w-4" />
              <span className="hidden sm:block">Write</span>
            </Link>
            <Link
              href="/analytics"
              className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
            >
              <FiBarChart2 className="h-4 w-4" />
              <span className="hidden sm:block">Analytics</span>
            </Link>
            <Link
              href="/explore"
              className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
            >
              <FiCompass className="h-4 w-4" />
              <span className="hidden sm:block">Explore</span>
            </Link>

            <div className="flex items-center gap-2 border-l border-zinc-200 pl-4 dark:border-zinc-700">
              <Link
                href={`/${(user as typeof user & { username?: string }).username}`}
                className="flex items-center gap-2 hover:opacity-80"
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name ?? ""}
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white">
                    <FiUser className="h-4 w-4" />
                  </div>
                )}
                <span className="hidden text-sm font-medium sm:block dark:text-zinc-200">
                  {user.name}
                </span>
              </Link>

              <Link
                href="/settings"
                className="rounded p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                title="Settings"
              >
                <FiSettings className="h-4 w-4" />
              </Link>

              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="rounded p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                  title="Sign out"
                >
                  <FiLogOut className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Sign in
          </Link>
        )}
      </nav>
    </header>
  );
}
