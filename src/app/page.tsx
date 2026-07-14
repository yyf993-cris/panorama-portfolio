import ProfileCard from "@/components/ProfileCard";
import WorkGrid from "@/components/WorkGrid";
import Link from "next/link";
import { getWorks } from "@/lib/data";

export const dynamic = "force-dynamic";

export default function Home() {
  const works = getWorks();
  const featuredWorks = works.filter((w) => w.featured);

  return (
    <>
      <section className="relative overflow-hidden px-4 py-24 text-center sm:py-32">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <div className="h-[600px] w-[600px] rounded-full bg-indigo-500/[0.06] blur-[120px]" />
          <div className="absolute h-[400px] w-[400px] translate-x-48 rounded-full bg-violet-500/[0.05] blur-[100px]" />
          <div className="absolute h-[300px] w-[300px] -translate-x-48 -translate-y-20 rounded-full bg-blue-500/[0.04] blur-[80px]" />
        </div>

        <div className="relative mx-auto max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/[0.06] px-3 py-1 text-xs text-indigo-400">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            空间设计 · VR 全景
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            用设计探索
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-400 bg-clip-text text-transparent">
              理想空间
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
            从效果图到全景漫游，沉浸式感受每一个精心设计的空间。
          </p>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <ProfileCard worksCount={works.length} />
      </section>

      <section id="works" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-white">置顶作品</h2>
            <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs text-indigo-400 ring-1 ring-indigo-500/20">
              精选
            </span>
          </div>
        </div>
        <WorkGrid works={featuredWorks} />

        <div className="mt-12 text-center">
          <Link
            href="/works"
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.03] px-6 py-3 text-sm font-medium text-zinc-300 transition-all hover:border-indigo-500/30 hover:bg-indigo-500/[0.06] hover:text-white"
          >
            查看更多作品
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
