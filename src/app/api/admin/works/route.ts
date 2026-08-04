import { NextRequest, NextResponse } from "next/server";
import { getWorks, saveWorks } from "@/lib/data";
import { requireAuth } from "@/lib/api-auth";
import type { Work } from "@/lib/types";

export async function GET(request: NextRequest) {
  const denied = requireAuth(request);
  if (denied) return denied;
  return NextResponse.json(getWorks());
}

export async function PUT(request: NextRequest) {
  const denied = requireAuth(request);
  if (denied) return denied;
  const { ids } = await request.json() as { ids: string[] };

  if (!Array.isArray(ids)) {
    return NextResponse.json({ error: "ids must be an array" }, { status: 400 });
  }

  const works = getWorks();
  const workMap = new Map(works.map((w) => [w.id, w]));
  const reordered: Work[] = [];

  for (const id of ids) {
    const work = workMap.get(id);
    if (work) {
      reordered.push(work);
      workMap.delete(id);
    }
  }

  // Append any works not in the ids array (safety net)
  for (const work of workMap.values()) {
    reordered.push(work);
  }

  saveWorks(reordered);
  return NextResponse.json({ success: true });
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
