import { memo } from 'react'
import { useInView } from '../hooks/useInView'
import data from '../data/portfolio.json'

function Education() {
  const { education } = data
  const [ref, inView] = useInView()

  return (
    <section id="education" ref={ref} className="relative min-h-screen flex items-center px-6 py-24 bg-white dark:bg-slate-950">
      <div className="w-full max-w-3xl mx-auto">
        <div className={`text-center mb-16 ${inView ? 'anim-fade-up in' : 'anim-fade-up'}`}>
          <span className="text-xs font-semibold tracking-widest accent-text uppercase">Learning</span>
          <h2 className={`text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2 section-title ${inView ? 'in' : ''}`}>Education</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-5">Academic background</p>
        </div>

        <div className="space-y-4">
          {education.map((edu, i) => (
            <div
              key={i}
              className={`anim-fade-up ${inView ? 'in' : ''}`}
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="card-hover flex items-start gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl accent-light-bg flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-5 h-5 accent-text" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{edu.degree}</h3>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 whitespace-nowrap">{edu.period}</span>
                  </div>
                  <p className="text-xs accent-text font-medium mt-0.5">{edu.school}</p>
                  {edu.details.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {edu.details.map((d, j) => (
                        <li key={j} className="flex gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span className="text-violet-400 mt-0.5">·</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
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

export default memo(Education)
