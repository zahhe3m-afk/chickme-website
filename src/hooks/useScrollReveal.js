import { useEffect } from 'react'

/**
 * useScrollReveal — watches all .rv, .rl, .rr, .rs elements via
 * IntersectionObserver and adds .visible to trigger CSS transitions.
 * Works regardless of tab focus (unlike CSS animations).
 * Call once at the App level.
 */
export default function useScrollReveal() {
  useEffect(() => {
    const selector = '.rv, .rl, .rr, .rs'
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target) // reveal once only
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    const observe = () => {
      document.querySelectorAll(selector).forEach(el => observer.observe(el))
    }

    observe()

    // Re-scan after a tick in case elements mount late
    const t = setTimeout(observe, 300)

    return () => {
      clearTimeout(t)
      observer.disconnect()
    }
  }, [])
}
