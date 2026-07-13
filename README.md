# MatchVault

Football match analysis platform — Phase 1 (Markdown content, AdSense-ready UI).

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Markdown match articles in `content/matches`
- Vercel Analytics
- Google AdSense placeholders (enable via env)
- Native `sitemap.ts` + `robots.ts` (plus optional `next-sitemap`)

## Quick start

```bash
cd matchvault
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Add a match

1. Create a Markdown file under `content/matches/<league-slug>/`.
2. Use the frontmatter template (see sample files).
3. Restart or refresh — posts are read from disk at build/request time.

## AdSense

Copy `.env.example` to `.env.local` and fill publisher / slot IDs after approval.
Until then, ad components render labeled placeholders. **Never place ads inside the download section.**

## Admin panel

1. Set `ADMIN_PASSWORD` and `ADMIN_SECRET` in `.env.local` (see `.env.example`).
2. Restart `npm run dev`.
3. Open [/admin/login](http://localhost:3000/admin/login).
4. Use **New article** for Word-like editing (bold, italic, center) and download URL fields.

Admin routes are cookie-protected. Change the default password before deploying.

## Deploy

Connect the `matchvault` folder to Vercel and set `NEXT_PUBLIC_SITE_URL` to your domain.
