import { memo, useState, useEffect } from 'react'
import { useActiveSection } from '../hooks/useActiveSection'
import data from '../data/portfolio.json'

const SECTIONS = [
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'honors', label: 'Honors' },
  { id: 'contact', label: 'Contact' },
]

const COLORS = [
  { id: 'violet', class: 'bg-violet-500' },
  { id: 'blue', class: 'bg-blue-500' },
  { id: 'green', class: 'bg-emerald-500' },
  { id: 'orange', class: 'bg-amber-500' },
  { id: 'pink', class: 'bg-pink-500' },
  { id: 'red', class: 'bg-red-500' },
]

const FONTS = [
  { id: 'inter', name: 'Inter' },
  { id: 'jakarta', name: 'Jakarta Sans' },
  { id: 'poppins', name: 'Poppins' },
  { id: 'dm-sans', name: 'DM Sans' },
  { id: 'space', name: 'Space Grotesk' },
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [accent, setAccent] = useState('violet')
  const [font, setFont] = useState('inter')
  const active = useActiveSection(SECTIONS.map(s => s.id))

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (saved === 'dark' || (!saved && prefers)) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
    const savedAccent = localStorage.getItem('accent') || 'violet'
    const savedFont = localStorage.getItem('font') || 'inter'
    setAccent(savedAccent)
    setFont(savedFont)
    document.documentElement.setAttribute('data-accent', savedAccent)
    document.documentElement.setAttribute('data-font', savedFont)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggle = () => {
    setIsDark(p => {
      const next = !p
      document.documentElement.classList.toggle('dark', next)
      localStorage.setItem('theme', next ? 'dark' : 'light')
      return next
    })
  }

  const setAccentTheme = (id) => {
    setAccent(id)
    document.documentElement.setAttribute('data-accent', id)
    localStorage.setItem('accent', id)
  }

  const setFontTheme = (id) => {
    setFont(id)
    document.documentElement.setAttribute('data-font', id)
    localStorage.setItem('font', id)
  }

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <>
      <div className="fixed top-0 inset-x-0 z-50 flex justify-center pt-4 px-4">
        <nav
          className={`flex items-center gap-1 px-1 py-1 rounded-2xl transition-all duration-500 ${
            scrolled
              ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-lg shadow-black/5'
              : 'bg-transparent'
          }`}
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`px-4 py-2 text-sm font-bold tracking-tight transition-colors ${
              scrolled ? 'text-slate-900 dark:text-white' : 'text-white'
            }`}
          >
            {data.name.split(' ')[0]}
            <span className="accent-text">.</span>
          </button>

          <div className="hidden md:flex items-center gap-0.5 ml-2">
            {SECTIONS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                  active === id
                    ? scrolled
                      ? 'accent-light-bg accent-text'
                      : 'bg-white/15 text-white'
                    : scrolled
                      ? 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-0.5 ml-1">
            <button
              onClick={toggle}
              className={`p-2 rounded-xl transition-colors ${
                scrolled
                  ? 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'
                  : 'text-slate-300 hover:bg-white/10'
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
              )}
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`md:hidden p-2 rounded-xl transition-colors ${
                scrolled
                  ? 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'
                  : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div className="absolute top-20 left-4 right-4 md:hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 space-y-0.5">
            {SECTIONS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  active === id
                    ? 'accent-light-bg accent-text'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => setPanelOpen(p => !p)}
        className="fixed right-4 top-1/2 -translate-y-1/2 z-[55] p-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-95 text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400"
        aria-label="Customize"
      >
        <svg className="w-4 h-4 transition-transform duration-500" style={{ transform: panelOpen ? 'rotate(90deg)' : 'rotate(0deg)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
      </button>

      {panelOpen && (
        <div className="fixed inset-0 z-[60]" onClick={() => setPanelOpen(false)}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          <div className="absolute top-0 right-0 h-full w-72 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Customize</h3>
              <button onClick={() => setPanelOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="mb-6">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Accent Color</p>
              <div className="flex gap-2.5 flex-wrap">
                {COLORS.map(c => (
                  <button key={c.id} onClick={() => setAccentTheme(c.id)}
                    className={`w-8 h-8 rounded-full ${c.class} transition-all ${accent === c.id ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 scale-110' : 'opacity-60 hover:opacity-100'}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Font</p>
              <div className="space-y-1.5">
                {FONTS.map(f => (
                  <button key={f.id} onClick={() => setFontTheme(f.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${font === f.id ? 'accent-light-bg accent-text font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                    style={{ fontFamily: `var(--font-${f.id === 'inter' ? 'sans' : 'heading'})` }}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default memo(Navbar)
