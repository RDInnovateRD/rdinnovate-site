import type { APIRoute } from 'astro';
import { productionUrl } from '../data/business';

// Preview builds (github.io) ask not to be indexed, so search engines never
// treat the preview as a duplicate of rdinnovate.com.
export const GET: APIRoute = ({ site }) => {
  const prod = (site?.href ?? '').replace(/\/$/, '') === productionUrl;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const text = prod
    ? `User-agent: *\nAllow: /\n\nSitemap: ${productionUrl}/sitemap.xml\n`
    : `User-agent: *\nDisallow: ${base || '/'}\n`;
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
