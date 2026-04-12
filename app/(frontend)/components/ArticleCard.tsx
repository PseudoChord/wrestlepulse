import Link from 'next/link'
import Image from 'next/image'

const CATEGORY_COLORS: Record<string, string> = {
  WWE: 'tag-wwe',
  AEW: 'tag-aew',
  Opinion: 'tag-opinion',
  India: 'tag-india',
  Results: 'tag-results',
  Retro: 'tag-retro',
}

export function CategoryTag({ category }: { category: string }) {
  return (
    <span className={`category-tag ${CATEGORY_COLORS[category] ?? 'tag-wwe'}`}>
      {category}
    </span>
  )
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export type ArticleCardPost = {
  id: string | number
  slug: string
  title: string
  category: string
  excerpt?: string | null
  publishedDate?: string | null
  featuredImage?: unknown
  breakingNews?: boolean | null
}

export function ArticleCard({ post }: { post: ArticleCardPost }) {
  const image =
    post.featuredImage && typeof post.featuredImage === 'object'
      ? (post.featuredImage as any)
      : null

  return (
    <Link href={`/articles/${post.slug}`} className="news-card">
      <div className="news-card-image-wrap">
        {image?.url ? (
          <Image
            src={image.url}
            alt={image.alt ?? post.title}
            fill
            className="news-card-img"
          />
        ) : (
          <div className="news-card-img-placeholder" />
        )}
      </div>
      <div className="news-card-content">
        <div className="news-card-tags">
          {post.breakingNews && <span className="breaking-badge">BREAKING</span>}
          <CategoryTag category={post.category} />
        </div>
        <h3 className="news-card-title">{post.title}</h3>
        {post.excerpt && (
          <p className="news-card-excerpt">{post.excerpt}</p>
        )}
        {post.publishedDate && (
          <span className="news-card-meta">{formatDate(post.publishedDate)}</span>
        )}
      </div>
    </Link>
  )
}
