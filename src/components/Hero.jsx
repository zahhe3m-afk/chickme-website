import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useMagnetic from '../hooks/useMagnetic'

gsap.registerPlugin(ScrollTrigger)

const RED    = '#ff002b'
const YELLOW = '#ffe600'
const WHITE  = '#ffffff'
const STAR_PATH = 'M12 0 L14.4 9.6 L24 12 L14.4 14.4 L12 24 L9.6 14.4 L0 12 L9.6 9.6Z'

function StarPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      style={{ opacity: 0.05 }}
      aria-hidden="true"
    >
      <defs>
        <pattern id="heroStarGrid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d={STAR_PATH} fill={WHITE} transform="translate(6,6)" />
          <circle cx="36" cy="36" r="3" fill={WHITE} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#heroStarGrid)" />
    </svg>
  )
}

function FloatingSparks() {
  const sparks = [
    { top: '15%', left: '8%',   size: 32, dur: '7s',  delay: '0s'   },
    { top: '25%', right: '10%', size: 24, dur: '9s',  delay: '1.5s' },
    { top: '60%', left: '5%',   size: 20, dur: '11s', delay: '0.8s' },
    { top: '70%', right: '7%',  size: 28, dur: '8s',  delay: '2s'   },
    { top: '40%', left: '50%',  size: 18, dur: '13s', delay: '3s'   },
  ]
  return (
    <>
      {sparks.map((s, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          width={s.size}
          height={s.size}
          className="absolute pointer-events-none select-none floating-spark"
          style={{
            top: s.top, left: s.left, right: s.right,
            opacity: 0.08,
            animation: `float ${s.dur} ease-in-out ${s.delay} infinite`,
            willChange: 'transform',
          }}
          aria-hidden="true"
        >
          <path d={STAR_PATH} fill={YELLOW} />
        </svg>
      ))}
    </>
  )
}

export default function Hero() {
  const heroRef      = useRef(null)
  const btnViewMenu  = useMagnetic(0.28)
  const btnFindStore = useMagnetic(0.28)

  /* Parallax on floating sparks */
  useEffect(() => {
    const sparks = heroRef.current?.querySelectorAll('.floating-spark')
    if (!sparks?.length) return
    const multipliers = [0.12, 0.18, 0.10, 0.22, 0.15]
    const ctx = gsap.context(() => {
      sparks.forEach((el, i) => {
        gsap.to(el, {
          yPercent: -(multipliers[i] * 300),
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
          },
        })
      })
    }, heroRef)
    return () => ctx.revert()
  }, [])

  /* Staggered entrance — CSS animations (no GSAP, immune to StrictMode double-mount) */

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: RED }}
    >
      <StarPattern />
      <FloatingSparks />

      {/* Brand content */}
      <div
        className="hero-content stg relative z-20 flex flex-col items-center text-center px-6"
        style={{ maxWidth: 680 }}
      >
        {/* Badge */}
        <span
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-6"
          style={{
            background: YELLOW, color: '#141414',
            fontFamily: 'var(--font-secondary)',
            transform: 'rotate(-2deg)',
            letterSpacing: '0.04em',
          }}
        >
          NOW IN THE UAE 🇦🇪
        </span>

        {/* Wordmark */}
        <h1
          className="font-black uppercase leading-none mb-4 select-none"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3.5rem, 12vw, 9rem)',
            color: WHITE,
            textShadow: '4px 4px 0px rgba(0,0,0,0.15)',
            letterSpacing: '-0.02em',
          }}
        >
          CHICKME
        </h1>

        {/* Arabic */}
        <p
          dir="rtl"
          className="mb-2"
          style={{
            fontFamily: 'var(--font-secondary)',
            fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
            color: 'rgba(255,255,255,0.75)',
            letterSpacing: '0.06em',
          }}
        >
          شيك مي
        </p>

        {/* Tagline */}
        <p
          className="font-black uppercase tracking-widest mb-10"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
            color: YELLOW,
            letterSpacing: '0.15em',
          }}
        >
          Fried with Fun!
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#menu"
            ref={btnViewMenu}
            className="magnetic px-8 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-200 hover:-translate-y-1"
            style={{
              fontFamily: 'var(--font-secondary)',
              background: YELLOW, color: '#141414',
              boxShadow: '0 4px 0 rgba(0,0,0,0.25)',
              letterSpacing: '0.08em',
            }}
          >
            View Menu
          </a>
          <a
            href="#location"
            ref={btnFindStore}
            className="magnetic px-8 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-200 hover:-translate-y-1"
            style={{
              fontFamily: 'var(--font-secondary)',
              border: `2px solid ${WHITE}`, color: WHITE,
              letterSpacing: '0.08em',
            }}
          >
            Find a Store
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ zIndex: 20 }}
      >
        <div
          className="w-6 h-10 rounded-full flex items-start justify-center pt-2"
          style={{ border: '2px solid rgba(255,255,255,0.4)' }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: YELLOW, animation: 'scrollDot 1.5s ease infinite' }}
          />
        </div>
        <span style={{
          fontFamily: 'var(--font-secondary)',
          fontSize: '0.65rem',
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
        }}>
          Scroll
        </span>
      </div>
    </section>
  )
}
