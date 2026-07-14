"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import type { PanoramaWork } from "@/lib/types";
import WorkCard from "./WorkCard";

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
          : "border border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:border-white/[0.16] hover:text-zinc-200"
      }`}
    >
      {children}
    </button>
  );
}

export default function WorkGrid({ works }: { works: PanoramaWork[] }) {
  const allTags = Array.from(new Set(works.flatMap((w) => w.tags)));
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag ? works.filter((w) => w.tags.includes(activeTag)) : works;

  if (works.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-4 text-zinc-700" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <p className="text-zinc-500">暂无作品</p>
        <p className="mt-1 text-sm text-zinc-600">配置 Notion 数据库后作品将自动展示</p>
      </div>
    );
  }

  return (
    <div>
      {allTags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <FilterButton active={activeTag === null} onClick={() => setActiveTag(null)}>
            全部
          </FilterButton>
          {allTags.map((tag) => (
            <FilterButton
              key={tag}
              active={activeTag === tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            >
              {tag}
            </FilterButton>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty-filtered"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="py-16 text-center text-zinc-500"
          >
            此分类暂无作品
          </motion.div>
        ) : (
          <motion.div
            key={activeTag ?? "all"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((work, i) => (
              <WorkCard key={work.id} work={work} index={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
