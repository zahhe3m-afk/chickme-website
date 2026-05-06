import { useState, useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useCustomCursor from './hooks/useCustomCursor'
import useScrollReveal from './hooks/useScrollReveal'
import Loader from './components/Loader'
import Navbar from './components/Navbar'
import ScrollVideo from './components/ScrollVideo'
import Marquee from './components/Marquee'
import About from './components/About'
import Menu from './components/Menu'
import WhyUs from './components/WhyUs'
import Gallery from './components/Gallery'
import CTA from './components/CTA'
import Location from './components/Location'
import Footer from './components/Footer'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [loading, setLoading] = useState(true)

  /* ── Custom cursor ── */
  useCustomCursor()

  /* ── Scroll reveal (IntersectionObserver on .rv / .rl / .rr / .rs) ── */
  useScrollReveal()

  /* ── Lenis smooth scroll, tied to GSAP ScrollTrigger ── */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const rafCb = (time) => { lenis.raf(time * 1000) }
    gsap.ticker.add(rafCb)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(rafCb)
    }
  }, [])

  return (
    <>
      {/* Loading screen — clip-path wipe exit */}
      {loading && <Loader onComplete={() => setLoading(false)} />}

      {/* Noise / grain overlay */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Custom cursor dot */}
      <div className="cursor" id="cursor" aria-hidden="true" />

      {/* Fixed navbar */}
      <Navbar />

      {/* ── SECTIONS ── */}

      {/* 1. Scroll-synced video hero */}
      <ScrollVideo />

      {/* 2. Marquee — scroll-velocity reactive */}
      <Marquee />

      {/* 3. About */}
      <About />

      {/* 4. Menu */}
      <Menu />

      {/* 5. Why Us */}
      <WhyUs />

      {/* 6. Gallery */}
      <Gallery />

      {/* 7. Grand Opening CTA */}
      <CTA />

      {/* 8. Location / Find Us */}
      <Location />

      {/* 9. Footer */}
      <Footer />
    </>
  )
}
