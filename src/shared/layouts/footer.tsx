export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-gray-100 bg-white/60 px-6 py-4 text-xs text-gray-500 dark:border-gray-800/60 dark:bg-gray-950/60 dark:text-gray-400 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
        <p>© {year} Performa HRIS · All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="hover:text-brand-600 dark:hover:text-brand-400"
          >
            Privacy
          </a>
          <a
            href="#"
            className="hover:text-brand-600 dark:hover:text-brand-400"
          >
            Terms
          </a>
          <span className="text-gray-300 dark:text-gray-700">·</span>
          <span>v0.1.0</span>
        </div>
      </div>
    </footer>
  );
}
