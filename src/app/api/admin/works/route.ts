import { NextRequest, NextResponse } from "next/server";
import { getWorks, saveWorks } from "@/lib/data";
import { requireAuth } from "@/lib/api-auth";
import type { Work } from "@/lib/types";

export async function GET(request: NextRequest) {
  const denied = requireAuth(request);
  if (denied) return denied;
  return NextResponse.json(getWorks());
}

export async function POST(request: NextRequest) {
  const denied = requireAuth(request);
  if (denied) return denied;
  const body = await request.json() as Partial<Work>;
  const works = getWorks();

  const newWork: Work = {
    id: Date.now().toString(36),
    title: body.title || "未命名作品",
    description: body.description || "",
    cover: body.cover || "",
    type: body.type || "album",
    tags: body.tags || [],
    date: body.date || new Date().toISOString().slice(0, 10),
    location: body.location || "",
    views: 0,
    featured: body.featured || false,
    panoramaUrl: body.panoramaUrl,
    images: body.images || [],
  };

  works.push(newWork);
  saveWorks(works);
  return NextResponse.json(newWork, { status: 201 });
}
