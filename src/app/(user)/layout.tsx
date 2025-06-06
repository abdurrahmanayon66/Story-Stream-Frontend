import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background">
        <Navbar />
        <main className="px-24">{children}</main>
        <Footer />
    </div>
  );
}
