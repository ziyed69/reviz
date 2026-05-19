import { NextRequest, NextResponse } from "next/server";
import { activatePremium, attachUsageCookie, readUsage } from "@/lib/limits";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = (await req.json()) as { sessionId?: string };
    if (!sessionId) {
      return NextResponse.json({ error: "session_id manquant." }, { status: 400 });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid" && session.status !== "complete") {
      return NextResponse.json({ error: "Paiement non confirmé." }, { status: 402 });
    }

    let usage = readUsage(req);
    usage = activatePremium(usage, 31);

    const res = NextResponse.json({ ok: true, tier: "premium" });
    attachUsageCookie(res, usage);
    return res;
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erreur activation";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
