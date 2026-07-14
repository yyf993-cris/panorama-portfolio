import Image from "next/image";
import type { ReactNode } from "react";
import { getProfile } from "@/lib/config";
import TotalViewsCounter from "./TotalViewsCounter";

function SocialIcon({ icon }: { icon: string }): ReactNode {
  if (icon === "wechat") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.295.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838C16.566 5.065 12.99 2.188 8.691 2.188zm-2.906 3.803c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm3.34 4.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-7.062-6.122zm-3.74 2.511c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm5.6 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982z" />
      </svg>
    );
  }
  if (icon === "weibo") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zM9.05 17.958c-.339.81-1.199 1.219-1.916.917-.707-.301-.948-1.184-.609-1.993.338-.805 1.18-1.214 1.89-.922.715.29.97 1.183.635 1.998zm2.527-1.022c-.146.348-.509.518-.816.383-.302-.129-.411-.507-.265-.854.144-.346.502-.516.806-.384.305.132.42.507.275.855zm6.794-11.85c-2.049-.624-4.382.168-5.405 1.848-.164.271-.459.482-.812.382-.348-.1-.531-.42-.471-.771l.008-.034c1.385-3.194 5.149-4.816 8.386-3.645 3.248 1.173 4.651 4.796 3.19 8.065-.195.443-.724.636-1.166.434a.87.87 0 0 1-.498-.511 1.04 1.04 0 0 1-.033-.148c-.083-.895-.573-1.67-1.199-2.36z" />
      </svg>
    );
  }
  if (icon === "mail") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <div className="text-xl font-bold text-white tabular-nums">{value.toLocaleString("zh-CN")}</div>
      <div className="mt-0.5 text-xs text-zinc-500">{label}</div>
    </div>
  );
}

export default function ProfileCard({ worksCount }: { worksCount?: number }) {
  const profile = getProfile();
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/[0.07] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-violet-500/[0.07] blur-3xl" />

      <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div className="shrink-0">
          <div className="relative h-20 w-20 overflow-hidden rounded-full ring-2 ring-indigo-500/40 ring-offset-2 ring-offset-black sm:h-24 sm:w-24">
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
          <h2 className="text-xl font-bold text-white sm:text-2xl">{profile.name}</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{profile.bio}</p>

          <div className="mt-4 flex justify-center gap-2 sm:justify-start">
            {profile.socials.map((social) => (
              <a
                key={social.platform}
                href={social.url}
                target={social.url.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                title={social.platform}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-400 transition-all duration-200 hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-300"
              >
                <SocialIcon icon={social.icon} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mt-6 grid grid-cols-2 divide-x divide-white/[0.06] border-t border-white/[0.06] pt-6">
        <StatItem label="作品" value={worksCount ?? profile.stats.works} />
        <TotalViewsCounter />
      </div>
    </div>
  );
}
