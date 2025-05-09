import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white">
        <Navbar/>
        <main className='px-20'>{children}</main>
        <Footer/>
      </body>
    </html>
  )
}