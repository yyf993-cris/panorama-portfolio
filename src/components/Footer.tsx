import { profile } from "@/lib/config";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/[0.06] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-sm text-zinc-600">
            © {year} {profile.name} · Powered by Next.js &amp; Notion
          </p>

          <div className="flex items-center gap-4">
            {profile.socials.map((social) => (
              <a
                key={social.platform}
                href={social.url}
                target={social.url.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                title={social.platform}
                className="text-xs text-zinc-600 transition-colors hover:text-zinc-300"
              >
                {social.platform}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
