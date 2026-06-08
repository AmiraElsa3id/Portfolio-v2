import { memo, useRef, useEffect, useState } from 'react'
import { useInView } from '../hooks/useInView'
import data from '../data/portfolio.json'

function LanguageBar({ lang, level, width, inView }) {
  const barRef = useRef(null)
  const [filled, setFilled] = useState(false)

  useEffect(() => {
    if (inView && !filled) {
      const timer = setTimeout(() => setFilled(true), 600)
      return () => clearTimeout(timer)
    }
  }, [inView, filled])

  return (
    <div key={lang}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{lang}</span>
        <span className="text-xs text-slate-400 dark:text-slate-500">{level}</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
        <div
          ref={barRef}
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-amber-400 transition-all duration-1000 ease-out"
          style={{ width: filled ? width : '0%' }}
        />
      </div>
    </div>
  )
}

function Honors() {
  const { honors, languages } = data
  const [ref, inView] = useInView()

  return (
    <section id="honors" ref={ref} className="relative min-h-screen flex items-center px-6 py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="w-full max-w-4xl mx-auto">
        <div className={`text-center mb-16 ${inView ? 'anim-fade-up in' : 'anim-fade-up'}`}>
          <span className="text-xs font-semibold tracking-widest text-violet-600 dark:text-violet-400 uppercase">Recognition</span>
          <h2 className={`text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2 section-title ${inView ? 'in' : ''}`}>
            Honors & Languages
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-5">Awards and communication</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className={`anim-fade-up ${inView ? 'in' : ''}`}>
            <div className="card-hover bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700/50 h-full">
              <h3 className="text-xs font-semibold tracking-widest text-violet-600 dark:text-violet-400 uppercase mb-4 flex items-center gap-2">
                <span className="text-amber-500">★</span>
                Achievements
              </h3>
              <ul className="space-y-3">
                {honors.map((h, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    <span className="text-amber-400 mt-0.5 shrink-0">✦</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={`anim-fade-up ${inView ? 'in' : ''}`} style={{ animationDelay: '0.15s' }}>
            <div className="card-hover bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700/50 h-full">
              <h3 className="text-xs font-semibold tracking-widest text-violet-600 dark:text-violet-400 uppercase mb-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Languages
              </h3>
              <div className="space-y-4">
                {Object.entries(languages).map(([lang, level]) => (
                  <LanguageBar
                    key={lang}
                    lang={lang}
                    level={level}
                    width={lang === 'Arabic' ? '100%' : lang === 'English' ? '65%' : '30%'}
                    inView={inView}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default memo(Honors)
