// rdinnovate.com — static Astro build.
//
// Where it is served from is set by environment variables, so the same code
// works on the preview address and on the real domain:
//   preview:     SITE_URL=https://rdinnovaterd.github.io  SITE_BASE=/rdinnovate-site
//   production:  (unset) -> https://rdinnovate.com at /
// The workflow reads these from the repo's Actions *variables*. Delete the two
// variables at cutover and the next deploy is the production build.
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.SITE_URL || 'https://rdinnovate.com',
  base: process.env.SITE_BASE || '/',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
