import { NextRequest, NextResponse } from "next/server";
import { getWorks, saveWorks } from "@/lib/data";
import { requireAuth } from "@/lib/api-auth";
import type { Work } from "@/lib/types";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const denied = requireAuth(request);
  if (denied) return denied;
  const { id } = await context.params;
  const work = getWorks().find((w) => w.id === id);
  if (!work) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(work);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const denied = requireAuth(request);
  if (denied) return denied;
  const { id } = await context.params;
  const body = await request.json() as Partial<Work>;
  const works = getWorks();
  const index = works.findIndex((w) => w.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  works[index] = { ...works[index], ...body, id };
  saveWorks(works);
  return NextResponse.json(works[index]);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const denied = requireAuth(request);
  if (denied) return denied;
  const { id } = await context.params;
  const works = getWorks();
  const filtered = works.filter((w) => w.id !== id);

  if (filtered.length === works.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  saveWorks(filtered);
  return NextResponse.json({ success: true });
}
