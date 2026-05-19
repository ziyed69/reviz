import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export type QuotaAction = "pdf" | "summary" | "chat" | "plan" | "exam";

export type UsageState = {
  v: 1;
  day: string;
  ip: string;
  pdf: number;
  summary: number;
  chat: number;
  plan: number;
  exam: number;
  premium: boolean;
  premiumUntil: string | null;
  lastCallMs: number;
};

export type QuotaLimits = Record<QuotaAction, number>;

const COOKIE_NAME = "reviz_usage";
const COOLDOWN_MS = 2500;
const MAX_CHAT_CHARS = 450;

const LIMITS_FREE: QuotaLimits = {
  pdf: 2,
  summary: 2,
  chat: 12,
  plan: 1,
  exam: 2,
};

const LIMITS_PREMIUM: QuotaLimits = {
  pdf: 40,
  summary: 35,
  chat: 120,
  plan: 15,
  exam: 35,
};

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

function getSecret(): string {
  const s = process.env.QUOTA_SECRET?.trim();
  if (!s || s.length < 16) {
    throw new Error("QUOTA_SECRET manquant (min 16 caractères). Ajoute-le sur Vercel.");
  }
  return s;
}

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") || "unknown";
}

function sign(payload: string): string {
  const sig = crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

function verify(signed: string): string | null {
  const i = signed.lastIndexOf(".");
  if (i < 0) return null;
  const payload = signed.slice(0, i);
  const sig = signed.slice(i + 1);
  const expected = crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return payload;
}

function freshUsage(ip: string): UsageState {
  return {
    v: 1,
    day: todayUtc(),
    ip,
    pdf: 0,
    summary: 0,
    chat: 0,
    plan: 0,
    exam: 0,
    premium: false,
    premiumUntil: null,
    lastCallMs: 0,
  };
}

function parseUsage(raw: string | undefined, ip: string): UsageState {
  if (!raw) return freshUsage(ip);
  const payload = verify(raw);
  if (!payload) return freshUsage(ip);
  try {
    const json = Buffer.from(payload, "base64url").toString("utf8");
    const u = JSON.parse(json) as UsageState;
    if (u.v !== 1) return freshUsage(ip);
    if (u.day !== todayUtc()) {
      const next = freshUsage(ip);
      next.premium = u.premium;
      next.premiumUntil = u.premiumUntil;
      return next;
    }
    if (u.ip && u.ip !== ip) {
      const next = freshUsage(ip);
      next.premium = u.premium;
      next.premiumUntil = u.premiumUntil;
      return next;
    }
    return { ...freshUsage(ip), ...u, ip };
  } catch {
    return freshUsage(ip);
  }
}

function serializeUsage(u: UsageState): string {
  const payload = Buffer.from(JSON.stringify(u), "utf8").toString("base64url");
  return sign(payload);
}

export function isPremiumActive(u: UsageState): boolean {
  if (!u.premium || !u.premiumUntil) return false;
  return new Date(u.premiumUntil).getTime() > Date.now();
}

export function getLimits(u: UsageState): QuotaLimits {
  return isPremiumActive(u) ? LIMITS_PREMIUM : LIMITS_FREE;
}

export function readUsage(req: NextRequest): UsageState {
  const ip = getClientIp(req);
  const raw = req.cookies.get(COOKIE_NAME)?.value;
  const u = parseUsage(raw, ip);
  if (isPremiumActive(u)) u.premium = true;
  else u.premium = false;
  return u;
}

export function attachUsageCookie(res: NextResponse, usage: UsageState): void {
  res.cookies.set(COOKIE_NAME, serializeUsage(usage), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 45,
  });
}

export function usageSnapshot(u: UsageState) {
  const limits = getLimits(u);
  const tier = isPremiumActive(u) ? "premium" : "free";
  const remaining = {
    pdf: Math.max(0, limits.pdf - u.pdf),
    summary: Math.max(0, limits.summary - u.summary),
    chat: Math.max(0, limits.chat - u.chat),
    plan: Math.max(0, limits.plan - u.plan),
    exam: Math.max(0, limits.exam - u.exam),
  };
  return { tier, limits, used: { pdf: u.pdf, summary: u.summary, chat: u.chat, plan: u.plan, exam: u.exam }, remaining, resetDay: u.day };
}

export type ConsumeResult =
  | { ok: true; usage: UsageState }
  | { ok: false; status: number; error: string; usage: UsageState };

export function consumeQuota(req: NextRequest, action: QuotaAction): ConsumeResult {
  const usage = readUsage(req);
  const limits = getLimits(usage);
  const now = Date.now();

  if (now - usage.lastCallMs < COOLDOWN_MS) {
    return {
      ok: false,
      status: 429,
      error: "Doucement — attends 2 secondes entre chaque action.",
      usage,
    };
  }

  if (usage[action] >= limits[action]) {
    const tier = isPremiumActive(usage) ? "Premium" : "gratuit";
    return {
      ok: false,
      status: 429,
      error: `Limite ${tier} atteinte pour aujourd'hui (${limits[action]} ${actionLabel(action)}). ${
        isPremiumActive(usage) ? "Reviens demain." : "Passe Premium ou reviens demain."
      }`,
      usage,
    };
  }

  usage[action] += 1;
  usage.lastCallMs = now;
  return { ok: true, usage };
}

function actionLabel(action: QuotaAction): string {
  const labels: Record<QuotaAction, string> = {
    pdf: "PDF",
    summary: "résumés",
    chat: "messages chat",
    plan: "plans",
    exam: "examens",
  };
  return labels[action];
}

export function validateChatMessage(message: string): string | null {
  const t = message.trim();
  if (!t) return "Message vide.";
  if (t.length > MAX_CHAT_CHARS) return `Message trop long (max ${MAX_CHAT_CHARS} caractères).`;
  return null;
}

export function activatePremium(usage: UsageState, days = 31): UsageState {
  const until = new Date();
  until.setDate(until.getDate() + days);
  usage.premium = true;
  usage.premiumUntil = until.toISOString();
  return usage;
}

export function jsonWithUsage(data: object, usage: UsageState, status = 200): NextResponse {
  const res = NextResponse.json({ ...data, quota: usageSnapshot(usage) }, { status });
  attachUsageCookie(res, usage);
  return res;
}

export function errorWithUsage(error: string, usage: UsageState, status: number): NextResponse {
  const res = NextResponse.json({ error, quota: usageSnapshot(usage) }, { status });
  attachUsageCookie(res, usage);
  return res;
}
