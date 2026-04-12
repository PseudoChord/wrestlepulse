import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Header } from './Header'
import { Footer } from './Footer'
import { ArticleCard, type ArticleCardPost } from './ArticleCard'

const PAGE_SIZE = 12

type Props = {
  pageTitle: string
  category?: string
  page?: number
  basePath: string
}

function Pagination({
  currentPage,
  totalPages,
  basePath,
}: {
  currentPage: number
  totalPages: number
  basePath: string
}) {
  if (totalPages <= 1) return null
  return (
    <div className="pagination">
      {currentPage > 1 ? (
        <Link href={`${basePath}?page=${currentPage - 1}`} className="pagination-btn">
          ← Previous
        </Link>
      ) : (
        <span className="pagination-btn pagination-disabled">← Previous</span>
      )}
      <span className="pagination-info">
        Page {currentPage} of {totalPages}
      </span>
      {currentPage < totalPages ? (
        <Link href={`${basePath}?page=${currentPage + 1}`} className="pagination-btn">
          Next →
        </Link>
      ) : (
        <span className="pagination-btn pagination-disabled">Next →</span>
      )}
    </div>
  )
}

export async function CategoryPageTemplate({ pageTitle, category, page = 1, basePath }: Props) {
  const payload = await getPayload({ config: await config })

  const where: Record<string, unknown> = { status: { equals: 'published' } }
  if (category) {
    where.category = { equals: category }
  }

  const {
    docs: posts,
    totalDocs,
    totalPages,
    page: currentPage,
  } = await payload.find({
    collection: 'posts',
    where,
    sort: '-publishedDate',
    limit: PAGE_SIZE,
    page,
    depth: 1,
  })

  return (
    <>
      <Header />
      <main className="category-main">
        <div className="category-header">
          <h1 className="category-page-title">{pageTitle}</h1>
          {totalDocs > 0 && (
            <span className="category-count">
              {totalDocs} article{totalDocs !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {posts.length > 0 ? (
          <>
            <div className="news-grid">
              {(posts as unknown as ArticleCardPost[]).map((post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage ?? 1}
              totalPages={totalPages ?? 1}
              basePath={basePath}
            />
          </>
        ) : (
          <div className="empty-state">
            <p>No articles yet in this category. Check back soon.</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
