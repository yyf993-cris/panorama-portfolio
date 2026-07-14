"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Work } from "@/lib/types";

function LocationIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function WorkCard({ work, index = 0, viewCount }: { work: Work; index?: number; viewCount?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
    >
      <Link href={`/works/${work.id}`} className="group block">
        <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03] transition-all duration-300 hover:border-white/[0.16] hover:bg-white/[0.05]">
          <div className="relative aspect-video overflow-hidden bg-zinc-900">
            {work.cover && work.cover !== "/placeholder.jpg" ? (
              <Image
                src={work.cover}
                alt={work.title}
                fill
                quality={90}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-950 via-zinc-900 to-violet-950">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-zinc-600" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-zinc-300 backdrop-blur-sm">
              {work.type === "panorama" ? "全景" : "套图"}
            </span>

            {work.featured && (
              <span className="absolute left-3 top-3 rounded-full bg-indigo-500/90 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                精选
              </span>
            )}

            {work.description && (
              <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="line-clamp-2 text-xs leading-relaxed text-white/80">{work.description}</p>
              </div>
            )}
          </div>

          <div className="p-4">
            <h3 className="line-clamp-1 font-medium text-zinc-100">{work.title}</h3>

            {(work.location || (viewCount ?? work.views) > 0) && (
              <div className="mt-2 flex items-center gap-3 text-[11px] text-zinc-500">
                {work.location && (
                  <span className="flex items-center gap-1">
                    <LocationIcon />
                    {work.location}
                  </span>
                )}
                {(viewCount ?? work.views) > 0 && (
                  <span className="ml-auto flex items-center gap-1">
                    <EyeIcon />
                    {(viewCount ?? work.views).toLocaleString("zh-CN")}
                  </span>
                )}
              </div>
            )}

            {work.tags.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {work.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/[0.06] px-2.5 py-0.5 text-[11px] text-zinc-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <div className="mt-3 h-5" />
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
