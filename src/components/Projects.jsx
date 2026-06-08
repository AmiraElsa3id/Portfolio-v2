import { memo, useState, useEffect, useCallback } from 'react'
import { useInView } from '../hooks/useInView'
import { getSkillIcon } from '../data/skillIcons'
import data from '../data/portfolio.json'

const PER_PAGE = 6

function ProjectImage({ src, alt }) {
  const base = src.replace(/\.\w+$/, '')
  return (
    <picture>
      <source srcSet={`${base}.webp`} type="image/webp" />
      <img src={src} alt={alt} loading="lazy" decoding="async"
        className="w-full h-44 object-cover group-hover:scale-[1.02] transition-transform duration-700" />
    </picture>
  )
}

function ProjectModal({ proj, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handler)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 transition shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        {proj.image && (
          <div className="overflow-hidden rounded-t-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <picture>
              <source srcSet={`${proj.image.replace(/\.\w+$/, '')}.webp`} type="image/webp" />
              <img src={proj.image} alt={proj.name}
                className="w-full h-56 object-contain p-2" />
            </picture>
          </div>
        )}

        <div className="p-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{proj.name}</h3>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {proj.tech.split(', ').map(t => {
              const Icon = getSkillIcon(t)
              return (
                <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-md text-xs font-medium">
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  {t}
                </span>
              )
            })}
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">{proj.description}</p>

          <div className="flex gap-4">
            {proj.links.code && (
              <a href={proj.links.code} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                Code
              </a>
            )}
            {proj.links.demo && (
              <a href={proj.links.demo} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 hover:bg-violet-100 dark:hover:bg-violet-500/20 rounded-lg transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                Live Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Projects() {
  const { projects } = data
  const [ref, inView] = useInView()
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState(null)
  const totalPages = Math.ceil(projects.length / PER_PAGE)
  const visible = projects.slice(page * PER_PAGE, (page + 1) * PER_PAGE)

  const closeModal = useCallback(() => setSelected(null), [])

  return (
    <section id="projects" ref={ref} className="relative min-h-screen flex items-center px-6 py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="w-full max-w-5xl mx-auto">
        <div className={`text-center mb-16 ${inView ? 'anim-fade-up in' : 'anim-fade-up'}`}>
          <span className="text-xs font-semibold tracking-widest accent-text uppercase">Work</span>
          <h2 className={`text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2 section-title ${inView ? 'in' : ''}`}>Projects</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-5">Things I have built</p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger ${inView ? 'in' : ''}`}>
          {visible.map((proj, i) => (
            <div key={i} onClick={() => setSelected(proj)} className="group card-hover bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 overflow-hidden cursor-pointer">
              {proj.image ? (
                <div className="overflow-hidden border-b border-slate-100 dark:border-slate-700/50">
                  <ProjectImage src={proj.image} alt={proj.name} />
                </div>
              ) : (
                <div className="h-36 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center border-b border-slate-100 dark:border-slate-700/50">
                  <span className="text-slate-400 dark:text-slate-500 text-xs font-medium">Preview</span>
                </div>
              )}
              <div className="p-5">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {proj.tech.split(', ').slice(0, 3).map(t => {
                    const Icon = getSkillIcon(t)
                    return (
                      <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-md text-[10px] font-medium">
                        {Icon && <Icon className="w-3 h-3" />}
                        {t}
                      </span>
                    )
                  })}
                  {proj.tech.split(', ').length > 3 && (
                    <span className="px-2 py-0.5 text-slate-400 rounded-md text-[10px]">+{proj.tech.split(', ').length - 3}</span>
                  )}
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{proj.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">{proj.description}</p>
                <div className="flex gap-3">
                  {proj.links.code && (
                    <a href={proj.links.code} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                      className="text-xs text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 font-medium transition flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                      Code →
                    </a>
                  )}
                  {proj.links.demo && (
                    <a href={proj.links.demo} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                      className="text-xs text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 font-medium transition flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                      Demo →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-violet-300 dark:hover:border-violet-600 disabled:opacity-30 disabled:pointer-events-none transition">
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i)}
                className={`w-8 h-8 text-sm rounded-lg font-medium transition ${i === page
                  ? 'bg-violet-600 text-white'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-violet-50 dark:hover:bg-violet-500/10'
                }`}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
              className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-violet-300 dark:hover:border-violet-600 disabled:opacity-30 disabled:pointer-events-none transition">
              Next →
            </button>
          </div>
        )}
      </div>

      {selected && <ProjectModal proj={selected} onClose={closeModal} />}
    </section>
  )
}

export default memo(Projects)
