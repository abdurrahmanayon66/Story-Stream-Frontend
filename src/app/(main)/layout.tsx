import Navbar from '@/components/Navbar'
import '../../app/globals.css'
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
        <main>{children}</main>
        <Footer/>
      </body>
    </html>
  )
}