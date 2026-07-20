import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "@/lib/auth";

export function requireAuth(request: NextRequest): NextResponse | null {
  const token = request.cookies.get("admin_session")?.value;
  if (!validateSession(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
