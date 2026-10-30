import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FiZap, FiActivity, FiGlobe, FiGithub } from "react-icons/fi";

export default async function LandingPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
      {/* Warm gradient background */}
      <div className="warm-gradient dark:warm-gradient-dark pointer-events-none fixed inset-0 -z-10" />

      <div className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-amber-50/80 px-4 py-1.5 text-sm font-medium text-amber-700 backdrop-blur-sm dark:border-amber-800/40 dark:bg-amber-950/40 dark:text-amber-300">
        <FiZap className="h-3.5 w-3.5" />
        Built for developers, by a developer
      </div>

      <h1 className="animate-fade-in-up mb-4 max-w-2xl text-5xl leading-tight font-bold tracking-tight text-stone-900 dark:text-stone-50">
        Track your{" "}
        <span className="text-amber-600 dark:text-amber-400">developer journey</span>, one
        day at a time
      </h1>

      <p
        className="animate-fade-in-up mb-10 max-w-xl text-lg text-stone-500 dark:text-stone-400"
        style={{ animationDelay: "100ms" }}
      >
        Log what you learn and build daily, visualize your streaks like GitHub
        contributions, and optionally share your progress with the world.
      </p>

      <div
        className="animate-fade-in-up flex flex-wrap items-center justify-center gap-4"
        style={{ animationDelay: "200ms" }}
      >
        <Link
          href="/login"
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-amber-200/40 transition-all duration-200 hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-200/50 dark:shadow-amber-900/20 dark:hover:shadow-amber-900/30"
        >
          <FiGithub className="h-4 w-4" />
          Start with GitHub
        </Link>
        <Link
          href="/explore"
          className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white/80 px-6 py-3 text-sm font-semibold text-stone-700 shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-md dark:border-stone-700 dark:bg-stone-900/80 dark:text-stone-300 dark:hover:bg-stone-800"
        >
          <FiGlobe className="h-4 w-4" />
          Browse public logs
        </Link>
      </div>

      <div className="stagger-children mt-24 grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
        {[
          {
            icon: <FiZap className="h-6 w-6 text-amber-500" />,
            title: "Daily entries",
            desc: "Write what you learned, built, or fixed.",
          },
          {
            icon: <FiActivity className="h-6 w-6 text-amber-500" />,
            title: "Streak calendar",
            desc: "See your consistency at a glance — just like GitHub contributions.",
          },
          {
            icon: <FiGlobe className="h-6 w-6 text-amber-500" />,
            title: "Share publicly",
            desc: "Your public profile shows entries, streaks, and top tags.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-stone-200/80 bg-white/80 p-6 text-left shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-stone-300/80 hover:shadow-md hover:shadow-amber-100/30 dark:border-stone-800 dark:bg-stone-900/80 dark:hover:border-stone-700 dark:hover:shadow-amber-900/10"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/40">
              {f.icon}
            </div>
            <h3 className="mb-1 font-semibold text-stone-800 dark:text-stone-200">
              {f.title}
            </h3>
            <p className="text-sm text-stone-500 dark:text-stone-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
