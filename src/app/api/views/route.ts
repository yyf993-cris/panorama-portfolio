import { NextResponse } from "next/server";
import { getViews } from "@/lib/data";

export async function GET() {
  const views = getViews();
  const total = Object.values(views).reduce((sum, v) => sum + v, 0);
  return NextResponse.json({ total, details: views });
}
