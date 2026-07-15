import { getProfile } from "@/lib/config";
import { getConfig } from "@/lib/data";
import FooterSocialLinks from "./FooterSocialLinks";

export default function Footer() {
  const profile = getProfile();
  const config = getConfig();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-sm text-muted">
            © {year} {profile.name} · Powered by Next.js &amp; Notion
          </p>

          <FooterSocialLinks socials={profile.socials} wechatQr={config.wechatQr} />
        </div>
      </div>
    </footer>
  );
}
