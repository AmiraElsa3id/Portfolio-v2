import { memo } from 'react'
import { useInView } from '../hooks/useInView'
import { getSkillIcon } from '../data/skillIcons'
import data from '../data/portfolio.json'

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

function Projects() {
  const { projects } = data
  const [ref, inView] = useInView()

  return (
    <section id="projects" ref={ref} className="relative min-h-screen flex items-center px-6 py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="w-full max-w-5xl mx-auto">
        <div className={`text-center mb-16 ${inView ? 'anim-fade-up in' : 'anim-fade-up'}`}>
          <span className="text-xs font-semibold tracking-widest text-violet-600 dark:text-violet-400 uppercase">Work</span>
          <h2 className={`text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2 section-title ${inView ? 'in' : ''}`}>Projects</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-5">Things I have built</p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 gap-5 stagger ${inView ? 'in' : ''}`}>
          {projects.map((proj, i) => (
            <div key={i} className="group card-hover bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 overflow-hidden">
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
                    <a href={proj.links.code} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 font-medium transition flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                      Code →
                    </a>
                  )}
                  {proj.links.demo && (
                    <a href={proj.links.demo} target="_blank" rel="noopener noreferrer"
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
      </div>
    </section>
  )
}

export default memo(Projects)
