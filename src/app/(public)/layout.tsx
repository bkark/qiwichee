import SiteNav from '@/app/components/SiteNav'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SiteNav />
      {children}
    </>
  )
}
