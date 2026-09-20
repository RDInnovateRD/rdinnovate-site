#!/usr/bin/env node
// Launch check: blockers (exit 1) vs nice-to-haves (printed only).
// Run after `npm run build`.

import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');
const biz = fs.readFileSync(path.resolve('src/data/business.ts'), 'utf8');
const field = (k) => biz.match(new RegExp(`${k}:\\s*'([^']*)'`))?.[1] ?? '';
const blockers = [];
const nice = [];
const ok = [];

if (!fs.existsSync(DIST)) { console.log('BLOCKER dist/ missing — run `npm run build`'); process.exit(1); }
const walk = (d) => fs.readdirSync(d, { withFileTypes: true })
  .flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const pages = walk(DIST).filter((f) => f.endsWith('.html'));
const home = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');

// Blockers
for (const p of ['index.html', 'privacy/index.html', '404.html', 'sitemap.xml', 'robots.txt']) {
  fs.existsSync(path.join(DIST, p)) ? ok.push(`${p} present`) : blockers.push(`${p} missing`);
}
field('email') ? ok.push(`contact email ${field('email')}`) : blockers.push('no contact email in business.ts');
/id="contact"/.test(home) ? ok.push('contact section present') : blockers.push('contact section missing');

// Internal links resolve (base-path aware)
const base = (process.env.SITE_BASE || '').replace(/\/$/, '');
const broken = new Set();
for (const f of pages) {
  for (const [, href] of fs.readFileSync(f, 'utf8').matchAll(/href="(\/[^"#?]*)/g)) {
    if (base && !href.startsWith(base + '/')) { broken.add(`${href} (outside base, on ${path.relative(DIST, f)})`); continue; }
    const rel = href.slice(base.length) || '/';
    const target = rel.endsWith('/') ? `${rel}index.html` : rel;
    if (!fs.existsSync(path.join(DIST, target))) broken.add(`${href} (on ${path.relative(DIST, f)})`);
  }
}
broken.size ? blockers.push(`broken internal links: ${[...broken].join(', ')}`) : ok.push(`internal links OK across ${pages.length} pages`);

// A production build must be indexable; a preview must not be.
const prod = !process.env.SITE_URL || process.env.SITE_URL.replace(/\/$/, '') === 'https://rdinnovate.com';
const noindex = /name="robots" content="noindex/.test(home);
if (prod && noindex) blockers.push('production build is marked noindex');
else ok.push(prod ? 'production build is indexable' : 'preview build is noindex (correct)');

// Nice-to-haves
field('web3formsKey') ? ok.push('contact form enabled') : nice.push('no Web3Forms key: the page shows the email address instead of a form');
field('abn') ? ok.push('ABN shown') : nice.push('no ABN in the footer');
/Latest from the desk/.test(home) ? ok.push('latest blog articles on the homepage') : nice.push('latest-articles strip omitted (blog feed unreachable at build time)');
/og:image/.test(home) ? ok.push('og:image set') : nice.push('no og:image for link previews');

for (const o of ok) console.log(`ok       ${o}`);
for (const n of nice) console.log(`nice-to  ${n}`);
for (const b of blockers) console.log(`BLOCKER  ${b}`);
console.log(`\nlaunch: ${blockers.length} blocker(s), ${nice.length} nice-to-have(s)`);
process.exit(blockers.length ? 1 : 0);
