import { NextRequest, NextResponse } from "next/server";
import { extractTextFromPdf } from "@/lib/pdf";
import { generateQuizFromText } from "@/lib/qcm";

export const runtime = "nodejs";

const MAX_SIZE = 20 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Fichier PDF manquant." }, { status: 400 });
    }

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "Format accepté : PDF uniquement." }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "PDF trop lourd (max 20 Mo)." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await extractTextFromPdf(buffer);

    if (text.length < 200) {
      return NextResponse.json(
        {
          error:
            "Texte insuffisant. Utilise un PDF avec du vrai texte (pas une photo scannée floue).",
        },
        { status: 422 }
      );
    }

    const quiz = generateQuizFromText(text, file.name);
    return NextResponse.json({ quiz });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erreur inconnue.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
