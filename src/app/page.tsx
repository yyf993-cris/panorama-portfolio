import ProfileCard from "@/components/ProfileCard";
import WorkGrid from "@/components/WorkGrid";
import Link from "next/link";
import { getWorks, getConfig } from "@/lib/data";

export const dynamic = "force-dynamic";

export default function Home() {
  const works = getWorks();
  const featuredWorks = works.filter((w) => w.featured);
  const config = getConfig();
  const heroLogo = config.heroLogo || "";

  return (
    <>
      <section className="relative">
        {heroLogo ? (
          <div className="relative w-full" style={{ minHeight: "56vh" }}>
            <img
              src={heroLogo}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
            <div className="relative flex min-h-[56vh] items-end pb-6 sm:pb-8">
              <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <ProfileCard worksCount={works.length} />
              </div>
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden px-4 py-16 sm:py-20">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
              <div className="h-[600px] w-[600px] rounded-full bg-indigo-500/[0.06] blur-[120px]" />
              <div className="absolute h-[400px] w-[400px] translate-x-48 rounded-full bg-violet-500/[0.05] blur-[100px]" />
              <div className="absolute h-[300px] w-[300px] -translate-x-48 -translate-y-20 rounded-full bg-blue-500/[0.04] blur-[80px]" />
            </div>
            <div id="about" className="relative mx-auto max-w-7xl">
              <ProfileCard worksCount={works.length} />
            </div>
          </div>
        )}
      </section>

      <section id="works" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-foreground">置顶作品</h2>
            <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs text-indigo-400 ring-1 ring-indigo-500/20">
              精选
            </span>
          </div>
        </div>
        <WorkGrid works={featuredWorks} />

        <div className="mt-12 text-center">
          <Link
            href="/works"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-muted transition-all hover:border-indigo-500/30 hover:bg-indigo-500/[0.06] hover:text-foreground"
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
