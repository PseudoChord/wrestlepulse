import { CategoryPageTemplate } from '../components/CategoryPageTemplate'

export const revalidate = 60
export const metadata = { title: 'Opinion — WrestlePulse' }

export default async function OpinionPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams
  return <CategoryPageTemplate pageTitle="Opinion" category="Opinion" basePath="/opinion" page={Number(page) || 1} />
}
