import { NextRequest, NextResponse } from "next/server";

const LOCAL_IPS = new Set(["127.0.0.1", "::1", "::ffff:127.0.0.1", "localhost"]);

function isLocalRequest(request: NextRequest): boolean {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const ip = forwarded.split(",")[0].trim();
    return LOCAL_IPS.has(ip);
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return LOCAL_IPS.has(realIp);
  }

  return true;
}

export function middleware(request: NextRequest) {
  if (!isLocalRequest(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
