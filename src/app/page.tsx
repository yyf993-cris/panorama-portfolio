import ProfileCard from "@/components/ProfileCard";
import WorkGrid from "@/components/WorkGrid";
import DesignGallery from "@/components/DesignGallery";
import { works } from "@/lib/works-data";
import { designWorks } from "@/lib/design-data";

export default function Home() {
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
        <ProfileCard worksCount={works.length + designWorks.length} />
      </section>

      <section id="design" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-white">设计作品</h2>
            <span className="rounded-full bg-violet-500/10 px-2.5 py-0.5 text-xs text-violet-400 ring-1 ring-violet-500/20">
              效果图
            </span>
          </div>
          <a
            href="/design"
            className="text-sm text-zinc-400 transition-colors hover:text-white"
          >
            查看全部 →
          </a>
        </div>
        <DesignGallery works={designWorks.slice(0, 3)} />
      </section>

      <section id="panorama" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-white">全景漫游</h2>
            <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs text-indigo-400 ring-1 ring-indigo-500/20">
              360° VR
            </span>
          </div>
          <a
            href="/panorama"
            className="text-sm text-zinc-400 transition-colors hover:text-white"
          >
            查看全部 →
          </a>
        </div>
        <WorkGrid works={works.slice(0, 3)} />
      </section>
    </>
  );
}
