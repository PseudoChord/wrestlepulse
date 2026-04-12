import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const revalidate = 3600

const BASE_URL = 'https://wrestlepulse.in'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: await config })
  const { docs: posts } = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    limit: 1000,
    depth: 0,
  })

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'hourly', priority: 1 },
    { url: `${BASE_URL}/news`,    changeFrequency: 'hourly',  priority: 0.9 },
    { url: `${BASE_URL}/wwe`,     changeFrequency: 'daily',   priority: 0.8 },
    { url: `${BASE_URL}/aew`,     changeFrequency: 'daily',   priority: 0.8 },
    { url: `${BASE_URL}/india`,   changeFrequency: 'daily',   priority: 0.8 },
    { url: `${BASE_URL}/opinion`, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/results`, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${BASE_URL}/retro`,   changeFrequency: 'weekly',  priority: 0.6 },
  ]

  const articleRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/articles/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...articleRoutes]
}
