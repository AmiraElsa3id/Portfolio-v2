import {
  SiReact, SiNextdotjs, SiVuedotjs, SiJquery, SiDjango, SiLaravel,
  SiTypescript, SiJavascript, SiHtml5, SiCss, SiPhp, SiPython,
  SiTailwindcss, SiBootstrap, SiMysql, SiMongodb,
  SiGit, SiGithub, SiLinux, SiNginx, SiApache, SiFigma,
  SiStripe, SiPostman,
  SiVite, SiReactrouter, SiReactquery, SiAxios, SiChartdotjs, SiFramer,
  SiAngular, SiFlask, SiCplusplus, SiNodedotjs, SiExpress,
} from 'react-icons/si'
import { FaSass, FaJava } from 'react-icons/fa'
import {
  TbBrandRedux, TbApi, TbAccessible, TbComponents, TbSql,
  TbChartBar, TbServer, TbCode, TbUsers, TbMessage, TbLock, TbBox,
} from 'react-icons/tb'

const iconMap = {
  // Languages
  'javascript (es6+)': SiJavascript,
  typescript: SiTypescript,
  html5: SiHtml5,
  css3: SiCss,
  php: SiPhp,
  python: SiPython,
  sql: TbSql,
  'c++': SiCplusplus,
  'c++ (basic)': SiCplusplus,
  java: FaJava,
  'java (basic)': FaJava,

  // Frameworks & Libraries
  react: SiReact,
  'next.js': SiNextdotjs,
  'vue.js': SiVuedotjs,
  angular: SiAngular,
  'angular (basic)': SiAngular,
  jquery: SiJquery,
  django: SiDjango,
  flask: SiFlask,
  laravel: SiLaravel,
  'node.js': SiNodedotjs,
  express: SiExpress,
  vite: SiVite,
  'react router': SiReactrouter,

  // Styling
  'tailwind css': SiTailwindcss,
  bootstrap: SiBootstrap,
  'sass/scss': FaSass,
  'css animations': SiCss,
  'responsive design': TbComponents,

  // State Management
  'react context api': TbBrandRedux,
  'react hooks': SiReact,
  redux: TbBrandRedux,
  zustand: TbBox,

  // Data & Libraries
  'tanstack query': SiReactquery,
  'react query': SiReactquery,
  axios: SiAxios,
  'chart.js': SiChartdotjs,
  chartjs: SiChartdotjs,
  'framer motion': SiFramer,

  // APIs & Auth
  'restful apis': TbApi,
  'rest api': TbApi,
  'jwt authentication': TbLock,
  'stripe payment': SiStripe,
  stripe: SiStripe,
  rbac: TbUsers,
  'spatie laravel permission': SiLaravel,

  // Backend
  'custom php mvc': SiPhp,
  postman: SiPostman,
  'api design': TbApi,

  // Databases
  mysql: SiMysql,
  mongodb: SiMongodb,
  'eloquent orm': SiLaravel,
  pdo: SiPhp,
  'query optimisation': TbSql,

  // Performance
  'core web vitals': TbChartBar,
  'lighthouse auditing': TbChartBar,
  'code splitting': TbCode,
  'lazy loading': TbCode,
  'image optimisation': TbCode,

  // Accessibility
  'wcag guidelines': TbAccessible,
  'semantic html': SiHtml5,
  'aria attributes': TbAccessible,

  // DevOps & Tools
  git: SiGit,
  github: SiGithub,
  linux: SiLinux,
  apache: SiApache,
  nginx: SiNginx,
  'ci/cd basics': TbServer,
  figma: SiFigma,
  'agile/scrum': TbUsers,

  // Soft Skills
  'problem solving': TbCode,
  'critical thinking': TbCode,
  mentorship: TbUsers,
  'technical communication': TbMessage,
  'attention to detail': TbCode,
  collaboration: TbUsers,
  adaptability: TbCode,
}

export function getSkillIcon(name) {
  const key = name.toLowerCase().trim()
  return iconMap[key] || null
}
