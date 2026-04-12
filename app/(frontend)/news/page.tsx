import { CategoryPageTemplate } from '../components/CategoryPageTemplate'

export const revalidate = 60
export const metadata = { title: 'News — WrestlePulse' }

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams
  return <CategoryPageTemplate pageTitle="Latest News" basePath="/news" page={Number(page) || 1} />
}
