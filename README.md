# rdinnovate.com

Astro static site, built by GitHub Actions and hosted on GitHub Pages. It replaces
the one.com Website Builder page. The copy is unchanged from the one.com site.

- `src/data/business.ts` is the single source of truth: name, email, optional
  phone/ABN/location, contact-form key and links. Leave an optional field empty
  and its line disappears. Never put marker text there, because it would render.
- `scripts/check-compliance.mjs` blocks the deploy if any page promises a refund
  or outcome, implies ATO endorsement, claims tax-agent registration while
  `tpbRegistered` is false, or shows placeholder or template text.
- `scripts/check-launch.mjs` sorts problems into blockers and nice-to-haves.
- "Latest from the desk" is read from the blog's feed at build time. A daily
  rebuild (21:00 UTC) keeps it current. If the feed can't be reached, the section
  is left out and the build still succeeds.

## Preview and production

| | `SITE_URL` variable | `SITE_BASE` variable | Indexed? |
|---|---|---|---|
| Preview | `https://rdinnovaterd.github.io` | `/rdinnovate-site` | no (noindex + robots Disallow) |
| Production | *(deleted)* | *(deleted)* | yes |

These are set under Settings → Secrets and variables → Actions → **Variables**.

## Cutover from one.com (when ready)

DNS stays at one.com. **Do not use "Reset DNS records"**: the Amazon SES email
records (3 DKIM CNAMEs, SPF, DMARC) must survive.

1. Delete the `SITE_URL` and `SITE_BASE` variables, then re-run the workflow.
2. Repo → Settings → Pages → Custom domain: `rdinnovate.com`.
3. At one.com DNS, point the apex at GitHub Pages. Replace the existing apex
   A/AAAA records only:
   - A `@` → 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
   - AAAA `@` → 2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153, 2606:50c0:8003::153
   - CNAME `www` → `rdinnovaterd.github.io`
4. When the certificate is issued, tick **Enforce HTTPS**.
5. Check that SES email still sends. Then the one.com Website Builder plan can go.
   The domain itself can stay registered at one.com, or move to a cheaper
   registrar later.

## Commands

| | |
|---|---|
| `npm run dev` | local preview (Node 22+) |
| `npm run verify` | build + compliance + launch checks |
