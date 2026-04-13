import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

/**
 * useMagnetic — applies a subtle magnetic pull toward the cursor.
 * Attach the returned ref to any button/link you want to feel "saucy".
 * strength: how many pixels the element shifts (default 0.3 × offset)
 */
export default function useMagnetic(strength = 0.3) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Only activate on pointer:fine (desktop)
    if (!window.matchMedia('(pointer: fine)').matches) return

    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) * strength
      const dy = (e.clientY - cy) * strength
      gsap.to(el, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' })
    }

    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)

    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [strength])

  return ref
}
