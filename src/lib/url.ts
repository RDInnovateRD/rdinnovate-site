import { productionUrl } from '../data/business';

/** Internal link that works on the preview sub-path and on the real domain. */
export function u(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/** True only when building for https://rdinnovate.com. Preview builds are noindex. */
export const isProduction = (import.meta.env.SITE ?? '').replace(/\/$/, '') === productionUrl;
