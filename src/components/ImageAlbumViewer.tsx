"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { AlbumImage } from "@/lib/types";

type ViewMode = "gallery" | "story";

async function downloadImage(src: string, filename: string) {
  try {
    const res = await fetch(src);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "image";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch {
    const a = document.createElement("a");
    a.href = src;
    a.download = filename || "image";
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

function IconClose() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function IconChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function IconDownload() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function Lightbox({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  images: AlbumImage[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const image = images[index];
  const hasPrev = index > 0;
  const hasNext = index < images.length - 1;

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative flex w-full max-w-5xl flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 rounded-full bg-white/[0.08] px-3 py-1 text-xs text-zinc-400">
          {index + 1} / {images.length}
        </div>

        <div className="flex w-full justify-center overflow-hidden rounded-xl border border-white/[0.08]">
          <Image
            src={image.src}
            alt={image.caption}
            width={1200}
            height={900}
            quality={90}
            className="max-h-[70vh] w-auto object-contain"
            sizes="(max-width: 768px) 90vw, 80vw"
          />
        </div>

        {image.caption && (
          <p className="mt-3 max-w-xl text-center text-sm text-zinc-300">
            {image.caption}
          </p>
        )}

        <button
          onClick={onClose}
          className="absolute -top-1 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/80 hover:text-white"
          aria-label="关闭"
        >
          <IconClose />
        </button>

        {hasPrev && (
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-0 top-1/2 -translate-x-12 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.08] text-white/70 backdrop-blur-sm transition-all duration-200 hover:bg-white/[0.16] hover:text-white"
            aria-label="上一张"
          >
            <IconChevronLeft />
          </button>
        )}

        {hasNext && (
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-0 top-1/2 translate-x-12 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.08] text-white/70 backdrop-blur-sm transition-all duration-200 hover:bg-white/[0.16] hover:text-white"
            aria-label="下一张"
          >
            <IconChevronRight />
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function ImageAlbumViewer({
  images,
  title,
}: {
  images: AlbumImage[];
  title: string;
}) {
  const [mode, setMode] = useState<ViewMode>("gallery");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImage = useCallback(
    () => setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i)),
    []
  );
  const nextImage = useCallback(
    () => setLightboxIndex((i) => (i !== null && i < images.length - 1 ? i + 1 : i)),
    [images.length]
  );

  return (
    <section aria-label={title} className="w-full">
      <div className="mb-6 flex items-center gap-2">
        {(["gallery", "story"] as ViewMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
              mode === m
                ? "bg-indigo-600 text-white"
                : "border border-white/[0.08] text-zinc-400 hover:border-white/[0.16] hover:text-zinc-200"
            }`}
          >
            {m === "gallery" ? "多图模式" : "图文模式"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {mode === "gallery" ? (
          <motion.div
            key="gallery"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
          >
            {images.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                className="group relative overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.03] transition-all duration-300 hover:border-white/[0.16] hover:bg-white/[0.05]"
              >
                <button
                  onClick={() => openLightbox(index)}
                  className="relative block aspect-[4/3] w-full overflow-hidden"
                  aria-label={image.caption || `图片 ${index + 1}`}
                >
                  <Image
                    src={image.src}
                    alt={image.caption}
                    fill
                    quality={90}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  {image.caption && (
                    <div className="absolute bottom-2 left-3 right-8 text-left opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <p className="line-clamp-2 text-xs leading-snug text-white/90">
                        {image.caption}
                      </p>
                    </div>
                  )}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadImage(image.src, image.caption);
                  }}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white/70 opacity-0 backdrop-blur-sm transition-all duration-200 group-hover:opacity-100 hover:bg-black/80 hover:text-white"
                  aria-label="下载图片"
                >
                  <IconDownload />
                </button>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="story"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-10"
          >
            {images.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="flex flex-col"
              >
                <div className="relative w-full overflow-hidden rounded-xl border border-white/[0.08]">
                  <Image
                    src={image.src}
                    alt={image.caption}
                    width={1200}
                    height={800}
                    quality={90}
                    className="h-auto w-full object-cover"
                    sizes="(max-width: 768px) 100vw, 80vw"
                  />
                </div>
                {image.caption && (
                  <p className="mt-3 text-sm text-zinc-300">{image.caption}</p>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={images}
            index={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
