import type { APIRoute } from 'astro';
import { business } from '../data/business';

export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const loc = (p: string) => new URL(`${base}${p}`, site).href;
  const body = ['/', ...(business.consultingPage ? ['/consulting/'] : []), '/privacy/'].map((p) => `  <url><loc>${loc(p)}</loc></url>`).join('\n');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
