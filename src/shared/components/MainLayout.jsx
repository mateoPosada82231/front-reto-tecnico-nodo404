import Header from './Header'
import Footer from './Footer'

function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <Header />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 md:px-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
