"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Social {
  platform: string;
  url: string;
  icon: string;
}

export default function FooterSocialLinks({
  socials,
  wechatQr,
}: {
  socials: Social[];
  wechatQr?: string;
}) {
  const [showQr, setShowQr] = useState(false);

  return (
    <>
      <div className="flex items-center gap-4">
        {socials.map((social) => {
          if (social.icon === "wechat" && wechatQr) {
            return (
              <button
                key={social.platform}
                type="button"
                onClick={() => setShowQr(true)}
                className="text-xs text-muted transition-colors hover:text-foreground"
              >
                {social.platform}
              </button>
            );
          }

          if (social.icon === "phone") {
            return (
              <a
                key={social.platform}
                href={social.url}
                className="group relative text-xs text-muted transition-colors hover:text-foreground"
              >
                <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                  {social.url.replace("tel:", "")}
                </span>
                {social.platform}
              </a>
            );
          }

          return (
            <a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted transition-colors hover:text-foreground"
            >
              {social.platform}
            </a>
          );
        })}
      </div>

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
      </AnimatePresence>
    </>
  );
}
