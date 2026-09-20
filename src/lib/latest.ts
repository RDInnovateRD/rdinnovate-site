// Latest articles from blog.rdinnovate.com, read from its Atom feed at BUILD
// time. The site rebuilds daily, so the strip stays current. If the feed can't
// be reached, the section is simply left out: the build never fails over it.
import { business } from '../data/business';

export interface Latest { title: string; url: string; date: string; category: string; summary: string }

const decode = (s = '') => s
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
  .replace(/&amp;/g, '&').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

export async function latestArticles(n = 3): Promise<Latest[]> {
  const feed = process.env.BLOG_FEED_URL || business.links.blogFeed;
  try {
    const res = await fetch(feed, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(String(res.status));
    const xml = await res.text();
    return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].slice(0, n).map(([, e]) => ({
      title: decode(e.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1]),
      url: e.match(/<link[^>]*href="([^"]+)"/)?.[1] ?? business.links.blog,
      date: (e.match(/<published>([^<]+)/)?.[1] ?? '').slice(0, 10),
      category: decode(e.match(/<category[^>]*term="([^"]+)"/)?.[1]),
      summary: decode(e.match(/<summary[^>]*>([\s\S]*?)<\/summary>/)?.[1]),
    })).filter((a) => a.title && a.url);
  } catch (err) {
    console.warn(`[latest] blog feed unavailable (${feed}): ${(err as Error).message}. Section omitted.`);
    return [];
  }
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const displayDate = (ymd: string) => {
  const [y, m, d] = ymd.split('-').map(Number);
  return y && m && d ? `${d} ${MONTHS[m - 1]} ${y}` : '';
};
