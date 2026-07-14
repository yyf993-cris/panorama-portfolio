"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface NavLink {
  href: string;
  label: string;
}

export default function MobileMenu({ links }: { links: NavLink[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "关闭菜单" : "打开菜单"}
        aria-expanded={isOpen}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:text-white"
      >
        <motion.div
          animate={isOpen ? "open" : "closed"}
          className="relative h-5 w-5"
        >
          <motion.span
            className="absolute left-0 h-0.5 w-full rounded-full bg-current"
            variants={{ closed: { top: "30%", rotate: 0 }, open: { top: "50%", rotate: 45 } }}
            style={{ originX: 0.5, originY: 0.5 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="absolute left-0 top-1/2 h-0.5 w-full rounded-full bg-current"
            style={{ marginTop: "-1px" }}
            variants={{ closed: { opacity: 1, scaleX: 1 }, open: { opacity: 0, scaleX: 0 } }}
            transition={{ duration: 0.15 }}
          />
          <motion.span
            className="absolute left-0 h-0.5 w-full rounded-full bg-current"
            variants={{ closed: { bottom: "30%", rotate: 0 }, open: { bottom: "50%", rotate: -45 } }}
            style={{ originX: 0.5, originY: 0.5 }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute inset-x-0 top-16 z-50 border-b border-white/[0.06] bg-black/95 backdrop-blur-md"
          >
            <nav className="mx-auto max-w-7xl px-4 py-4">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.18 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center py-3 text-base text-zinc-300 transition-colors hover:text-white border-b border-white/[0.04] last:border-0"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
