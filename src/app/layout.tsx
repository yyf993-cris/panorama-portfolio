import type { Metadata } from "next";
import "./globals.css";
import PortfolioShell from "@/components/PortfolioShell";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import { getConfig } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const config = getConfig();
  return {
    title: config.site.title,
    description: config.site.description,
    openGraph: {
      title: config.site.title,
      description: config.site.description,
      url: config.site.url,
      siteName: config.site.title,
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: config.site.title }],
      locale: "zh_CN",
      type: "website",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased" suppressHydrationWarning>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider>
          <PortfolioShell header={<Header />} footer={<Footer />}>
            {children}
          </PortfolioShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
