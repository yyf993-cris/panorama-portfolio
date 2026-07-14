import Link from "next/link";
import WorkGrid from "@/components/WorkGrid";
import { getWorks } from "@/lib/data";

export const dynamic = "force-dynamic";

export default function WorksPage() {
  const works = getWorks();
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
        <h1 className="text-3xl font-bold text-white">全部作品</h1>
        <p className="mt-2 text-zinc-400">
          空间设计效果图与 360° VR 全景漫游作品。
        </p>
        <span className="mt-3 inline-block text-sm text-zinc-500">
          共 {works.length} 件作品
        </span>
      </div>

      <WorkGrid works={works} />
    </div>
  );
}
