import { memo, useState, useEffect, useRef } from 'react'
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

function getInitialTheme() {
  if (typeof window === 'undefined') return false
  const saved = localStorage.getItem('theme')
  const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches
  return saved === 'dark' || (!saved && prefers)
}

function getInitialAccent() {
  if (typeof window === 'undefined') return 'violet'
  return localStorage.getItem('accent') || 'violet'
}

function getInitialFont() {
  if (typeof window === 'undefined') return 'inter'
  return localStorage.getItem('font') || 'inter'
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [versionOpen, setVersionOpen] = useState(false)
  const [isDark, setIsDark] = useState(getInitialTheme)
  const [accent, setAccent] = useState(getInitialAccent)
  const [font, setFont] = useState(getInitialFont)
  const active = useActiveSection(SECTIONS.map(s => s.id))
  const versionWrap = useRef(null)

  const { current: currentVersion, list: versions = [] } = data.versions ?? {}

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accent)
  }, [accent])

  useEffect(() => {
    document.documentElement.setAttribute('data-font', font)
  }, [font])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Dismiss the version dropdown on an outside click or Escape.
  useEffect(() => {
    if (!versionOpen) return
    const onPointerDown = (e) => {
      if (versionWrap.current && !versionWrap.current.contains(e.target)) {
        setVersionOpen(false)
      }
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setVersionOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [versionOpen])

  const toggle = () => {
    setIsDark(p => {
      const next = !p
      localStorage.setItem('theme', next ? 'dark' : 'light')
      return next
    })
  }

  const setAccentTheme = (id) => {
    setAccent(id)
    localStorage.setItem('accent', id)
  }

  const setFontTheme = (id) => {
    setFont(id)
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

          {currentVersion && versions.length > 0 && (
            <div className="relative" ref={versionWrap}>
              <button
                onClick={() => setVersionOpen(o => !o)}
                aria-label={`Portfolio version ${currentVersion}. Change version`}
                aria-expanded={versionOpen}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold transition-all border ${
                  scrolled
                    ? 'accent-light-bg accent-text border-transparent'
                    : 'bg-white/15 text-white border-white/20 hover:bg-white/25'
                }`}
              >
                {currentVersion}
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${versionOpen ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {versionOpen && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-1.5 z-50">
                  <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Portfolio version
                  </p>
                  {versions.map(v => {
                    const isCurrent = v.id === currentVersion
                    // Only entries that actually declare a url are navigable —
                    // the current version and archived/unavailable ones render
                    // as inert rows instead of dead links.
                    const isLink = Boolean(v.url) && !isCurrent
                    const Tag = isLink ? 'a' : 'span'
                    return (
                      <Tag
                        key={v.id}
                        {...(isLink ? { href: v.url } : {})}
                        aria-current={isCurrent ? 'true' : undefined}
                        className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-sm transition-all ${
                          isCurrent
                            ? 'accent-light-bg accent-text font-semibold cursor-default'
                            : isLink
                              ? 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer'
                              : 'text-slate-400 dark:text-slate-500 cursor-default'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {v.id}
                          {v.note && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                              {v.note}
                            </span>
                          )}
                        </span>
                        {isLink && (
                          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                        )}
                        {isCurrent && (
                          <svg className="w-3.5 h-3.5 shrink-0 accent-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </Tag>
                    )
                  })}
                </div>
              )}
            </div>
          )}

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
        className="fixed right-4 top-1/2 -translate-y-1/2 z-[55] p-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-95 text-slate-500 dark:text-slate-400 hover-accent-text"
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
