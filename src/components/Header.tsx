import Link from "next/link";
import { getSiteConfig } from "@/lib/config";
import MobileMenu from "./MobileMenu";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/works", label: "作品集" },
  { href: "/#about", label: "关于" },
];

export default function Header() {
  const siteConfig = getSiteConfig();
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-black/60 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-base font-semibold tracking-tight text-white transition-opacity hover:opacity-80"
        >
          <span className="inline-block h-5 w-5 rounded-md bg-gradient-to-br from-indigo-500 to-violet-500" />
          {siteConfig.title}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <MobileMenu links={navLinks} />
      </div>
    </header>
  );
}
