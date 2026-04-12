import { CategoryPageTemplate } from '../components/CategoryPageTemplate'

export const revalidate = 60
export const metadata = { title: 'WWE News — WrestlePulse' }

export default async function WWEPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams
  return <CategoryPageTemplate pageTitle="WWE News" category="WWE" basePath="/wwe" page={Number(page) || 1} />
}
