import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reviz — PDF de cours → QCM en 2 min",
  description:
    "Upload ton cours en PDF, révise avec un QCM généré automatiquement. Gratuit pour tes premiers cours.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
