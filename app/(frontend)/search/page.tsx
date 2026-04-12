import { getPayload } from 'payload'
import config from '@/payload.config'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { ArticleCard, type ArticleCardPost } from '../components/ArticleCard'

export function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  return { title: 'Search — WrestlePulse' }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''

  let posts: ArticleCardPost[] = []

  if (query) {
    const payload = await getPayload({ config: await config })
    const { docs } = await payload.find({
      collection: 'posts',
      where: {
        status: { equals: 'published' },
        title: { contains: query },
      },
      sort: '-publishedDate',
      limit: 30,
      depth: 1,
    })
    posts = docs as unknown as ArticleCardPost[]
  }

  return (
    <>
      <Header />
      <main className="category-main">
        <div className="category-header">
          <h1 className="category-page-title">
            {query ? `Results for "${query}"` : 'Search'}
          </h1>
          {query && posts.length > 0 && (
            <span className="category-count">
              {posts.length} article{posts.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {!query ? (
          <div className="empty-state">
            <p>Enter a search term above to find articles.</p>
          </div>
        ) : posts.length > 0 ? (
          <div className="news-grid">
            {posts.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No articles found for &ldquo;{query}&rdquo;.</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
