import { CategoryPageTemplate } from '../components/CategoryPageTemplate'

export const revalidate = 60
export const metadata = { title: 'AEW News — WrestlePulse' }

export default async function AEWPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams
  return <CategoryPageTemplate pageTitle="AEW News" category="AEW" basePath="/aew" page={Number(page) || 1} />
}
