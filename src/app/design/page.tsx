import Link from "next/link";
import DesignGallery from "@/components/DesignGallery";
import { designWorks } from "@/lib/design-data";

export default function DesignPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 18L9 12l6-6" />
        </svg>
        返回首页
      </Link>

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">设计作品</h1>
        <p className="mt-2 text-zinc-400">
          室内空间设计效果图，点击可查看大图。
        </p>
        <span className="mt-3 inline-block text-sm text-zinc-500">
          共 {designWorks.length} 件作品
        </span>
      </div>

      <DesignGallery works={designWorks} />
    </div>
  );
}
