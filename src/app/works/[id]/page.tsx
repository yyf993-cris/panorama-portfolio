import { notFound } from "next/navigation";
import Link from "next/link";
import { getWorks } from "@/lib/data";
import PanoViewer from "@/components/PanoViewer";
import ImageAlbumViewer from "@/components/ImageAlbumViewer";
import ViewCounter from "@/components/ViewCounter";

function BackArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 18L9 12l6-6" />
    </svg>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-zinc-500">{label}</dt>
      <dd className="mt-0.5 text-sm text-zinc-200">{value}</dd>
    </div>
  );
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function WorkDetailPage({ params }: Props) {
  const { id } = await params;
  const works = getWorks();
  const work = works.find((w) => w.id === id);

  if (!work) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/works"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
      >
        <BackArrow />
        返回作品集
      </Link>

      <div className="mb-8">
        {work.type === "panorama" && work.panoramaUrl && (
          <PanoViewer panoramaUrl={work.panoramaUrl} title={work.title} />
        )}
        {work.type === "album" && work.images && (
          <ImageAlbumViewer images={work.images} title={work.title} />
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-start gap-3">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">{work.title}</h1>
            {work.featured && (
              <span className="mt-1 rounded-full bg-indigo-500/15 px-2.5 py-0.5 text-xs font-medium text-indigo-400 ring-1 ring-indigo-500/20">
                精选
              </span>
            )}
          </div>

          {work.description && (
            <p className="mt-4 leading-relaxed text-zinc-400">{work.description}</p>
          )}
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
          <dl className="space-y-4">
            {work.date && <MetaItem label="创作日期" value={work.date} />}
            {work.location && <MetaItem label="地点" value={work.location} />}
            <ViewCounter workId={work.id} />
            {work.tags.length > 0 && (
              <div>
                <dt className="mb-2 text-xs text-zinc-500">标签</dt>
                <dd className="flex flex-wrap gap-1.5">
                  {work.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/[0.05] px-2.5 py-0.5 text-xs text-zinc-300 ring-1 ring-white/[0.08]"
                    >
                      {tag}
                    </span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}
