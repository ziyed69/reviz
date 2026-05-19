import { NextRequest, NextResponse } from "next/server";
import { attachUsageCookie, readUsage, usageSnapshot } from "@/lib/limits";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const usage = readUsage(req);
    const res = NextResponse.json(usageSnapshot(usage));
    attachUsageCookie(res, usage);
    return res;
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erreur quota";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
