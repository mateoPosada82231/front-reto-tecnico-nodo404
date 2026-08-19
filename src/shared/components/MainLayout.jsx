import Header from './Header'
import Footer from './Footer'

function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-text-main">
      <Header />
      <main className="flex-1 w-full max-w-7xl 3xl:max-w-[80rem] 4k:max-w-[100rem] mx-auto px-4 py-8 md:px-8 3xl:px-12 4k:px-16">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout