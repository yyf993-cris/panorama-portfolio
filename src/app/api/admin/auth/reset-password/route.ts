import { NextRequest, NextResponse } from "next/server";
import { forceResetPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const resetSecret = process.env.ADMIN_RESET_SECRET;
  if (!resetSecret) {
    return NextResponse.json({ error: "Reset secret not configured" }, { status: 500 });
  }

  const body = await request.json() as { secret?: string; newPassword?: string };
  const { secret, newPassword } = body;

  if (!secret || secret !== resetSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!newPassword || newPassword.length < 6) {
    return NextResponse.json({ error: "密码长度不能少于6位" }, { status: 400 });
  }

  forceResetPassword(newPassword);
  return NextResponse.json({ success: true, message: "密码已重置，所有会话已失效" });
}
