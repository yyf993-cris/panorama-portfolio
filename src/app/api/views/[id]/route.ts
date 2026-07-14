import { NextResponse } from "next/server";
import { incrementView, getViews } from "@/lib/data";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const count = incrementView(id);
  return NextResponse.json({ views: count });
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const views = getViews();
  return NextResponse.json({ views: views[id] || 0 });
}
