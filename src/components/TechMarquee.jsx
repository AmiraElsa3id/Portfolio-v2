import { memo } from 'react'
import {
  SiReact, SiNextdotjs, SiVuedotjs, SiTypescript, SiJavascript,
  SiHtml5, SiCss, SiPhp, SiPython, SiDjango, SiLaravel,
  SiTailwindcss, SiBootstrap, SiMysql, SiMongodb,
  SiGit, SiGithub, SiLinux, SiNginx, SiApache, SiFigma, SiStripe,
} from 'react-icons/si'
import { FaNodeJs, FaSass } from 'react-icons/fa'
import { TbBrandRedux } from 'react-icons/tb'

const techs = [
  { icon: SiReact, name: 'React' },
  { icon: SiNextdotjs, name: 'Next.js' },
  { icon: SiVuedotjs, name: 'Vue.js' },
  { icon: SiTypescript, name: 'TypeScript' },
  { icon: SiJavascript, name: 'JavaScript' },
  { icon: SiHtml5, name: 'HTML5' },
  { icon: SiCss, name: 'CSS3' },
  { icon: SiPhp, name: 'PHP' },
  { icon: SiPython, name: 'Python' },
  { icon: SiDjango, name: 'Django' },
  { icon: SiLaravel, name: 'Laravel' },
  { icon: FaNodeJs, name: 'Node.js' },
  { icon: SiTailwindcss, name: 'Tailwind' },
  { icon: SiBootstrap, name: 'Bootstrap' },
  { icon: FaSass, name: 'SASS' },
  { icon: SiMysql, name: 'MySQL' },
  { icon: SiMongodb, name: 'MongoDB' },
  { icon: TbBrandRedux, name: 'Redux' },
  { icon: SiGit, name: 'Git' },
  { icon: SiGithub, name: 'GitHub' },
  { icon: SiLinux, name: 'Linux' },
  { icon: SiNginx, name: 'Nginx' },
  { icon: SiApache, name: 'Apache' },
  { icon: SiFigma, name: 'Figma' },
  { icon: SiStripe, name: 'Stripe' },
]

function TechMarquee() {
  return (
    <div className="w-full overflow-hidden py-10">
      <div className="marquee-track flex gap-6 w-max">
        {[...techs, ...techs].map(({ icon: Icon, name }, i) => (
          <div
            key={`${name}-${i}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm text-slate-600 dark:text-slate-400"
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium whitespace-nowrap">{name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default memo(TechMarquee)
