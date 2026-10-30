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
      {/* Warm gradient background */}
      <div className="warm-gradient dark:warm-gradient-dark pointer-events-none fixed inset-0 -z-10" />

      <div className="animate-scale-in w-full max-w-sm rounded-2xl border border-stone-200/80 bg-white/90 p-8 shadow-lg shadow-amber-100/20 backdrop-blur-sm dark:border-stone-800 dark:bg-stone-900/90 dark:shadow-amber-900/10">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 text-white shadow-md shadow-amber-200/40 dark:shadow-amber-900/20">
            <FiZap className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-stone-900 dark:text-stone-50">
            Sign in to DevLog
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400">
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
            className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-stone-900 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-stone-800 hover:shadow-md dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
          >
            <FiGithub className="h-4 w-4" />
            Continue with GitHub
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-stone-400 dark:text-stone-500">
          By signing in, you agree that DevLog may access your public GitHub profile.
        </p>
      </div>
    </div>
  );
}
