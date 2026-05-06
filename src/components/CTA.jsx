import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useMagnetic from '../hooks/useMagnetic'

gsap.registerPlugin(ScrollTrigger)

// ---------------------------------------------------------------------------
// StarSVG — module-level component (never re-defined on renders)
// ---------------------------------------------------------------------------
const StarSVG = ({ size, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="#ff002b"
    aria-hidden="true"
    style={{ position: 'absolute', opacity: 0.08, pointerEvents: 'none', ...style }}
  >
    <path d="M12 0 L14.4 9.6 L24 12 L14.4 14.4 L12 24 L9.6 14.4 L0 12 L9.6 9.6Z" />
  </svg>
)

// ---------------------------------------------------------------------------
// Static decorative stars — hoisted to module level (rendering-hoist-jsx)
// Each element's props are constant, so JSX nodes need not be recreated
// on every render of the parent component.
// ---------------------------------------------------------------------------
const STARS = (
  <>
    <StarSVG size={160} style={{ top: '10%', left: '5%' }} />
    <StarSVG size={120} style={{ top: '20%', right: '8%' }} />
    <StarSVG size={80}  style={{ bottom: '15%', left: '15%' }} />
    <StarSVG size={100} style={{ bottom: '10%', right: '5%' }} />
    <StarSVG size={200} style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
  </>
)

// ---------------------------------------------------------------------------
// Static inline SVG for the Instagram icon inside the follow button.
// Hoisted so the element reference is stable across renders.
// ---------------------------------------------------------------------------
const InstagramIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
)

// ---------------------------------------------------------------------------
// CTA Section
// ---------------------------------------------------------------------------
export default function CTA() {
  const sectionRef   = useRef(null)
  const labelRef     = useRef(null)
  const titleRef     = useRef(null)
  const subtitleRef  = useRef(null)
  const followBtnRef = useMagnetic(0.28)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      })
      tl.from(labelRef.current,    { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out' })
        .from(titleRef.current,    { y: 60, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.3')
        .from(subtitleRef.current, { y: 40, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3')
        .from(followBtnRef.current,{ y: 30, opacity: 0, duration: 0.5, ease: 'power3.out' }, '-=0.2')
    }, sectionRef)
    return () => ctx.revert()
  }, [followBtnRef]) // GSAP context is set up once; the magnetic ref object is stable

  return (
    <section
      id="cta"
      ref={sectionRef}
      style={{
        background: '#ffe600',
        padding: '120px 32px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background stars (static, hoisted) */}
      {STARS}

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Pre-title label */}
        <p
          ref={labelRef}
          style={{
            color: 'rgba(20,20,20,0.5)',
            fontFamily: 'var(--font-secondary)',
            fontWeight: 700,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            margin: '0 0 16px',
          }}
        >
          COMING SOON
        </p>

        {/* Main title */}
        <h2
          ref={titleRef}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
            color: '#141414',
            lineHeight: 1.05,
            margin: '0 0 24px',
          }}
        >
          Grand Opening Soon!
        </h2>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.1rem',
            color: 'rgba(20,20,20,0.65)',
            maxWidth: 480,
            margin: '0 auto 48px',
            lineHeight: 1.65,
          }}
        >
          Follow us on Instagram for the exact date, exclusive deals, and all the good stuff.
        </p>

        {/* Follow button — magnetic effect via useMagnetic(0.28) */}
        <a
          ref={followBtnRef}
          href="https://instagram.com/chick.me.ae"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: '#141414',
            color: '#ffffff',
            padding: '16px 36px',
            borderRadius: 9999,
            fontFamily: 'var(--font-secondary)',
            fontWeight: 700,
            fontSize: '1rem',
            textDecoration: 'none',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          {InstagramIcon}
          Follow @chick.me.ae
        </a>
      </div>
    </section>
  )
}
