"use client";

import { useEffect, useRef, useState } from "react";
import "pannellum/build/pannellum.css";

const EMBED_DOMAINS = [
  "vr.shinewonder.com",
  "720yun.com",
  "www.720yun.com",
];

const EXTERNAL_ONLY_DOMAINS = [
  "vr.justeasy.cn",
];

function isEmbedUrl(url: string): boolean {
  try {
    const hostname = new URL(url).hostname;
    return EMBED_DOMAINS.some((d) => hostname === d || hostname.endsWith("." + d));
  } catch {
    return false;
  }
}

function isExternalOnlyUrl(url: string): boolean {
  try {
    const hostname = new URL(url).hostname;
    return EXTERNAL_ONLY_DOMAINS.some((d) => hostname === d || hostname.endsWith("." + d));
  } catch {
    return false;
  }
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-indigo-500" />
      <p className="text-sm text-muted">正在加载全景图...</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-[50vh] items-center justify-center rounded-xl border border-border bg-surface">
      <div className="text-center text-muted">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto mb-3 opacity-40" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <p className="text-sm">暂无全景图</p>
      </div>
    </div>
  );
}

function EmbedViewer({ url, title }: { url: string; title: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-border"
      style={{ height: "clamp(300px, 70vh, 800px)" }}
    >
      {!loaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-900">
          <LoadingSpinner />
        </div>
      )}
      <iframe
        src={url}
        title={title}
        onLoad={() => setLoaded(true)}
        className="h-full w-full border-0"
        allow="accelerometer; gyroscope; fullscreen; xr-spatial-tracking"
        allowFullScreen
      />
    </div>
  );
}

function PannellumRenderer({ url, title }: { url: string; title: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<PannellumViewer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;

    const init = async () => {
      try {
        await import("pannellum");
        if (cancelled || !containerRef.current) return;

        viewerRef.current = window.pannellum.viewer(containerRef.current, {
          type: "equirectangular",
          panorama: url,
          autoLoad: true,
          autoRotate: -2,
          compass: true,
          showZoomCtrl: true,
          showFullscreenCtrl: true,
          title,
        });

        setIsLoading(false);
      } catch {
        if (!cancelled) {
          setHasError(true);
          setIsLoading(false);
        }
      }
    };

    init();

    return () => {
      cancelled = true;
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [url, title]);

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-border"
      style={{ height: "clamp(300px, 70vh, 800px)" }}
    >
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-900">
          <LoadingSpinner />
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-zinc-900 text-red-400">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          <p className="text-sm">全景图加载失败</p>
        </div>
      )}

      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}

function ExternalViewer({ url, title }: { url: string; title: string }) {
  return (
    <div
      className="relative flex flex-col items-center justify-center gap-4 overflow-hidden rounded-xl border border-border bg-zinc-900"
      style={{ height: "clamp(300px, 70vh, 800px)" }}
    >
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-zinc-400" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
      <p className="text-sm text-zinc-400">{title}</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
        </svg>
        打开全景漫游
      </a>
    </div>
  );
}

export default function PanoViewer({
  panoramaUrl,
  title,
}: {
  panoramaUrl: string;
  title: string;
}) {
  if (!panoramaUrl) return <EmptyState />;
  if (isExternalOnlyUrl(panoramaUrl)) return <ExternalViewer url={panoramaUrl} title={title} />;
  if (isEmbedUrl(panoramaUrl)) return <EmbedViewer url={panoramaUrl} title={title} />;
  return <PannellumRenderer url={panoramaUrl} title={title} />;
}
