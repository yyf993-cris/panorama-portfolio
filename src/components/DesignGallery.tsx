"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { DesignWork } from "@/lib/design-data";

function LightboxModal({
  work,
  onClose,
}: {
  work: DesignWork;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={work.src}
          alt={work.title}
          width={1200}
          height={800}
          className="h-auto max-h-[85vh] w-auto object-contain"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-6 py-4">
          <h3 className="text-lg font-medium text-white">{work.title}</h3>
          <div className="mt-1 flex gap-2">
            {work.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-zinc-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={onClose}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/70 hover:text-white"
          aria-label="关闭"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function DesignGallery({ works }: { works: DesignWork[] }) {
  const [selectedWork, setSelectedWork] = useState<DesignWork | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
        {works.map((work, index) => (
          <motion.div
            key={work.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <button
              onClick={() => setSelectedWork(work)}
              className="group relative block w-full overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.03] transition-all duration-300 hover:border-white/[0.16] hover:bg-white/[0.05]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={work.src}
                  alt={work.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute bottom-2 left-3 right-3 text-left opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="text-sm font-medium text-white">{work.title}</p>
                </div>
              </div>
            </button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedWork && (
          <LightboxModal
            work={selectedWork}
            onClose={() => setSelectedWork(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
