/**
 * ScrollVideo — canvas-based scroll-scrubbed video hero (desktop).
 * Mobile: pure GSAP entrance animation, no video loaded.
 *
 * Desktop scroll story:
 *   0–55%   Pure video
 *   55–68%  "Crispy. Golden. Perfection." teaser
 *   68–76%  Teaser fades out
 *   76–88%  Brand takeover: red bg covers video, logo scales in
 *   88–94%  Tagline slides up
 *   94–100% CTAs + sparkles fade in
 */

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const RED    = '#ff002b'
const YELLOW = '#ffe600'
const WHITE  = '#ffffff'
const STAR   = 'M12 0 L14.4 9.6 L24 12 L14.4 14.4 L12 24 L9.6 14.4 L0 12 L9.6 9.6Z'

const isMobile = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(max-width: 768px)').matches

const clamp = (v) => Math.max(0, Math.min(1, v))
const prog  = (p, s, e) => clamp((p - s) / (e - s))
const lerp  = (a, b, t) => a + (b - a) * t

const SPARKLES = [
  { top: '12%', left: '8%',   size: 28, rotate: 15,  delay: 0     },
  { top: '18%', right: '11%', size: 22, rotate: -20, delay: 0.3   },
  { top: '72%', left: '6%',   size: 18, rotate: 35,  delay: 0.6   },
  { top: '78%', right: '9%',  size: 24, rotate: -10, delay: 0.15  },
  { top: '45%', left: '4%',   size: 16, rotate: 45,  delay: 0.45  },
  { top: '42%', right: '5%',  size: 20, rotate: -30, delay: 0.7   },
  { top: '30%', left: '15%',  size: 14, rotate: 60,  delay: 0.2   },
  { top: '65%', right: '14%', size: 16, rotate: -45, delay: 0.5   },
]

export default function ScrollVideo() {
  const wrapperRef    = useRef(null)
  const stickyRef     = useRef(null)
  const canvasRef     = useRef(null)
  const videoRef      = useRef(null)
  const teaserRef     = useRef(null)
  const brandRef      = useRef(null)
  const logoRef       = useRef(null)
  const taglineRef    = useRef(null)
  const ctaRef        = useRef(null)
  const sparklesRef   = useRef(null)
  const scrollHintRef = useRef(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const brand   = brandRef.current
    const logo    = logoRef.current
    const tagline = taglineRef.current
    const cta     = ctaRef.current
    const sparks  = sparklesRef.current
    const hint    = scrollHintRef.current

    /* ─── MOBILE PATH — no video, pure GSAP entrance ─── */
    if (isMobile()) {
      // Immediately tell Loader we're ready — no video to wait for
      window.dispatchEvent(new Event('hero-video-ready'))

      if (hint) hint.style.display = 'none'

      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      // Red bg always visible immediately
      if (brand) brand.style.opacity = '1'

      if (prefersReduced) {
        if (logo)    { logo.style.opacity = '1';    logo.style.transform = 'scale(1)' }
        if (tagline) { tagline.style.opacity = '1'; tagline.style.transform = 'translateY(0)' }
        if (cta)     { cta.style.opacity = '1';     cta.style.transform = 'translateY(0)' }
        if (sparks)  sparks.style.opacity = '1'
      } else {
        // Set initial hidden state
        if (logo)    gsap.set(logo,    { opacity: 0, scale: 0.75 })
        if (tagline) gsap.set(tagline, { opacity: 0, y: 30 })
        if (cta)     gsap.set(cta,     { opacity: 0, y: 20 })
        if (sparks)  gsap.set(sparks,  { opacity: 0 })

        const tl = gsap.timeline({ delay: 0.25 })
        if (logo)    tl.to(logo,    { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)' })
        if (tagline) tl.to(tagline, { opacity: 1, y: 0,     duration: 0.45, ease: 'power3.out' }, '-=0.2')
        if (cta)     tl.to(cta,     { opacity: 1, y: 0,     duration: 0.4,  ease: 'power3.out' }, '-=0.15')
        if (sparks)  tl.to(sparks,  { opacity: 1,            duration: 0.4               }, '-=0.2')
      }

      return
    }

    /* ─── DESKTOP PATH — canvas scroll scrub ─── */
    const canvas = canvasRef.current
    const video  = videoRef.current
    const teaser = teaserRef.current
    if (!canvas || !video) return

    const ctx = canvas.getContext('2d')

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const w = canvas.offsetWidth, h = canvas.offsetHeight
      if (!w || !h) return
      canvas.width  = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      drawFrame()
    }
    requestAnimationFrame(resize)
    window.addEventListener('resize', resize, { passive: true })

    let firstFrameDispatched = false
    const drawFrame = () => {
      const w = canvas.offsetWidth, h = canvas.offsetHeight
      const vw = video.videoWidth, vh = video.videoHeight
      if (!vw || !vh) return
      const s = Math.max(w / vw, h / vh)
      ctx.clearRect(0, 0, w, h)
      ctx.drawImage(video, (w - vw * s) / 2, (h - vh * s) / 2, vw * s, vh * s)
      if (!firstFrameDispatched) {
        firstFrameDispatched = true
        window.dispatchEvent(new Event('hero-video-ready'))
      }
    }

    let targetTime = 0, isSeeking = false, pendingSeek = false
    const seekTo = (t) => {
      targetTime = t
      if (isSeeking) { pendingSeek = true; return }
      isSeeking = true
      video.currentTime = t
    }
    const onSeeked = () => {
      drawFrame()
      if (pendingSeek) { pendingSeek = false; video.currentTime = targetTime }
      else isSeeking = false
    }
    video.addEventListener('seeked', onSeeked)

    window.scrollTo(0, 0)
    const pin = ScrollTrigger.create({
      trigger: wrapper, start: 'top top', end: 'bottom bottom',
      pin: stickyRef.current, pinSpacing: false, anticipatePin: 1,
    })

    const init = () => {
      const dur = video.duration
      if (!dur) return
      video.pause()
      video.currentTime = 0
      drawFrame()

      const scrub = ScrollTrigger.create({
        trigger: wrapper, start: 'top top', end: 'bottom bottom',
        scrub: 0.8,
        onUpdate: (self) => {
          const p = self.progress
          seekTo(Math.min(p * dur, dur - 0.001))

          if (hint) hint.style.opacity = String(1 - prog(p, 0, 0.05))

          if (teaser) {
            let op = 0
            if      (p >= 0.40 && p < 0.50) op = prog(p, 0.40, 0.50)
            else if (p >= 0.50 && p < 0.62) op = 1
            else if (p >= 0.62 && p < 0.70) op = 1 - prog(p, 0.62, 0.70)
            teaser.style.opacity = String(clamp(op))
          }

          if (brand)   brand.style.opacity   = String(clamp(prog(p, 0.68, 0.78)))

          if (logo) {
            const f = prog(p, 0.75, 0.86)
            logo.style.opacity   = String(clamp(f))
            logo.style.transform = `scale(${lerp(0.7, 1, f)})`
          }

          if (tagline) {
            const f = prog(p, 0.83, 0.91)
            tagline.style.opacity   = String(clamp(f))
            tagline.style.transform = `translateY(${lerp(24, 0, f)}px)`
          }

          if (cta) {
            const f = prog(p, 0.88, 0.95)
            cta.style.opacity   = String(clamp(f))
            cta.style.transform = `translateY(${lerp(18, 0, f)}px)`
          }

          if (sparks) sparks.style.opacity = String(clamp(prog(p, 0.87, 0.95)))
        },
      })

      return () => scrub.kill()
    }

    let cleanupScrub
    if (video.readyState >= 1) cleanupScrub = init()
    else video.addEventListener('loadedmetadata', () => { cleanupScrub = init() }, { once: true })

    return () => {
      window.removeEventListener('resize', resize)
      video.removeEventListener('seeked', onSeeked)
      pin.kill()
      if (cleanupScrub) cleanupScrub()
    }
  }, [])

  const mobile = isMobile()

  return (
    <div ref={wrapperRef} style={{ height: mobile ? '100dvh' : '140vh', position: 'relative' }}>
      <div
        ref={stickyRef}
        id="hero"
        style={{
          position: 'sticky', top: 0, height: '100dvh', width: '100%',
          overflow: 'hidden', background: RED,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {/* Star pattern */}
        <svg
          aria-hidden="true"
          style={{ position:'absolute', inset:0, width:'100%', height:'100%',
                   opacity:0.045, pointerEvents:'none', zIndex:1 }}
        >
          <defs>
            <pattern id="svStars" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d={STAR} fill={WHITE} transform="translate(6,6)" />
              <circle cx="36" cy="36" r="3" fill={WHITE} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#svStars)" />
        </svg>

        {/* DESKTOP ONLY — canvas + video (not rendered on mobile = zero bytes loaded) */}
        {!mobile && (
          <>
            <canvas
              ref={canvasRef}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 2 }}
            />
            <video
              ref={videoRef}
              src="/videos/chicken-fill.mp4"
              preload="auto"
              muted
              playsInline
              style={{ display: 'none' }}
            />
          </>
        )}

        {/* ── TEASER (desktop only) ── */}
        {!mobile && (
          <div
            ref={teaserRef}
            style={{
              position: 'absolute', inset: 0, zIndex: 3,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'none', opacity: 0,
            }}
          >
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 6vw, 5rem)',
              color: WHITE, textAlign: 'center',
              letterSpacing: '0.04em', lineHeight: 1.15,
              textShadow: '0 4px 40px rgba(0,0,0,0.6)',
              padding: '0 24px',
            }}>
              Crispy.{' '}<span style={{ color: YELLOW }}>Golden.</span>{' '}Perfection.
            </p>
          </div>
        )}

        {/* ── BRAND TAKEOVER bg ── */}
        <div
          ref={brandRef}
          style={{
            position: 'absolute', inset: 0, zIndex: 4,
            background: RED, opacity: mobile ? 1 : 0,
            pointerEvents: 'none',
          }}
        />

        {/* ── BRAND CONTENT ── */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 5,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          {/* Radial glow */}
          <div style={{
            position: 'absolute',
            width: '70vw', height: '70vw',
            maxWidth: 800, maxHeight: 800,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,230,0,0.08) 0%, transparent 65%)',
            pointerEvents: 'none',
          }} />

          {/* Logo */}
          <div
            ref={logoRef}
            style={{ opacity: 0, transform: 'scale(0.7)', transition: 'none' }}
          >
            <img
              src="/images/logo-01.svg"
              alt="Chickme"
              draggable={false}
              style={{
                width: 'clamp(260px, 58vw, 740px)',
                height: 'auto',
                filter: 'drop-shadow(0 8px 36px rgba(0,0,0,0.35))',
                userSelect: 'none', pointerEvents: 'none', display: 'block',
              }}
            />
          </div>

          {/* Tagline */}
          <div
            ref={taglineRef}
            style={{ opacity: 0, transform: 'translateY(24px)', marginTop: 18 }}
          >
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.1rem, 4vw, 1.5rem)',
              fontWeight: 900, color: YELLOW,
              textTransform: 'uppercase',
              letterSpacing: '0.28em',
              textShadow: '0 2px 12px rgba(0,0,0,0.15)',
              margin: 0,
            }}>
              Fried with Fun!
            </p>
          </div>

          {/* CTAs */}
          <div
            ref={ctaRef}
            style={{
              opacity: 0, transform: 'translateY(18px)',
              marginTop: 36,
              display: 'flex', alignItems: 'center',
              gap: 16, justifyContent: 'center', flexWrap: 'wrap',
              padding: '0 24px',
              pointerEvents: 'auto',
            }}
          >
            <a
              href="#menu"
              onClick={(e) => { e.preventDefault(); document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' }) }}
              style={{
                padding: '16px 40px', borderRadius: 9999,
                background: YELLOW, color: '#141414',
                fontFamily: 'var(--font-secondary)',
                fontWeight: 700, fontSize: '0.9rem',
                textTransform: 'uppercase', letterSpacing: '0.1em',
                textDecoration: 'none', cursor: 'pointer',
                boxShadow: '0 5px 0 rgba(0,0,0,0.3), 0 12px 40px rgba(255,230,0,0.2)',
                transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out',
                lineHeight: 1,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.03)'
                e.currentTarget.style.boxShadow = '0 9px 0 rgba(0,0,0,0.2), 0 18px 50px rgba(255,230,0,0.25)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = '0 5px 0 rgba(0,0,0,0.3), 0 12px 40px rgba(255,230,0,0.2)'
              }}
            >
              View Menu
            </a>
            <a
              href="#location"
              onClick={(e) => { e.preventDefault(); document.getElementById('location')?.scrollIntoView({ behavior: 'smooth' }) }}
              style={{
                padding: '16px 40px', borderRadius: 9999,
                background: 'transparent',
                border: `2.5px solid ${WHITE}`, color: WHITE,
                fontFamily: 'var(--font-secondary)',
                fontWeight: 700, fontSize: '0.9rem',
                textTransform: 'uppercase', letterSpacing: '0.1em',
                textDecoration: 'none', cursor: 'pointer',
                transition: 'transform 0.2s ease-out, background 0.2s',
                lineHeight: 1,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.03)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              Find a Store
            </a>
          </div>
        </div>

        {/* ── Floating sparkles ── */}
        <div
          ref={sparklesRef}
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, zIndex: 5, opacity: 0, pointerEvents: 'none' }}
        >
          {SPARKLES.map((s, i) => (
            <svg
              key={i}
              viewBox="0 0 24 24"
              width={s.size} height={s.size}
              style={{
                position: 'absolute',
                top: s.top, left: s.left, right: s.right,
                opacity: 0.09,
                transform: `rotate(${s.rotate}deg)`,
                animation: `float ${6 + i * 0.8}s ease-in-out ${s.delay}s infinite`,
                willChange: 'transform',
              }}
            >
              <path d={STAR} fill={YELLOW} />
            </svg>
          ))}
        </div>

        {/* ── Scroll hint (desktop only) ── */}
        {!mobile && (
          <div
            ref={scrollHintRef}
            style={{
              position: 'absolute', bottom: 28, left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 8,
              zIndex: 6, pointerEvents: 'none',
              transition: 'opacity 0.4s ease',
            }}
          >
            <div style={{
              width: 24, height: 40, borderRadius: 9999,
              border: '2px solid rgba(255,255,255,0.4)',
              display: 'flex', alignItems: 'flex-start',
              justifyContent: 'center', paddingTop: 6,
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: YELLOW,
                animation: 'scrollDot 1.5s ease infinite',
              }} />
            </div>
            <span style={{
              fontFamily: 'var(--font-secondary)',
              fontSize: '0.62rem', color: 'rgba(255,255,255,0.45)',
              letterSpacing: '0.16em', textTransform: 'uppercase',
            }}>
              Scroll
            </span>
          </div>
        )}

        {/* ── Bottom bleed ── */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '18%', zIndex: 7, pointerEvents: 'none',
          background: `linear-gradient(to bottom, transparent 0%, ${RED} 100%)`,
        }} />
      </div>
    </div>
  )
}
