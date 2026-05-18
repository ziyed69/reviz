# Reviz

Site micro-SaaS : **PDF de cours → QCM** pour étudiants.

## Lancer en local

```bash
cd reviz
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000)

## Pages

- `/` — Landing
- `/app` — Upload PDF + génération QCM
- `/exemple` — Démo sans PDF

## Déployer (gratuit)

1. Crée un compte [Vercel](https://vercel.com)
2. Importe le dossier `reviz`
3. Deploy — lien public en 2 min

## Notes

- Génération QCM **locale** (gratuit, sans clé API) : extrait le texte du PDF et crée des questions par mots-clés.
- Pour de meilleurs QCM plus tard : ajoute `OPENAI_API_KEY` dans `.env.local` (v2).
- Les PDF **scannés** (image) ne marchent pas — il faut du vrai texte.
