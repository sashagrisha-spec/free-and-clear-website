export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--dark-grey)' }} className="py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-white/60 text-sm">
          &copy; {new Date().getFullYear()} Sasha Daniel &mdash; Free &amp; Clear English
        </p>
        <div className="flex gap-6">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-white text-sm transition-colors"
          >
            Instagram
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-white text-sm transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  )
}
