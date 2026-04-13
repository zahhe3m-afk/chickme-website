import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ITEMS = [
  'Crispy Fried Chicken',
  'Bold Flavors',
  'From 15 AED',
  'Fresh Every Day',
  'Fried with Fun',
  'شيك مي',
  'Burgers & Pizza',
  'Born in the UAE',
]

const DOUBLED_ITEMS = [...ITEMS, ...ITEMS]

const StarSVG = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="#ff002b"
    style={{ flexShrink: 0 }}
  >
    <path d="M12 0 L14.4 9.6 L24 12 L14.4 14.4 L12 24 L9.6 14.4 L0 12 L9.6 9.6Z" />
  </svg>
)

function Marquee() {
  const wrapperRef = useRef(null)
  const trackRef = useRef(null)
  const tweenRef = useRef(null)
  const scrollTriggerRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Create the infinite scroll tween
    const tween = gsap.to(track, {
      x: '-50%',
      repeat: -1,
      ease: 'none',
      duration: 25,
    })

    tweenRef.current = tween

    if (prefersReduced) {
      tween.timeScale(0)
    } else {
      // Scroll-velocity reactive animation
      const st = ScrollTrigger.create({
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: false,
        onUpdate: (self) => {
          const velocity = self.getVelocity()
          const multiplier = 1 + Math.min(Math.abs(velocity) / 2000, 3)
          const skew = Math.max(-4, Math.min(velocity / 400, 4))

          gsap.to(tween, { timeScale: multiplier, duration: 0.5 })
          gsap.to(track, { skewX: skew, duration: 0.3 })
        },
      })

      scrollTriggerRef.current = st
    }

    return () => {
      tween.kill()
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill()
      }
    }
  }, [])

  const handleMouseEnter = () => {
    if (tweenRef.current) tweenRef.current.pause()
  }

  const handleMouseLeave = () => {
    if (tweenRef.current) tweenRef.current.play()
  }

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        background: '#ffe600',
        overflow: 'hidden',
        padding: '14px 0',
        transform: 'rotate(-1.5deg)',
        width: 'calc(100% + 40px)',
        marginLeft: '-20px',
      }}
    >
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          whiteSpace: 'nowrap',
          willChange: 'transform',
        }}
      >
        {DOUBLED_ITEMS.map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              flexShrink: 0,
            }}
          >
            {i > 0 && <StarSVG />}
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(0.9rem, 1.8vw, 1.15rem)',
                color: '#141414',
                textTransform: 'uppercase',
                fontWeight: 900,
                letterSpacing: '0.06em',
              }}
            >
              {item}
            </span>
          </div>
        ))}
        <StarSVG />
      </div>
    </div>
  )
}

export default Marquee
