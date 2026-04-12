import { CategoryPageTemplate } from '../components/CategoryPageTemplate'

export const revalidate = 60
export const metadata = { title: 'Retro — WrestlePulse' }

export default async function RetroPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams
  return <CategoryPageTemplate pageTitle="Retro" category="Retro" basePath="/retro" page={Number(page) || 1} />
}
