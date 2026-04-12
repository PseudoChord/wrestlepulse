import { CategoryPageTemplate } from '../components/CategoryPageTemplate'

export const revalidate = 60
export const metadata = { title: 'India Wrestling — WrestlePulse' }

export default async function IndiaPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams
  return <CategoryPageTemplate pageTitle="India Wrestling" category="India" basePath="/india" page={Number(page) || 1} />
}
