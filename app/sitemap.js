import { getPosts } from '../lib/firestore';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://stylehubdecors.co';

export default async function sitemap() {
  const staticRoutes = [
    { url: siteUrl,              lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${siteUrl}/fashion`,    lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${siteUrl}/home-decor`, lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
  ];

  let postRoutes = [];
  try {
    const posts = await getPosts({ max: 200 });
    postRoutes = posts.map(post => ({
      url:             `${siteUrl}/${post.category}/${post.slug}`,
      lastModified:    post.updatedAt?.toDate?.() ?? new Date(),
      changeFrequency: 'weekly',
      priority:        0.8,
    }));
  } catch (_) { /* silently skip if Firebase unavailable during build */ }

  return [...staticRoutes, ...postRoutes];
}
