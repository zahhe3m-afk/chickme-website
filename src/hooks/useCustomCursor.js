import { useEffect } from 'react'

/**
 * useCustomCursor — tracks mouse position and applies .hover class
 * on interactive elements (a, button, [data-cursor]).
 */
export default function useCustomCursor() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    const cursor = document.getElementById('cursor')
    if (!cursor) return

    const onMove = (e) => {
      cursor.style.left = e.clientX + 'px'
      cursor.style.top  = e.clientY + 'px'
    }

    const onEnter = () => cursor.classList.add('hover')
    const onLeave = () => cursor.classList.remove('hover')

    document.addEventListener('mousemove', onMove)

    const targets = document.querySelectorAll('a, button, [data-cursor]')
    targets.forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    return () => {
      document.removeEventListener('mousemove', onMove)
      targets.forEach(el => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [])
}
