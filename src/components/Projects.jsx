import { memo, useState, useEffect, useCallback } from 'react'
import { useInView } from '../hooks/useInView'
import { getSkillIcon } from '../data/skillIcons'
import data from '../data/portfolio.json'

const PER_PAGE = 6

// Filter tabs map to a project's `focus` tags in portfolio.json.
const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
  { id: 'full-stack', label: 'Full-Stack' },
  { id: 'ai-ml', label: 'AI / ML' },
]

// A demo pointing at a LinkedIn post or a YouTube video is presented as a
// "Video Demo"; anything else (a deployed site) is a "Live Demo".
function isVideoDemo(url) {
  return /(?:linkedin\.com|youtube\.com|youtu\.be)/i.test(url)
}

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
                <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 accent-badge rounded-md text-xs font-medium">
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  {t}
                </span>
              )
            })}
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{proj.description}</p>

          {(proj.links.front || proj.links.back || proj.links.model) && (
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 self-center mr-1">Repositories:</span>
              {proj.links.front && (
                <a href={proj.links.front} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover-accent-border hover-accent-text transition">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M4 5a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2h-2l-4-4H6z"/><path fillRule="evenodd" d="M8 7a2 2 0 002 2h4a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2vz"/></svg>
                  Frontend
                </a>
              )}
              {proj.links.back && (
                <a href={proj.links.back} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover-accent-border hover-accent-text transition">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M4 5a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2h-2l-4-4H6z"/><path fillRule="evenodd" d="M8 7a2 2 0 002 2h4a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2vz"/></svg>
                  Backend
                </a>
              )}
              {proj.links.model && (
                <a href={proj.links.model} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover-accent-border hover-accent-text transition">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M4 5a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2h-2l-4-4H6z"/><path fillRule="evenodd" d="M8 7a2 2 0 002 2h4a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2vz"/></svg>
                  AI Model
                </a>
              )}
            </div>
          )}

          {proj.context && (
            <p className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
              <svg className="w-3.5 h-3.5 mt-0.5 shrink-0 accent-text" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.42a12 12 0 01.84 4.42c0 1.9-.55 3.67-1.5 5.16M12 14l-6.16-3.42A12 12 0 005 15c0 1.9.55 3.67 1.5 5.16M12 21a9 9 0 01-9-9m9 9a9 9 0 009-9"/></svg>
              <span>{proj.context}</span>
            </p>
          )}

          <div className="flex gap-4">
            {proj.links.code && (
              <a href={proj.links.code} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium btn-accent rounded-lg transition">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                Code
              </a>
            )}
            {proj.links.demo && (
              <a href={proj.links.demo} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium btn-accent-ghost rounded-lg transition">
                {isVideoDemo(proj.links.demo) ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M10 15.5v-7l6 3.5-6 3.5z"/><path fillRule="evenodd" d="M2.25 6.75A2.25 2.25 0 014.5 4.5h15a2.25 2.25 0 012.25 2.25v10.5A2.25 2.25 0 0119.5 19.5h-15a2.25 2.25 0 01-2.25-2.25V6.75zM4.5 6a.75.75 0 00-.75.75v10.5c0 .414.336.75.75.75h15a.75.75 0 00.75-.75V6.75a.75.75 0 00-.75-.75h-15z"/></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                )}
                {isVideoDemo(proj.links.demo) ? 'Video Demo' : 'Live Demo'}
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
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  const filtered = filter === 'all'
    ? projects
    : projects.filter(p => p.focus?.includes(filter))
  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const visible = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE)

  const applyFilter = (id) => {
    setFilter(id)
    setPage(0)
  }

  const closeModal = useCallback(() => setSelected(null), [])

  return (
    <section id="projects" ref={ref} className="relative min-h-screen flex items-center px-6 py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="w-full max-w-5xl mx-auto">
        <div className={`text-center mb-16 ${inView ? 'anim-fade-up in' : 'anim-fade-up'}`}>
          <span className="text-xs font-semibold tracking-widest accent-text uppercase">Work</span>
          <h2 className={`text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2 section-title ${inView ? 'in' : ''}`}>Projects</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-5">Things I have built</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {FILTERS.map(f => (
            <button key={f.id} onClick={() => applyFilter(f.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${filter === f.id
                ? 'page-active border-transparent'
                : 'text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover-accent-border page-inactive'
              }`}>
              {f.label}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="text-center text-slate-400 dark:text-slate-500 py-16">No projects in this category yet.</p>
        ) : (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger ${inView ? 'in' : ''}`}>
          {visible.map((proj, i) => (
            <div key={i} onClick={() => setSelected(proj)} className="group card-hover bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 overflow-hidden cursor-pointer">
              {proj.image ? (
                <div className="overflow-hidden border-b border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-800">
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
                      <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 accent-badge rounded-md text-[10px] font-medium">
                        {Icon && <Icon className="w-3 h-3" />}
                        {t}
                      </span>
                    )
                  })}
                  {proj.tech.split(', ').length > 3 && (
                    <span className="px-2 py-0.5 text-slate-400 rounded-md text-[10px]">+{proj.tech.split(', ').length - 3}</span>
                  )}
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1 group-hover-accent-text transition-colors">{proj.name}</h3>
                <div className="flex gap-1.5 mb-3">
                  {proj.focus && proj.focus.map((f, idx) => (
                    <span key={f} className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[0.65em] font-medium border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-accent-hover border-transparent hover:text-white transition-all">
                      {f}
                    </span>
                  ))}
                </div>
                {proj.context && (
                  <span className="inline-flex items-center gap-1 mb-2 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500 dark:bg-slate-700/50 dark:text-slate-400">
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.42a12 12 0 01.84 4.42c0 1.9-.55 3.67-1.5 5.16M12 14l-6.16-3.42A12 12 0 005 15c0 1.9.55 3.67 1.5 5.16"/></svg>
                    Taught live
                  </span>
                )}
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">{proj.description}</p>
                <div className="flex gap-3">
                  {proj.links.code && (
                    <a href={proj.links.code} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                      className="text-xs text-slate-500 dark:text-slate-400 hover-accent-text font-medium transition flex items-center gap-1">
                       <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                       Code →
                     </a>
                   )}
                   {proj.links.demo && (
                     <a href={proj.links.demo} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                       className="text-xs text-slate-500 dark:text-slate-400 hover-accent-text font-medium transition flex items-center gap-1">
                       {isVideoDemo(proj.links.demo) ? (
                         <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M10 15.5v-7l6 3.5-6 3.5z"/><path fillRule="evenodd" d="M2.25 6.75A2.25 2.25 0 014.5 4.5h15a2.25 2.25 0 012.25 2.25v10.5A2.25 2.25 0 0119.5 19.5h-15a2.25 2.25 0 01-2.25-2.25V6.75zM4.5 6a.75.75 0 00-.75.75v10.5c0 .414.336.75.75.75h15a.75.75 0 00.75-.75V6.75a.75.75 0 00-.75-.75h-15z"/></svg>
                       ) : (
                         <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                       )}
                       {isVideoDemo(proj.links.demo) ? 'Video →' : 'Demo →'}
                     </a>
                   )}
                 </div>
               </div>
             </div>
           ))}
         </div>
         )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover-accent-border disabled:opacity-30 disabled:pointer-events-none transition">
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i)}
                className={`w-8 h-8 text-sm rounded-lg font-medium transition ${i === page
                  ? 'page-active'
                  : 'text-slate-500 dark:text-slate-400 page-inactive'
                }`}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
              className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover-accent-border disabled:opacity-30 disabled:pointer-events-none transition">
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