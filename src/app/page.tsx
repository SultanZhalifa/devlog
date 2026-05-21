import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FiZap, FiActivity, FiGlobe, FiGithub } from "react-icons/fi";

export default async function LandingPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
        <FiZap className="h-3.5 w-3.5" />
        Built for developers, by a developer
      </div>

      <h1 className="mb-4 max-w-2xl text-5xl font-bold leading-tight tracking-tight">
        Track your{" "}
        <span className="text-indigo-600 dark:text-indigo-400">developer journey</span>,
        one day at a time
      </h1>

      <p className="mb-10 max-w-xl text-lg text-zinc-500 dark:text-zinc-400">
        Log what you learn and build daily, visualize your streaks like GitHub contributions,
        and optionally share your progress with the world.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/login"
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          <FiGithub className="h-4 w-4" />
          Start with GitHub
        </Link>
        <Link
          href="/explore"
          className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          <FiGlobe className="h-4 w-4" />
          Browse public logs
        </Link>
      </div>

      <div className="mt-24 grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-3xl w-full">
        {[
          {
            icon: <FiZap className="h-6 w-6 text-indigo-500" />,
            title: "Daily entries",
            desc: "Write what you learned, built, or fixed.",
          },
          {
            icon: <FiActivity className="h-6 w-6 text-indigo-500" />,
            title: "Streak calendar",
            desc: "See your consistency at a glance — just like GitHub contributions.",
          },
          {
            icon: <FiGlobe className="h-6 w-6 text-indigo-500" />,
            title: "Share publicly",
            desc: "Your public profile shows entries, streaks, and top tags.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-zinc-200 bg-white p-6 text-left shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="mb-3">{f.icon}</div>
            <h3 className="mb-1 font-semibold">{f.title}</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
