export function Footer() {
  return (
    <footer className="border-t border-stone-200/60 py-6 text-center text-xs text-stone-400 dark:border-stone-800/60 dark:text-stone-500">
      DevLog © {new Date().getFullYear()} — Built by{" "}
      <a
        href="https://github.com/SultanZhalifa"
        className="transition-colors hover:text-amber-600 dark:hover:text-amber-400"
        target="_blank"
        rel="noopener noreferrer"
      >
        Sultan Zhalifunnas Musyaffa
      </a>
    </footer>
  );
}
