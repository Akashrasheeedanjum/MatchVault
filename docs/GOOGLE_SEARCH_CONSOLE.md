# Google Search Console setup (before AdSense)

Do this after MatchVault is live on your real domain.

## 1. Verify domain

1. Go to [Google Search Console](https://search.google.com/search-console).
2. Add your property (URL prefix is fine for Vercel): `https://yourdomain.com`.
3. Choose **HTML tag** verification.
4. Copy the `content="...."` value only.
5. Put it in `.env.local` / Vercel env:

```bash
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=paste_token_here
```

6. Redeploy, then click **Verify** in Search Console.

## 2. Submit sitemap

In Search Console → **Sitemaps**, submit:

```text
https://yourdomain.com/sitemap.xml
```

Confirm these also work in the browser:

- `/sitemap.xml`
- `/robots.txt`

## 3. Check indexing

1. Use **URL Inspection** on homepage and a few match URLs.
2. Request indexing for key pages after publishing new articles.
3. Wait for Coverage / Pages report to show indexed URLs (can take days).

## 4. Then apply for AdSense

Only after:

- Domain verified
- Sitemap submitted
- Legal pages live (About, Contact, Privacy, Terms, Cookies, DMCA)
- Enough original match articles with internal links
