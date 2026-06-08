import { memo } from 'react'
import { useInView } from '../hooks/useInView'
import { getSkillIcon } from '../data/skillIcons'
import data from '../data/portfolio.json'

function SkillTag({ name }) {
  const Icon = getSkillIcon(name)
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium border border-slate-100 dark:border-slate-600/30 hover:bg-violet-100 dark:hover:bg-violet-500/10 hover:text-violet-700 dark:hover:text-violet-300 hover:border-violet-300 dark:hover:border-violet-500/30 transition-all duration-200">
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      {name}
    </span>
  )
}

function Skills() {
  const { skills } = data
  const [ref, inView] = useInView()
  const entries = Object.entries(skills)

  return (
    <section id="skills" ref={ref} className="relative min-h-screen flex items-center px-6 py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="w-full max-w-5xl mx-auto">
        <div className={`text-center mb-16 ${inView ? 'anim-fade-up in' : 'anim-fade-up'}`}>
          <span className="text-xs font-semibold tracking-widest text-violet-600 dark:text-violet-400 uppercase">Expertise</span>
          <h2 className={`text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2 section-title ${inView ? 'in' : ''}`}>
            Technical Skills
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-5 max-w-md mx-auto">Technologies I work with daily</p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 stagger ${inView ? 'in' : ''}`}>
          {entries.slice(0, 6).map(([category, items]) => (
            <div key={category} className="card-hover bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/50 shadow-sm">
              <h3 className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-3">{category}</h3>
              <div className={`flex flex-wrap gap-1.5 tag-stagger ${inView ? 'in' : ''}`}>
                {items.map((skill) => (
                  <SkillTag key={skill} name={skill} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {entries.length > 6 && (
          <details className={`group mt-4 ${inView ? 'anim-fade-up in' : 'anim-fade-up'}`} style={{ animationDelay: '0.4s' }}>
            <summary className="cursor-pointer text-sm text-violet-600 dark:text-violet-400 font-medium hover:text-violet-500 transition flex items-center gap-2 justify-center py-3 list-none">
              <span className="group-open:hidden">Show more</span>
              <span className="hidden group-open:inline">Show less</span>
              <svg className={`w-4 h-4 transition-transform ${inView ? 'group-open:rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
            </summary>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 stagger in">
              {entries.slice(6).map(([category, items]) => (
                <div key={category} className="card-hover bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/50 shadow-sm">
                  <h3 className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-3">{category}</h3>
                  <div className="flex flex-wrap gap-1.5 tag-stagger in">
                    {items.map((skill) => (
                      <SkillTag key={skill} name={skill} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    </section>
  )
}

export default memo(Skills)
