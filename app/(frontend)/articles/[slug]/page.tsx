import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { ArticleCard, CategoryTag, type ArticleCardPost } from '../../components/ArticleCard'

function formatDateLong(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function estimateReadTime(content: unknown): number {
  if (!content) return 1
  const text = JSON.stringify(content).replace(/<[^>]+>/g, '')
  const words = text.split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

async function getPost(slug: string) {
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    depth: 2,
    limit: 1,
  })
  return docs[0] ?? null
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    limit: 100,
  })
  return docs.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: 'Not Found — WrestlePulse' }

  const title = (post as any).seoTitle || post.title
  const description = (post as any).seoDescription || post.excerpt || ''
  const image = post.featuredImage && typeof post.featuredImage === 'object'
    ? (post.featuredImage as any).url
    : null

  return {
    title: `${title} — WrestlePulse`,
    description,
    openGraph: {
      title,
      description,
      url: `https://wrestlepulse.in/articles/${slug}`,
      siteName: 'WrestlePulse',
      ...(image ? { images: [{ url: image }] } : {}),
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const payload = await getPayload({ config: await config })
  const { docs: related } = await payload.find({
    collection: 'posts',
    where: {
      category: { equals: post.category },
      status: { equals: 'published' },
      slug: { not_equals: slug },
    },
    sort: '-publishedDate',
    limit: 3,
    depth: 1,
  })

  const author = post.author && typeof post.author === 'object' ? (post.author as any) : null
  const image = post.featuredImage && typeof post.featuredImage === 'object' ? (post.featuredImage as any) : null
  const avatar = author?.avatar && typeof author.avatar === 'object' ? author.avatar : null
  const readTime = (post as any).readTime ?? estimateReadTime(post.content)
  const tags: string[] = ((post as any).tags ?? []).map((t: any) => t.tag).filter(Boolean)
  const authorName = author?.displayName || author?.name || author?.email || null

  return (
    <>
      <Header />

      <main className="article-main">
        <article className="article-container">
          <div className="article-header">
            <Link href="/" className="back-link">← Back to Home</Link>
            <CategoryTag category={post.category} />
            <h1 className="article-title">{post.title}</h1>
            {post.excerpt && <p className="article-excerpt">{post.excerpt}</p>}
            <div className="article-meta">
              {authorName && (
                <span className="article-author">
                  {avatar?.url && (
                    <Image
                      src={avatar.url}
                      alt={authorName}
                      width={24}
                      height={24}
                      className="author-avatar"
                    />
                  )}
                  By {authorName}
                </span>
              )}
              {post.publishedDate && (
                <span className="article-date">{formatDateLong(post.publishedDate)}</span>
              )}
              <span className="article-read-time">{readTime} min read</span>
            </div>
          </div>

          {image?.url && (
            <div className="article-featured-image">
              <Image
                src={image.url}
                alt={image.alt ?? post.title}
                fill
                className="article-img"
                priority
              />
            </div>
          )}

          <div className="article-body">
            {post.content ? (
              <ArticleContent content={post.content} />
            ) : (
              <p>No content available.</p>
            )}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="article-tags">
              <span className="article-tags-label">Tags:</span>
              {tags.map((tag) => (
                <span key={tag} className="article-tag-pill">{tag}</span>
              ))}
            </div>
          )}

          {/* Author bio */}
          {author?.bio && (
            <div className="author-bio-box">
              {avatar?.url && (
                <Image
                  src={avatar.url}
                  alt={authorName ?? ''}
                  width={56}
                  height={56}
                  className="author-bio-avatar"
                />
              )}
              <div>
                {authorName && <p className="author-bio-name">{authorName}</p>}
                <p className="author-bio-text">{author.bio}</p>
              </div>
            </div>
          )}
        </article>

        {related.length > 0 && (
          <section className="related-section">
            <div className="related-inner">
              <h2 className="section-heading">More {post.category} Stories</h2>
              <div className="related-grid">
                {(related as unknown as ArticleCardPost[]).map((r) => (
                  <ArticleCard key={r.id} post={r} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  )
}

function ArticleContent({ content }: { content: unknown }) {
  const root = (content as any)?.root
  if (!root?.children) return null
  return (
    <div>
      {root.children.map((node: any, i: number) => (
        <RenderNode key={i} node={node} />
      ))}
    </div>
  )
}

function RenderNode({ node }: { node: any }) {
  if (node.type === 'paragraph') {
    return (
      <p>
        {node.children?.map((child: any, i: number) => (
          <RenderInline key={i} node={child} />
        ))}
      </p>
    )
  }
  if (node.type === 'heading') {
    const Tag = node.tag as 'h1' | 'h2' | 'h3' | 'h4'
    return (
      <Tag>
        {node.children?.map((child: any, i: number) => (
          <RenderInline key={i} node={child} />
        ))}
      </Tag>
    )
  }
  if (node.type === 'quote') {
    return (
      <blockquote>
        {node.children?.map((child: any, i: number) => (
          <RenderNode key={i} node={child} />
        ))}
      </blockquote>
    )
  }
  if (node.type === 'list') {
    const Tag = node.listType === 'number' ? 'ol' : 'ul'
    return (
      <Tag>
        {node.children?.map((child: any, i: number) => (
          <RenderNode key={i} node={child} />
        ))}
      </Tag>
    )
  }
  if (node.type === 'listitem') {
    return (
      <li>
        {node.children?.map((child: any, i: number) => (
          <RenderInline key={i} node={child} />
        ))}
      </li>
    )
  }
  // Inline image inserted via Lexical upload node
  if (node.type === 'upload') {
    const src = node.value?.url
    const alt = node.value?.alt ?? ''
    if (!src) return null
    return (
      <figure className="article-inline-image">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} style={{ maxWidth: '100%', height: 'auto' }} />
        {node.value?.caption && (
          <figcaption>{node.value.caption}</figcaption>
        )}
      </figure>
    )
  }
  return null
}

function RenderInline({ node }: { node: any }) {
  if (node.type === 'linebreak') {
    return <br />
  }
  if (node.type === 'text') {
    let el: React.ReactNode = node.text
    if (node.format & 1) el = <strong>{el}</strong>
    if (node.format & 2) el = <em>{el}</em>
    if (node.format & 8) el = <u>{el}</u>
    return <>{el}</>
  }
  if (node.type === 'link') {
    return (
      <a href={node.url} target="_blank" rel="noopener noreferrer">
        {node.children?.map((child: any, i: number) => (
          <RenderInline key={i} node={child} />
        ))}
      </a>
    )
  }
  return null
}
