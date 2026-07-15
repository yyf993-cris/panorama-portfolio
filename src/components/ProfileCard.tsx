import Image from "next/image";
import { getProfile } from "@/lib/config";
import { getConfig } from "@/lib/data";
import TotalViewsCounter from "./TotalViewsCounter";
import SocialLinks from "./SocialLinks";

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <div className="text-xl font-bold text-foreground tabular-nums">{value.toLocaleString("zh-CN")}</div>
      <div className="mt-0.5 text-xs text-muted">{label}</div>
    </div>
  );
}

export default function ProfileCard({ worksCount }: { worksCount?: number }) {
  const profile = getProfile();
  const config = getConfig();
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-background/80 p-6 backdrop-blur-xl sm:p-8">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/[0.07] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-violet-500/[0.07] blur-3xl" />

      <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div className="shrink-0">
          <div className="relative h-20 w-20 overflow-hidden rounded-full ring-2 ring-indigo-500/40 ring-offset-2 ring-offset-background sm:h-24 sm:w-24">
            <Image
              src={profile.avatar}
              alt={profile.name}
              fill
              className="object-cover"
              sizes="96px"
              priority
            />
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">{profile.name}</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">{profile.bio}</p>

          <SocialLinks socials={profile.socials} wechatQr={config.wechatQr} />
        </div>
      </div>

      <div className="relative mt-6 grid grid-cols-2 divide-x divide-border border-t border-border pt-6">
        <StatItem label="作品" value={worksCount ?? profile.stats.works} />
        <TotalViewsCounter />
      </div>
    </div>
  );
}
