import { NextRequest, NextResponse } from "next/server";
import { consumeQuota, errorWithUsage, jsonWithUsage } from "@/lib/limits";
import { extractTextFromPdf } from "@/lib/pdf";

export const runtime = "nodejs";

const MAX_SIZE = 20 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const gate = consumeQuota(req, "pdf");
    if (!gate.ok) return errorWithUsage(gate.error, gate.usage, gate.status);

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return errorWithUsage("PDF manquant.", gate.usage, 400);
    }

    if (file.size > MAX_SIZE) {
      return errorWithUsage("PDF trop lourd (max 20 Mo).", gate.usage, 400);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await extractTextFromPdf(buffer);

    if (text.length < 150) {
      return errorWithUsage(
        "Pas assez de texte. Utilise un PDF tapé, pas un scan flou.",
        gate.usage,
        422
      );
    }

    return jsonWithUsage(
      {
        title: file.name.replace(/\.pdf$/i, ""),
        text,
        charCount: text.length,
      },
      gate.usage
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erreur extraction";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
