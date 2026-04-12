import { CategoryPageTemplate } from '../components/CategoryPageTemplate'

export const revalidate = 60
export const metadata = { title: 'Results — WrestlePulse' }

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams
  return <CategoryPageTemplate pageTitle="Results" category="Results" basePath="/results" page={Number(page) || 1} />
}
