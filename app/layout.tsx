import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reviz AI — Super-app étudiant : révisions, CV, rapport, examens",
  description:
    "Révisions PDF, CV stage, rapport de mémoire, mode crash, prof IA et planning. Gratuit avec quotas — Premium 5€/mois.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
