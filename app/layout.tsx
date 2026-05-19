import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reviz — IA étudiant : résumé, chat PDF, plan, examens",
  description:
    "L'IA pour réviser plus vite : résumé de cours, chat avec ton PDF, plan de révision et examens auto.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
