import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { UserAvatar } from "@/components/social/UserAvatar";
import {
  FiZap,
  FiLogOut,
  FiPlusSquare,
  FiBarChart2,
  FiCompass,
  FiSettings,
} from "react-icons/fi";

export async function Navbar() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/60 bg-white/70 backdrop-blur-xl dark:border-stone-800/60 dark:bg-stone-950/70">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-amber-600 transition-colors hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
        >
          <FiZap className="h-5 w-5" />
          <span>DevLog</span>
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            <Link
              href="/write"
              className="flex items-center gap-1.5 text-sm font-medium text-stone-600 transition-colors hover:text-amber-600 dark:text-stone-400 dark:hover:text-amber-400"
            >
              <FiPlusSquare className="h-4 w-4" />
              <span className="hidden sm:block">Write</span>
            </Link>
            <Link
              href="/analytics"
              className="flex items-center gap-1.5 text-sm font-medium text-stone-600 transition-colors hover:text-amber-600 dark:text-stone-400 dark:hover:text-amber-400"
            >
              <FiBarChart2 className="h-4 w-4" />
              <span className="hidden sm:block">Analytics</span>
            </Link>
            <Link
              href="/explore"
              className="flex items-center gap-1.5 text-sm font-medium text-stone-600 transition-colors hover:text-amber-600 dark:text-stone-400 dark:hover:text-amber-400"
            >
              <FiCompass className="h-4 w-4" />
              <span className="hidden sm:block">Explore</span>
            </Link>

            <div className="flex items-center gap-2 border-l border-stone-200 pl-4 dark:border-stone-700">
              <Link
                href={`/${user.username}`}
                className="flex items-center gap-2 transition-opacity hover:opacity-80"
              >
                <UserAvatar
                  src={user.image ?? undefined}
                  name={user.name ?? ""}
                  size="sm"
                />
                <span className="hidden text-sm font-medium sm:block dark:text-stone-200">
                  {user.name}
                </span>
              </Link>

              <Link
                href="/settings"
                className="rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200"
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
                  className="rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200"
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
            className="rounded-xl bg-amber-500 px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-amber-600 hover:shadow-md hover:shadow-amber-200/40 dark:hover:shadow-amber-900/20"
          >
            Sign in
          </Link>
        )}
      </nav>
    </header>
  );
}
