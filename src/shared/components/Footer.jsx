import useContent from '../hooks/useContent'

function Footer() {
  const { content } = useContent('footer')

  return (
    <footer className="w-full border-t border-border/50 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm text-text-dim md:px-8">
        <p>&copy; {new Date().getFullYear()} Sims Expansion Store. {content.copyright}</p>
      </div>
    </footer>
  )
}

export default Footer
