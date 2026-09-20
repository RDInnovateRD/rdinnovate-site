#!/usr/bin/env node
// Compliance gate for rdinnovate.com. Scans the built HTML; any error exits
// non-zero and blocks the deploy.
//
// The rules reflect what a firm talking about the R&D Tax Incentive must not
// say on its website (Tax Practitioners Board, Australian Consumer Law):
// no guaranteed outcomes, no implied ATO endorsement, no claim of tax-agent
// registration unless it is current.

import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');
const src = fs.readFileSync(path.resolve('src/data/business.ts'), 'utf8');
const tpbRegistered = /tpbRegistered:\s*true/.test(src);

const RULES = [
  [/\bguarantee(d|s)?\b[^.]{0,50}\b(refund|approval|eligib\w*|outcome|result|success|offset)/i, 'guarantee of a tax or claim outcome'],
  [/\b(maximi[sz]e|bigger|largest)\s+(your\s+)?(refund|rebate|tax offset)/i, 'promise to maximise a refund'],
  [/\bATO[- ](approved|endorsed|certified|accredited)\b/i, 'implies ATO approval or endorsement'],
  [/\bno[- ]win,?\s*no[- ]fee\b/i, 'no-win-no-fee claim (check TPB rules before using)'],
  [/\b100\s?%\s+(success|eligib\w*|approval)/i, '100% success/eligibility claim'],
  [/\brisk[- ]free\b/i, '"risk-free" claim'],
  [/\b(PLACEHOLDER|TODO|TBD|lorem ipsum)\b|\[insert|\{\{|\}\}/i, 'placeholder text on the page'],
  [/\bundefined\b|\bNaN\b|\[object Object\]/, 'template leak (undefined / NaN / [object Object])'],
];
if (!tpbRegistered) {
  RULES.push([/\bregistered tax agent\b|\bTPB[- ]registered\b|\btax agent number\b/i,
    'claims tax-agent registration while business.tpbRegistered is false']);
}

const walk = (d) => fs.readdirSync(d, { withFileTypes: true })
  .flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));

const errors = [];
if (!fs.existsSync(DIST)) errors.push('dist/ missing — run `npm run build` first');
else {
  for (const file of walk(DIST).filter((f) => f.endsWith('.html'))) {
    const rel = path.relative(DIST, file);
    const html = fs.readFileSync(file, 'utf8');
    const text = html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ')
      .replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ');
    for (const [re, why] of RULES) {
      const m = text.match(re);
      if (m) errors.push(`${rel}: ${why} — "${m[0]}"`);
    }
    if (!/<title>[^<]{5,}<\/title>/.test(html)) errors.push(`${rel}: missing <title>`);
    if (!/<meta name="description" content="[^"]{20,}"/.test(html)) errors.push(`${rel}: missing meta description`);
  }
}

for (const e of errors) console.log(`ERROR ${e}`);
console.log(`compliance: ${errors.length} error(s)`);
process.exit(errors.length ? 1 : 0);
