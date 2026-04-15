import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import Image from 'next/image'
import './styles.css'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { ArticleCard, CategoryTag, formatDate, type ArticleCardPost } from './components/ArticleCard'

export const revalidate = 60

export default async function HomePage() {
  const payload = await getPayload({ config: await config })

  // Try to find a featured article first
  const { docs: featuredDocs } = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' }, featured: { equals: true } },
    sort: '-publishedDate',
    limit: 1,
    depth: 1,
  })

  const featured = featuredDocs[0] ?? null

  // Fetch remaining published articles, excluding the featured one
  const { docs: restPosts } = await payload.find({
    collection: 'posts',
    where: {
      status: { equals: 'published' },
      ...(featured ? { id: { not_equals: featured.id } } : {}),
    },
    sort: '-publishedDate',
    limit: featured ? 9 : 10,
    depth: 1,
  })

  // Fetch breaking news for the ticker
  const { docs: breakingDocs } = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' }, breakingNews: { equals: true } },
    sort: '-publishedDate',
    limit: 6,
    depth: 0,
  })

  // If nothing is featured, use the most recent as the hero
  const heroPost = featured ?? restPosts[0] ?? null
  const remainingPosts = featured ? restPosts : restPosts.slice(1)

  const sideStories = remainingPosts.slice(0, 3)
  const latestGrid = remainingPosts.slice(3, 9)
  // Prefer actual breaking news in ticker; fall back to recent posts
  const tickerPosts = breakingDocs.length > 0
    ? breakingDocs
    : [heroPost, ...remainingPosts.slice(0, 4)].filter(Boolean)

  return (
    <>
      <Header />

      {/* Breaking news ticker */}
      <div className="ticker-bar">
        <span className="ticker-label">BREAKING</span>
        <div className="ticker-track">
          <div className="ticker-inner">
            {tickerPosts.length > 0
              ? tickerPosts.map((p) => (
                  <span key={p.id} className="ticker-item">
                    <Link href={`/articles/${p.slug}`}>{p.title}</Link>
                    <span className="ticker-sep">•</span>
                  </span>
                ))
              : <span className="ticker-item">Welcome to WrestlePulse — India&apos;s home for pro wrestling journalism.</span>
            }
          </div>
        </div>
      </div>

      <main className="site-main">
        {/* Hero section */}
        {heroPost ? (
          <section className="hero-section">
            {/* Featured article */}
            {heroPost && (
              <Link href={`/articles/${heroPost.slug}`} className="featured-article">
                <div className="featured-image-wrap">
                  {heroPost.featuredImage && typeof heroPost.featuredImage === 'object' && (heroPost.featuredImage as any).url ? (
                    <Image
                      src={(heroPost.featuredImage as any).url}
                      alt={(heroPost.featuredImage as any).alt ?? heroPost.title}
                      fill
                      className="featured-img"
                    />
                  ) : (
                    <div className="featured-img-placeholder" />
                  )}
                  <div className="featured-overlay" />
                </div>
                <div className="featured-content">
                  <CategoryTag category={heroPost.category} />
                  <h1 className="featured-title">{heroPost.title}</h1>
                  {heroPost.excerpt && <p className="featured-excerpt">{heroPost.excerpt}</p>}
                  {heroPost.publishedDate && (
                    <span className="featured-meta">{formatDate(heroPost.publishedDate)}</span>
                  )}
                </div>
              </Link>
            )}

            {/* Side stories */}
            <div className="side-stories">
              {sideStories.map((post) => (
                <Link key={post.id} href={`/articles/${post.slug}`} className="side-story">
                  <div className="side-image-wrap">
                    {post.featuredImage && typeof post.featuredImage === 'object' && (post.featuredImage as any).url ? (
                      <Image
                        src={(post.featuredImage as any).url}
                        alt={(post.featuredImage as any).alt ?? post.title}
                        fill
                        className="side-img"
                      />
                    ) : (
                      <div className="side-img-placeholder" />
                    )}
                  </div>
                  <div className="side-content">
                    <CategoryTag category={post.category} />
                    <h3 className="side-title">{post.title}</h3>
                    {post.publishedDate && (
                      <span className="side-meta">{formatDate(post.publishedDate)}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : (
          <div className="empty-state">
            <p>No articles yet. Check back soon!</p>
          </div>
        )}


        {/* Latest news grid */}
        {latestGrid.length > 0 && (
          <section className="latest-section">
            <h2 className="section-heading">Latest News</h2>
            <div className="news-grid">
              {(latestGrid as unknown as ArticleCardPost[]).map((post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  )
}
