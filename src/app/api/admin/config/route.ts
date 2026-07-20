import { NextRequest, NextResponse } from "next/server";
import { getConfig, saveConfig } from "@/lib/data";
import { requireAuth } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const denied = requireAuth(request);
  if (denied) return denied;
  return NextResponse.json(getConfig());
}

export async function PUT(request: NextRequest) {
  const denied = requireAuth(request);
  if (denied) return denied;
  const body = await request.json();
  saveConfig(body);
  return NextResponse.json({ success: true });
}
