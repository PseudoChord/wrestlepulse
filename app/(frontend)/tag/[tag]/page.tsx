import { getPayload } from 'payload'
import config from '@/payload.config'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { ArticleCard, type ArticleCardPost } from '../../components/ArticleCard'

function tagToLabel(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export async function generateMetadata(
  { params }: { params: Promise<{ tag: string }> }
): Promise<Metadata> {
  const { tag } = await params
  const label = tagToLabel(tag)
  return {
    title: `${label} — WrestlePulse`,
    description: `All WrestlePulse articles tagged with ${label}.`,
  }
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params
  const label = tagToLabel(tag)
  const searchTerm = tag.replace(/-/g, ' ')

  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'posts',
    where: {
      and: [
        { status: { equals: 'published' } },
        { 'tags.tag': { like: searchTerm } },
      ],
    },
    sort: '-publishedDate',
    limit: 48,
    depth: 1,
  })

  if (!docs) notFound()

  return (
    <>
      <Header />
      <main className="category-main">
        <div className="category-header">
          <h1 className="category-title">
            <span className="tag-page-hash">#</span>{label}
          </h1>
          <p className="category-subtitle">
            {docs.length} {docs.length === 1 ? 'article' : 'articles'}
          </p>
        </div>

        {docs.length > 0 ? (
          <div className="category-grid-wrap">
            <div className="news-grid">
              {(docs as unknown as ArticleCardPost[]).map((post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        ) : (
          <div className="no-results">
            <p>No articles found for <strong>{label}</strong>.</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
