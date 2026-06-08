import { memo } from 'react'
import { useInView } from '../hooks/useInView'
import data from '../data/portfolio.json'

function Experience() {
  const { experience } = data
  const [ref, inView] = useInView()

  return (
    <section id="experience" ref={ref} className="relative min-h-screen flex items-center px-6 py-24 bg-white dark:bg-slate-950">
      <div className="w-full max-w-4xl mx-auto">
        <div className={`text-center mb-16 ${inView ? 'anim-fade-up in' : 'anim-fade-up'}`}>
          <span className="text-xs font-semibold tracking-widest text-violet-600 dark:text-violet-400 uppercase">Career</span>
          <h2 className={`text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2 section-title ${inView ? 'in' : ''}`}>Experience</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-5">Where I have worked</p>
        </div>

        <div className="space-y-6">
          {experience.map((job, i) => (
            <div
              key={i}
              className={`anim-fade-up ${inView ? 'in' : ''}`}
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="card-hover bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{job.role}</h3>
                    <p className="text-sm text-violet-600 dark:text-violet-400 font-medium">{job.company}</p>
                  </div>
                  <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">{job.period}</span>
                </div>
                <ul className="space-y-2">
                  {job.highlights.map((h, j) => (
                    <li key={j} className="flex gap-2.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default memo(Experience)
