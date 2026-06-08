import { lazy, Suspense } from 'react'
import Navbar from './components/Navbar'
import Chatbot from './components/Chatbot'
import Header from './components/Header'

const Skills = lazy(() => import('./components/Skills'))
const Experience = lazy(() => import('./components/Experience'))
const Projects = lazy(() => import('./components/Projects'))
const Education = lazy(() => import('./components/Education'))
const Honors = lazy(() => import('./components/Honors'))
const Contact = lazy(() => import('./components/Contact'))

function Skeleton() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-900/50">
      <div className="w-full max-w-4xl space-y-6 animate-pulse">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-48 mx-auto" />
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-64 mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="h-40 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
          <div className="h-40 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
    </section>
  )
}

export default function App() {
  return (
    <>
      <Navbar />
      <Header />
      <Suspense fallback={<Skeleton />}><Skills /></Suspense>
      <Suspense fallback={<Skeleton />}><Experience /></Suspense>
      <Suspense fallback={<Skeleton />}><Projects /></Suspense>
      <Suspense fallback={<Skeleton />}><Education /></Suspense>
      <Suspense fallback={<Skeleton />}><Honors /></Suspense>
      <Suspense fallback={<Skeleton />}><Contact /></Suspense>
      <footer className="text-center py-8 text-sm text-slate-400 dark:text-slate-600 border-t border-slate-100 dark:border-slate-800">
        <span className="text-violet-400 mr-1">✦</span>
        Built with React
      </footer>
      <Chatbot />
    </>
  )
}
