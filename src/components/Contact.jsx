import { memo, useState } from 'react'
import { useInView } from '../hooks/useInView'

const FORM_ENDPOINT = 'https://formspree.io/f/mgobknjq'

function Contact() {
  const [state, setState] = useState({ status: '', message: '' })
  const [ref, inView] = useInView()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.target
    const data = new FormData(form)
    setState({ status: 'sending', message: '' })

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST', body: data,
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        setState({ status: 'success', message: 'Message sent! I will get back to you soon.' })
        form.reset()
      } else {
        const json = await res.json()
        setState({ status: 'error', message: json.error || 'Something went wrong.' })
      }
    } catch {
      setState({ status: 'error', message: 'Network error. Please try again.' })
    }
  }

  return (
    <section id="contact" ref={ref} className="relative min-h-screen flex items-center px-6 py-24 bg-white dark:bg-slate-950">
      <div className="relative w-full max-w-lg mx-auto">
        <div className={`text-center mb-12 ${inView ? 'anim-fade-up in' : 'anim-fade-up'}`}>
          <span className="text-xs font-semibold tracking-widest accent-text uppercase">Contact</span>
          <h2 className={`text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2 section-title ${inView ? 'in' : ''}`}>Get in Touch</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-5">Have a question or want to work together?</p>
        </div>

        <form onSubmit={handleSubmit} className={`space-y-4 anim-fade-up ${inView ? 'in' : ''}`} style={{ animationDelay: '0.15s' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" name="name" required placeholder="Your Name"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-violet-400 dark:focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition text-sm" />
            <input type="email" name="email" required placeholder="Your Email"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-violet-400 dark:focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition text-sm" />
          </div>
          <input type="text" name="subject" placeholder="Subject"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-violet-400 dark:focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition text-sm" />
          <textarea name="message" rows="4" required placeholder="Your Message"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-violet-400 dark:focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition text-sm resize-none" />
          <button type="submit" disabled={state.status === 'sending'}
            className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all text-sm active:scale-[0.98] hover:shadow-lg hover:shadow-violet-500/25">
            {state.status === 'sending' ? 'Sending...' : 'Send Message'}
          </button>
          {state.message && (
            <p className={`text-xs text-center ${state.status === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
              {state.message}
            </p>
          )}
        </form>
      </div>
    </section>
  )
}

export default memo(Contact)
