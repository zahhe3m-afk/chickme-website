import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';

export default function Loader({ onComplete }) {
  const overlayRef = useRef(null);
  const progressRef = useRef(null);
  const [progressDone, setProgressDone] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const hasExited = useRef(false);

  // Reduced motion check
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [onComplete]);

  // Progress bar completion
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressDone(true);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  // Listen for hero-video-ready event + max timeout
  useEffect(() => {
    const handleVideoReady = () => setVideoReady(true);
    window.addEventListener('hero-video-ready', handleVideoReady);

    const maxTimeout = setTimeout(() => {
      setVideoReady(true);
    }, 4000);

    return () => {
      window.removeEventListener('hero-video-ready', handleVideoReady);
      clearTimeout(maxTimeout);
    };
  }, []);

  // Exit animation when both conditions met
  const triggerExit = useCallback(() => {
    if (hasExited.current) return;
    hasExited.current = true;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    gsap.to(overlayRef.current, {
      clipPath: 'inset(0 0 100% 0)',
      duration: 0.7,
      ease: 'power3.inOut',
      onComplete: () => {
        if (onComplete) onComplete();
      },
    });
  }, [onComplete]);

  useEffect(() => {
    if (progressDone && videoReady) {
      triggerExit();
    }
  }, [progressDone, videoReady, triggerExit]);

  // --- Inline styles ---

  const overlayStyle = {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    background: '#ff002b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    clipPath: 'inset(0 0 0 0)',
  };

  const patternStyle = {
    position: 'absolute',
    inset: 0,
    opacity: 0.04,
    pointerEvents: 'none',
  };

  const contentStyle = {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.2rem',
  };

  const logoStyle = {
    width: 'clamp(200px, 35vw, 340px)',
    animation: 'pulseLogo 2s ease-in-out infinite',
  };

  const taglineStyle = {
    color: '#ffe600',
    fontFamily: 'var(--font-display)',
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
    margin: 0,
  };

  const progressTrackStyle = {
    width: 'clamp(200px, 35vw, 340px)',
    height: '3px',
    background: 'rgba(255,255,255,0.15)',
    borderRadius: '2px',
    overflow: 'hidden',
  };

  const progressBarStyle = {
    height: '100%',
    background: '#ffe600',
    borderRadius: '2px',
    width: '0%',
    animation: 'loaderProgress 1.8s ease-in-out forwards',
  };

  // Check reduced motion — render nothing meaningful if reduced
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    return null;
  }

  return (
    <div ref={overlayRef} style={overlayStyle}>
      {/* Star pattern overlay */}
      <svg style={patternStyle} width="100%" height="100%">
        <defs>
          <pattern id="loader-star-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path
              d="M12 0 L14.4 9.6 L24 12 L14.4 14.4 L12 24 L9.6 14.4 L0 12 L9.6 9.6Z"
              fill="white"
            />
            <circle cx="36" cy="36" r="3" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#loader-star-pattern)" />
      </svg>

      {/* Centered content */}
      <div style={contentStyle}>
        <img src="/images/logo-01.svg" alt="Chickme" style={logoStyle} />
        <p style={taglineStyle}>Fried with Fun!</p>
        <div style={progressTrackStyle}>
          <div ref={progressRef} style={progressBarStyle} />
        </div>
      </div>

      {/* Inline keyframes for progress bar */}
      <style>{`
        @keyframes loaderProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
