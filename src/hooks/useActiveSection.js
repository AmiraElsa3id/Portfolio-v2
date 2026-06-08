import { useState, useEffect } from 'react'

export function useActiveSection(sectionIds) {
  const [active, setActive] = useState('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length > 0) {
          setActive(visible[0].target.id)
        }
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    )

    const elements = sectionIds.map(id => document.getElementById(id)).filter(Boolean)
    elements.forEach(el => observer.observe(el))
    return () => elements.forEach(el => observer.unobserve(el))
  }, [sectionIds])

  return active
}
