"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Social {
  platform: string;
  url: string;
  icon: string;
}

function SocialIcon({ icon }: { icon: string }): ReactNode {
  if (icon === "wechat") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.295.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838C16.566 5.065 12.99 2.188 8.691 2.188zm-2.906 3.803c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm3.34 4.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-7.062-6.122zm-3.74 2.511c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm5.6 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982z" />
      </svg>
    );
  }
  if (icon === "phone") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

function PhoneNumber({ url }: { url: string }) {
  const number = url.replace("tel:", "");
  return (
    <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
      {number}
    </span>
  );
}

export default function SocialLinks({
  socials,
  wechatQr,
}: {
  socials: Social[];
  wechatQr?: string;
}) {
  const [showQr, setShowQr] = useState(false);

  return (
    <>
      <div className="mt-4 flex justify-center gap-2 sm:justify-start">
        {socials.map((social) => {
          if (social.icon === "wechat" && wechatQr) {
            return (
              <button
                key={social.platform}
                type="button"
                onClick={() => setShowQr(true)}
                title={social.platform}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-muted transition-all duration-200 hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-300"
              >
                <SocialIcon icon={social.icon} />
              </button>
            );
          }

          if (social.icon === "phone") {
            return (
              <a
                key={social.platform}
                href={social.url}
                title={social.platform}
                className="group relative flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-muted transition-all duration-200 hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-300"
              >
                <PhoneNumber url={social.url} />
                <SocialIcon icon={social.icon} />
              </a>
            );
          }

          return (
            <a
              key={social.platform}
              href={social.url}
              target={social.url.startsWith("tel") ? undefined : "_blank"}
              rel="noopener noreferrer"
              title={social.platform}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-muted transition-all duration-200 hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-300"
            >
              <SocialIcon icon={social.icon} />
            </a>
          );
        })}
      </div>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {showQr && wechatQr && (
              <motion.div
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
                onClick={() => setShowQr(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="relative mx-4 max-w-xs rounded-2xl border border-border bg-background p-6 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                >
                  <button
                    type="button"
                    onClick={() => setShowQr(false)}
                    className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-foreground"
                    aria-label="关闭"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>

                  <p className="mb-4 text-center text-sm font-medium text-foreground">
                    微信扫码添加
                  </p>
                  <img
                    src={wechatQr}
                    alt="微信二维码"
                    className="w-full rounded-lg"
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
