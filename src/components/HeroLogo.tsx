"use client";

import Image from "next/image";

interface HeroLogoProps {
  src: string;
}

export default function HeroLogo({ src }: HeroLogoProps) {
  const isGif = src.toLowerCase().endsWith(".gif");

  if (isGif) {
    // For animated GIFs, use <img> to preserve animation (next/image optimizes away animation)
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt="Logo"
        className="max-h-48 w-auto object-contain sm:max-h-64"
      />
    );
  }

  return (
    <Image
      src={src}
      alt="Logo"
      width={320}
      height={256}
      className="max-h-48 w-auto object-contain sm:max-h-64"
      priority
      unoptimized={src.startsWith("/works/")}
    />
  );
}
