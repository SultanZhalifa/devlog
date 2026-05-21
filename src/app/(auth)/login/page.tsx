import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FiGithub, FiZap } from "react-icons/fi";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <FiZap className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold">Sign in to DevLog</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            One click with your GitHub account
          </p>
        </div>

        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/dashboard" });
          }}
        >
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <FiGithub className="h-4 w-4" />
            Continue with GitHub
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-400">
          By signing in, you agree that DevLog may access your public GitHub profile.
        </p>
      </div>
    </div>
  );
}
