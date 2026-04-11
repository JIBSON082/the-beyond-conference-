import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ============================================================
// CONFIGURATION
// ============================================================

const AMOUNT_RAISED = 0
const TOTAL_BUDGET  = 2_400_000

const APPS_SCRIPT_URL: string = 'https://script.google.com/macros/s/AKfycbxANrvRvskBbez52jGEVICJ-odav6bl_ynxq6dwGQFOUMyxAhsAfNNND1Qim9xtmKSq/exec'
const LOGO_URL      = 'https://image2url.com/r2/default/images/1775682194312-829bb538-a247-4460-a0a7-1705570be79c.jpg'
const HERO_IMG      = 'https://image2url.com/r2/default/images/1775647110507-bd853ef1-65d6-4a71-993f-a430334b9479.jpg'
const INSTAGRAM_URL = 'https://www.instagram.com/the_beyond_community?igsh=eDVtdGpvM3B3bTF5'

const ACCOUNT = {
  number: '7350104678',
  bank:   'Wema Bank',
  name:   'Bukola D. Adewuyi',
}

// ============================================================
// VOLUNTEER DATA
// ============================================================

const WHATSAPP: Record<string, string> = {
  'Registration Unit': 'https://chat.whatsapp.com/ES9oi3YJiPQAzbBSb35hlJ?mode=gi_t',
  'Media Unit':        'https://chat.whatsapp.com/EIyrKru5PRH7sQ4gQOPHE4?mode=gi_t',
  'Ushering Unit':     'https://chat.whatsapp.com/BRbGiZQSLZ8GeBsppdXZPN?mode=gi_t',
  'Protocol Unit':     'https://chat.whatsapp.com/FpBpsBCzaGM8VruurR3aLR?mode=gi_t',
  'Sponsorship Unit':  'https://chat.whatsapp.com/JNygLrMq5ijKhlM6tJdqr6?mode=gi_t',
  'Logistics Unit':    'https://chat.whatsapp.com/K1FDddLx5UqIGR84uMIXw9?mode=gi_t',
  'Welfare Unit':      'https://chat.whatsapp.com/GpvOt5Vxo6sEoHf8kuffXI?mode=gi_t',

}

const UNITS = [
  { name: 'Registration Unit', desc: 'Coordinate seamless check-in and attendee management on the day.' },
  { name: 'Media Unit',        desc: 'Document, live-stream, and tell the story of this gathering.' },
  { name: 'Ushering Unit',     desc: 'Welcome every attendee and guide them through the experience.' },
  { name: 'Protocol Unit',     desc: 'Manage VIP liaison, speaker coordination, and stage ceremonies.' },
  { name: 'Sponsorship Unit',  desc: 'Bridge the gap between the conference vision and its partners.' },
  { name: 'Logistics Unit',    desc: 'Oversee equipment, venue setup, and operational excellence.' },
  { name: 'Welfare Unit',      desc: 'Champion the comfort and wellbeing of every person present.' },
]

const NAV_SECTIONS = [
  { label: 'Home',                   href: '#home'         },
  { label: 'Our Vision',             href: '#vision'       },
  { label: 'Registration',           href: '#registration' },
  { label: 'Partnerships & Support', href: '#partnerships' },
  { label: 'Call for Volunteers',    href: '#volunteers'   },
]

// ============================================================
// HELPERS
// ============================================================

const formatNaira = (n: number) => '₦' + n.toLocaleString('en-NG')

const incrementCount = (unit: string): {
  newCount: number
  allStats: Record<string, number>
  total: number
} => {
  try {
    const all: Record<string, number> = JSON.parse(localStorage.getItem('beyond_counts') || '{}')
    all[unit] = (all[unit] || 0) + 1
    localStorage.setItem('beyond_counts', JSON.stringify(all))
    const total = UNITS.reduce((s, u) => s + (all[u.name] || 0), 0)
    return { newCount: all[unit], allStats: all, total }
  } catch {
    return { newCount: 1, allStats: {}, total: 1 }
  }
}

// ============================================================
// INSTAGRAM ICON
// ============================================================

function IgIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="16" rx="5.5" ry="5.5"
        stroke="currentColor" strokeWidth="2" fill="none"/>
      <circle cx="12" cy="12" r="3.8"
        stroke="currentColor" strokeWidth="2" fill="none"/>
      <circle cx="12" cy="12" r="1.6"
        stroke="currentColor" strokeWidth="0.8" opacity="0.5" fill="none"/>
      <circle cx="17" cy="7" r="1.3" fill="currentColor"/>
    </svg>
  )
}

// ============================================================
// ANIMATED GLOBE O
// ============================================================

function GlobeO() {
  const wrapRef = useRef<HTMLSpanElement>(null)
  const imgRef  = useRef<HTMLImageElement>(null)
  const glowRef = useRef<HTMLSpanElement>(null)
  const ringRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Smooth continuous globe rotation
      gsap.to(imgRef.current, {
        rotation: 360,
        duration: 10,
        ease: 'none',
        repeat: -1,
        transformOrigin: 'center center',
      })
      // Outer glow ring breathes
      gsap.to(glowRef.current, {
        scale: 1.22,
        opacity: 0.9,
        duration: 2.4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        transformOrigin: 'center center',
      })
      // Orbit ring rotates opposite direction
      gsap.to(ringRef.current, {
        rotation: -360,
        duration: 7,
        ease: 'none',
        repeat: -1,
        transformOrigin: 'center center',
      })
      // Subtle perpetual float
      gsap.to(wrapRef.current, {
        y: -5,
        duration: 3.2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })
    }, wrapRef)
    return () => ctx.revert()
  }, [])

  return (
    <span ref={wrapRef} className="globe-o-wrap" aria-hidden="true">
      <span ref={glowRef} className="globe-o-glow" />
      <span ref={ringRef} className="globe-o-ring" />
      <img
        ref={imgRef}
        src="https://image2url.com/r2/default/images/1775735181650-a7f96510-90e2-44e4-b3b7-b413e64c75aa.jpg"
        alt=""
        className="globe-o-img"
        draggable={false}
      />
    </span>
  )
}

// ============================================================
// LOADER
// ============================================================

function Loader({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    setTimeout(() => {
      gsap.to(ref.current, { opacity: 0, duration: 0.7, onComplete: onDone })
    }, 1000)
  }, [onDone])
  return (
    <div ref={ref} className="loader-screen">
      <div className="loader-logo"><img src={LOGO_URL} alt="Beyond Conference" /></div>
      <div className="loader-line" />
    </div>
  )
}

// ============================================================
// NAVBAR
// ============================================================

function Navbar() {
  const [open, setOpen]         = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const overlayRef              = useRef<HTMLDivElement>(null)
  const linksRef                = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (open) {
      gsap.to(overlayRef.current, { duration: 0.7, clipPath: 'circle(170% at 95% 5%)', ease: 'power3.inOut' })
      gsap.fromTo(
        linksRef.current ? Array.from(linksRef.current.children) : [],
        { y: 70, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.09, delay: 0.35, duration: 0.8, ease: 'power3.out' }
      )
    } else {
      gsap.to(overlayRef.current, { duration: 0.55, clipPath: 'circle(0% at 95% 5%)', ease: 'power3.inOut' })
    }
  }, [open])

  const navigate = useCallback((href: string) => {
    setOpen(false)
    setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }), 650)
  }, [])

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-left">
          <button className="nav-logo" onClick={() => navigate('#home')} aria-label="Home">
            <img src={LOGO_URL} alt="The Beyond Conference" />
          </button>
          <a
            href={INSTAGRAM_URL}
            className="nav-ig"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow us on Instagram"
          >
            <IgIcon size={16} />
          </a>
        </div>
        <button
          className={`hamburger ${open ? 'active' : ''}`}
          onClick={() => setOpen(v => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <span /><span /><span />
        </button>
      </nav>

      <div ref={overlayRef} className="nav-overlay" style={{ clipPath: 'circle(0% at 95% 5%)' }}>
        <div ref={linksRef} className="nav-links">
          {NAV_SECTIONS.map(s => (
            <button key={s.href} className="nav-link-item" onClick={() => navigate(s.href)}>
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

// ============================================================
// HERO
// ============================================================

function HeroSection() {
  const heroRef      = useRef<HTMLElement>(null)
  const bgRef        = useRef<HTMLDivElement>(null)
  const eyebrowRef   = useRef<HTMLDivElement>(null)
  const word1Ref     = useRef<HTMLDivElement>(null)
  const word2Ref     = useRef<HTMLDivElement>(null)
  const word3Ref     = useRef<HTMLDivElement>(null)
  const yearRef      = useRef<HTMLSpanElement>(null)
  const detailsRef   = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)
  const ambientRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Floating ambient particles ──────────────────
      const pEl = particlesRef.current
      if (pEl) {
        for (let i = 0; i < 24; i++) {
          const dot = document.createElement('span')
          const size = 1.5 + Math.random() * 3.5
          dot.style.cssText = `
            position:absolute;
            width:${size}px; height:${size}px;
            border-radius:50%;
            background:rgba(212,168,42,${0.15 + Math.random() * 0.45});
            left:${Math.random() * 100}%;
            top:${10 + Math.random() * 85}%;
            pointer-events:none;
            will-change:transform,opacity;
          `
          pEl.appendChild(dot)
          gsap.fromTo(dot,
            { opacity: 0, y: 0 },
            {
              opacity: 0.8,
              y: -(60 + Math.random() * 140),
              x: (Math.random() - 0.5) * 50,
              duration: 5 + Math.random() * 7,
              delay: Math.random() * 6,
              repeat: -1,
              ease: 'none',
              onRepeat() { gsap.set(dot, { opacity: 0, y: 0 }) },
            }
          )
        }
      }

      // ── Master timeline ─────────────────────────────
      const tl = gsap.timeline({ delay: 0.35 })

      // BG: cinematic slow scale in
      tl.fromTo(bgRef.current,
        { scale: 1.1, opacity: 0 },
        { scale: 1, opacity: 1, duration: 2.4, ease: 'power2.out' }
      )

      // Ambient glow: blooms behind title
      .fromTo(ambientRef.current,
        { scale: 0.4, opacity: 0 },
        { scale: 1, opacity: 1, duration: 2, ease: 'power2.out' },
        '-=2.2'
      )

      // Eyebrow: hard clip-path wipe left → right
      .fromTo(eyebrowRef.current,
        { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
        { clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'power3.out' },
        '-=1.8'
      )

      // "THE" — slides up masked
      .fromTo(word1Ref.current,
        { y: '105%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 1.0, ease: 'power4.out' },
        '-=0.65'
      )

      // "BEYOND" (with globe O) — slides up with slight scale
      .fromTo(word2Ref.current,
        { y: '105%', opacity: 0, scale: 0.96 },
        { y: '0%', opacity: 1, scale: 1, duration: 1.1, ease: 'power4.out' },
        '-=0.75'
      )

      // "CONFERENCE" — slides up last
      .fromTo(word3Ref.current,
        { y: '105%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 1.0, ease: 'power4.out' },
        '-=0.8'
      )

      // Year — fades in from left
      .fromTo(yearRef.current,
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
        '-=0.5'
      )

      // Detail items — each slides up staggered
      .fromTo(
        detailsRef.current ? Array.from(detailsRef.current.children) : [],
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out' },
        '-=0.4'
      )

      // ── Scroll parallax — multi-layer depth ─────────
      // Background moves slowest
      gsap.to(bgRef.current, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      })

      // Ambient glow moves medium speed
      gsap.to(ambientRef.current, {
        yPercent: 35,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 2,
        },
      })

      // Title drifts up slightly on scroll
      gsap.to([word1Ref.current, word2Ref.current, word3Ref.current], {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 2.5,
        },
      })

      // ── Subtle mouse parallax on title ───────────────
      const onMouseMove = (e: MouseEvent) => {
        const xPct = (e.clientX / window.innerWidth  - 0.5) * 18
        const yPct = (e.clientY / window.innerHeight - 0.5) * 10
        gsap.to([word1Ref.current, word2Ref.current, word3Ref.current], {
          x: xPct, y: yPct,
          duration: 1.8,
          ease: 'power2.out',
          overwrite: 'auto',
        })
        gsap.to(ambientRef.current, {
          x: xPct * 2, y: yPct * 2,
          duration: 2.2,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      }
      window.addEventListener('mousemove', onMouseMove, { passive: true })
      return () => window.removeEventListener('mousemove', onMouseMove)

    }, heroRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="home" ref={heroRef} className="hero-section">
      <div ref={bgRef} className="hero-image-bg" style={{}} aria-hidden="true" />

      {/* Floating particles layer */}
      <div ref={particlesRef} className="hero-particles" aria-hidden="true" />

      {/* Ambient radial glow bloom behind title */}
      <div ref={ambientRef} className="hero-ambient-glow" aria-hidden="true" />

      <div className="hero-overlay" aria-hidden="true" />

      <div className="hero-content">
        <div ref={eyebrowRef} className="hero-eyebrow" style={{ clipPath: 'inset(0 100% 0 0)' }}>
          Theme: MORE
        </div>

        <h1 className="hero-title">
  <div ref={word1Ref} style={{ overflow:'visible' }}>
    <span style={{ display:'block' }}>THE</span>
  </div>
  <div ref={word2Ref} style={{ overflow:'visible' }}>
    <span style={{ display:'block' }}>BEY<GlobeO />ND</span>
  </div>
  <div ref={word3Ref} style={{ overflow:'visible' }}>
    <span style={{ display:'block' }}>CONFERENCE</span>
  </div>
  <span ref={yearRef} className="hero-year">2026</span>
</h1>

        <div ref={detailsRef} className="hero-details">
          <div className="hero-detail-item">
            <span className="detail-label">Date</span>
            <span className="detail-value">30th May, 2026</span>
          </div>
          <div className="hero-detail-divider" aria-hidden="true" />
          <div className="hero-detail-item">
            <span className="detail-label">Venue</span>
            <span className="detail-value">College of Medicine, LUTH, Lagos</span>
          </div>
          <div className="hero-detail-divider" aria-hidden="true" />
          <div className="hero-detail-item">
            <span className="detail-label">Convener</span>
            <span className="detail-value">Bookola</span>
          </div>
          <div className="hero-detail-divider" aria-hidden="true" />
          <div className="hero-detail-item">
            <span className="detail-label">Special Feature</span>
            <span className="detail-value">Official Launch of <em>Beyond the Books</em></span>
          </div>
        </div>
      </div>

      <div className="hero-scroll-cue" aria-hidden="true">
        <span>Scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  )
}

// ============================================================
// VISION
// ============================================================

const PILLARS = [
  'There is MORE to who you are.',
  'There is MORE to what you can achieve.',
  'There is MORE to what God can do through you.',
  'There is MORE waiting to be discovered within you.',
]

function VisionSection() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const st = (t: string) => ({ scrollTrigger: { trigger: t, start: 'top 82%' } })
      gsap.fromTo('.v-label',       { y:40,opacity:0 }, { y:0,opacity:1,duration:1, ...st('.v-label') })
      gsap.fromTo('.v-head',        { y:60,opacity:0 }, { y:0,opacity:1,duration:1.2,ease:'power3.out', ...st('.v-head') })
      gsap.fromTo('.v-intro p',     { y:35,opacity:0 }, { y:0,opacity:1,stagger:0.2,duration:1, ...st('.v-intro') })
      gsap.fromTo('.vision-pillar', { y:60,opacity:0,scale:0.97 }, { y:0,opacity:1,scale:1,stagger:0.12,duration:1,ease:'power3.out', scrollTrigger:{ trigger:'.vision-pillars',start:'top 78%' } })
      gsap.fromTo('.v-closing',     { y:40,opacity:0 }, { y:0,opacity:1,duration:1, ...st('.v-closing') })
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <section id="vision" ref={ref} className="vision-section">
      <div className="section-container">
        <div className="section-label v-label">01 — Conference Vision</div>
        <h2 className="section-heading v-head">There Is <em>More</em><br />To You</h2>
        <div className="vision-intro v-intro">
          <p>The BEYOND Conference 2026 is a transformational gathering designed to awaken young people to the truth that there is more to them than society, past experiences, limitations, or self-doubt have defined.</p>
          <p>The heart of this conference is to communicate a powerful, life-altering truth to every person who walks through those doors.</p>
        </div>
        <div className="vision-pillars">
          {PILLARS.map((p, i) => (
            <div key={i} className="vision-pillar">
              <span className="pillar-number">0{i + 1}</span>
              <p>{p.split('MORE').map((part, j, arr) => (
                <span key={j}>{part}{j < arr.length - 1 && <strong>MORE</strong>}</span>
              ))}</p>
            </div>
          ))}
        </div>
        <p className="vision-closing v-closing">
          This conference will inspire young people to recognise the beauty, capacity, and limitless potential deposited on their inside — and to take intentional steps toward becoming all they were created to be.
        </p>
      </div>
    </section>
  )
}

// ============================================================
// REGISTRATION
// ============================================================

function RegistrationSection() {
  const ref = useRef<HTMLElement>(null)
  const [form, setForm] = useState({ name: '', phone: '', email: '', attending: '', mode: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  useEffect(() => {
    const ctx = gsap.context(() => {
      const st = (t: string) => ({ scrollTrigger: { trigger: t, start: 'top 82%' } })
      gsap.fromTo('.reg-label',   { y:40,opacity:0 }, { y:0,opacity:1,duration:1, ...st('.reg-label') })
      gsap.fromTo('.reg-head',    { y:60,opacity:0 }, { y:0,opacity:1,duration:1.2,ease:'power3.out', ...st('.reg-head') })
      gsap.fromTo('.reg-intro',   { y:35,opacity:0 }, { y:0,opacity:1,duration:1, ...st('.reg-intro') })
      gsap.fromTo('.reg-card',    { y:50,opacity:0 }, { y:0,opacity:1,duration:1.1,ease:'power3.out', ...st('.reg-card') })
    }, ref)
    return () => ctx.revert()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async () => {
    const { name, email, phone, faculty } = form
   if (!name.trim() || !email.trim() || !phone.trim() || !attending || !mode) {
  alert('Please fill in all required fields.')
  return
}
    setStatus('loading')
    try {
     const params = new URLSearchParams({
  type:      'registration',
  name:      form.name.trim(),
  phone:     form.phone.trim(),
  email:     form.email.trim(),
  attending: form.attending,
  mode:      form.mode,
})
      await fetch(`${APPS_SCRIPT_URL}?${params.toString()}`, { method: 'GET', mode: 'no-cors' })
      setStatus('success')
      setForm({ name: '', phone: '', email: '', attending: '', mode: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="registration" ref={ref} className="registration-section">
      <div className="section-container">
        <div className="section-label reg-label">02 — Secure Your Seat</div>
        <h2 className="section-heading reg-head">Register <em>Now</em></h2>
        <p className="reg-intro">
          The Beyond Conference 2026 is free to attend — but seats are limited.
          Fill the form below to confirm your place on <strong>30th May, 2026</strong> at the
          College of Medicine, LUTH, Lagos.
        </p>

        <div className="reg-card">
          {status === 'success' ? (
            <div className="reg-success">
              <div className="reg-success-icon">✓</div>
              <h3>You're Registered!</h3>
              <p>We've received your details. See you on 30th May 2026 — come ready for <em>MORE</em>.</p>
              <button className="reg-submit-btn" onClick={() => setStatus('idle')}>
                Register Another Person
              </button>
            </div>
          ) : (
            <div className="reg-form">
             <div className="reg-fields">
  <div className="reg-field">
    <label className="reg-field-label">Full Name <span>*</span></label>
    <input
      className="reg-input"
      type="text"
      name="name"
      placeholder="Your full name"
      value={form.name}
      onChange={handleChange}
    />
  </div>

  <div className="reg-field">
    <label className="reg-field-label">Phone Number <span>*</span></label>
    <input
      className="reg-input"
      type="tel"
      name="phone"
      placeholder="+234 800 000 0000"
      value={form.phone}
      onChange={handleChange}
    />
  </div>

  <div className="reg-field">
    <label className="reg-field-label">Email Address <span>*</span></label>
    <input
      className="reg-input"
      type="email"
      name="email"
      placeholder="your@email.com"
      value={form.email}
      onChange={handleChange}
    />
  </div>

  <div className="reg-field">
    <label className="reg-field-label">Will you be attending? <span>*</span></label>
    <select
      className="reg-input reg-select"
      name="attending"
      value={form.attending}
      onChange={handleChange}
    >
      <option value="" disabled>Select an option</option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>
    </select>
  </div>

  <div className="reg-field">
    <label className="reg-field-label">Virtual or Physical? <span>*</span></label>
    <select
      className="reg-input reg-select"
      name="mode"
      value={form.mode}
      onChange={handleChange}
    >
      <option value="" disabled>Select an option</option>
      <option value="Physical">Physical</option>
      <option value="Virtual">Virtual</option>
    </select>
  </div>
</div>

              {status === 'error' && (
                <p className="reg-error">Something went wrong. Please try again.</p>
              )}

              <button
                className={`reg-submit-btn ${status === 'loading' ? 'loading' : ''}`}
                onClick={handleSubmit}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Submitting…' : 'Confirm My Seat →'}
              </button>

             <p className="reg-note">* Registration is free. Your details are only used for event coordination.</p>
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}


// ============================================================
// PARTNERSHIPS
// ============================================================

function PartnershipsSection() {
  const ref     = useRef<HTMLElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const pct = Math.min((AMOUNT_RAISED / TOTAL_BUDGET) * 100, 100)

  const copy = (val: string, label: string) => {
    navigator.clipboard.writeText(val).then(() => {
      setCopied(label); setTimeout(() => setCopied(null), 2200)
    })
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      const st = (t: string) => ({ scrollTrigger: { trigger: t, start: 'top 82%' } })
      gsap.fromTo('.p-label',      { y:40,opacity:0 }, { y:0,opacity:1,duration:1, ...st('.p-label') })
      gsap.fromTo('.p-head',       { y:60,opacity:0 }, { y:0,opacity:1,duration:1.2,ease:'power3.out', ...st('.p-head') })
      gsap.fromTo('.support-item', { x:-40,opacity:0 }, { x:0,opacity:1,stagger:0.08,duration:0.8,ease:'power3.out', scrollTrigger:{ trigger:'.support-list',start:'top 80%' } })
      gsap.fromTo(fillRef.current, { width:'0%' }, { width:`${pct}%`, duration:2.4, ease:'power2.out', scrollTrigger:{ trigger:'.progress-track',start:'top 80%' } })
      gsap.fromTo('.account-card', { y:30,opacity:0 }, { y:0,opacity:1,duration:0.9,ease:'power3.out', ...st('.account-card') })
    }, ref)
    return () => ctx.revert()
  }, [pct])

  return (
    <section id="partnerships" ref={ref} className="partnerships-section">
      <div className="section-container">
        <div className="section-label p-label">02 — Call for Support</div>
        <h2 className="section-heading p-head">Partnerships<br />&amp; <em>Support</em></h2>
        <div className="partnerships-grid">
          <div>
            <p className="column-heading">Support Needed</p>
            <ul className="support-list">
              {['Financial Sponsorship','Souvenir Production Support','Media Coverage','Refreshments Sponsorship','Equipment Sponsorship'].map(item => (
                <li key={item} className="support-item">{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="column-heading">Financial Goal</p>
            <div style={{ marginBottom: '32px' }}>
              <div className="progress-amounts">
                <span className="amount-raised">{formatNaira(AMOUNT_RAISED)}</span>
                <span className="amount-total">of {formatNaira(TOTAL_BUDGET)}</span>
              </div>
              <div className="progress-track">
                <div ref={fillRef} className="progress-fill" style={{ width: '0%' }} />
              </div>
              <p className="progress-percentage">{pct.toFixed(1)}% of total goal reached</p>
            </div>
            <div className="account-card">
              <p className="account-label">Donate Directly</p>
              {[
                { label: 'Account Number', val: ACCOUNT.number },
                { label: 'Bank',           val: ACCOUNT.bank   },
                { label: 'Account Name',   val: ACCOUNT.name   },
              ].map(({ label, val }) => (
                <div
                  key={label} className="account-row"
                  onClick={() => copy(val, label)}
                  role="button" tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && copy(val, label)}
                >
                  <span className="account-field-label">{label}</span>
                  <span className="account-value">{val}</span>
                  <span className="copy-btn">{copied === label ? 'Copied' : 'Copy'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// VOLUNTEER MODAL
// ============================================================

interface FormState {
  name: string; phone: string; email: string
  attending: '' | 'Yes' | 'No'
  mode: '' | 'Virtual' | 'Physical'
}

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error'

function VolunteerModal({ unit, onClose }: { unit: string; onClose: () => void }) {
  const ref                     = useRef<HTMLDivElement>(null)
  const [form, setForm]         = useState<FormState>({ name:'', phone:'', email:'', attending:'', mode:'' })
  const [status, setStatus]     = useState<SubmitStatus>('idle')
  const [errMsg, setErrMsg]     = useState('')

  useEffect(() => {
    gsap.fromTo(ref.current, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' })
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const close = useCallback(() => {
    gsap.to(ref.current, { y: 80, opacity: 0, duration: 0.4, ease: 'power3.in', onComplete: onClose })
  }, [onClose])

  const setField = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm(f => ({ ...f, [k]: v }))

  const submit = async () => {
    if (!form.name || !form.phone || !form.email || !form.attending || !form.mode) {
      setErrMsg('Please complete all fields before confirming.')
      return
    }
    setErrMsg('')
    setStatus('sending')

    const { allStats, total } = incrementCount(unit)
    const now = new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos', dateStyle: 'long', timeStyle: 'short' })

    const params = new URLSearchParams({
      name:              form.name.trim(),
      phone:             form.phone.trim(),
      email:             form.email.trim(),
      unit,
      attending:         form.attending,
      mode:              form.mode,
      timestamp:         now,
      totalAll:          String(total),
      countRegistration: String(allStats['Registration Unit'] || 0),
      countMedia:        String(allStats['Media Unit']        || 0),
      countUshering:     String(allStats['Ushering Unit']     || 0),
      countProtocol:     String(allStats['Protocol Unit']     || 0),
      countSponsorship:  String(allStats['Sponsorship Unit']  || 0),
      countLogistics:    String(allStats['Logistics Unit']    || 0),
      countWelfare:      String(allStats['Welfare Unit']      || 0),
    })

    // Fire email in background — don't await it
    fetch(`${APPS_SCRIPT_URL}?${params.toString()}`, {
      method: 'GET',
      mode:   'no-cors',
    })

    // Navigate directly to WhatsApp — no delay, no popup
    window.location.href = WHATSAPP[unit]
  }

  return (
    <div className="modal-backdrop" onClick={close}>
      <div ref={ref} className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={close}>Close</button>
        <div className="modal-header">
          <p className="modal-unit-label">Joining</p>
          <h3 className="modal-title">{unit}</h3>
        </div>
        {status === 'success' ? (
          <div className="modal-success">
            <div className="success-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <p>Welcome to the {unit}.</p>
            <p className="redirect-note">Taking you to the group chat now...</p>
          </div>
        ) : (
          <div className="modal-form">
            <div className="form-field">
              <label htmlFor="vol-name">Full Name</label>
              <input id="vol-name" type="text" placeholder="Enter your full name" value={form.name} onChange={e => setField('name', e.target.value)} autoComplete="name"/>
            </div>
            <div className="form-field">
              <label htmlFor="vol-phone">Phone Number</label>
              <input id="vol-phone" type="tel" placeholder="e.g. 08012345678" value={form.phone} onChange={e => setField('phone', e.target.value)} autoComplete="tel"/>
            </div>
            <div className="form-field">
              <label htmlFor="vol-email">Email Address</label>
              <input id="vol-email" type="email" placeholder="your@email.com" value={form.email} onChange={e => setField('email', e.target.value)} autoComplete="email"/>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Will you be attending?</label>
                <div className="radio-group">
                  {(['Yes','No'] as const).map(opt => (
                    <label key={opt} className={`radio-option ${form.attending === opt ? 'selected' : ''}`}>
                      <input type="radio" name="attending" value={opt} checked={form.attending === opt} onChange={() => setField('attending', opt)}/>
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-field">
                <label>Participation Mode</label>
                <div className="radio-group">
                  {(['Virtual','Physical'] as const).map(opt => (
                    <label key={opt} className={`radio-option ${form.mode === opt ? 'selected' : ''}`}>
                      <input type="radio" name="mode" value={opt} checked={form.mode === opt} onChange={() => setField('mode', opt)}/>
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            {errMsg && <p className="error-msg">{errMsg}</p>}
            <button className="confirm-btn" onClick={submit} disabled={status === 'sending'}>
              {status === 'sending' ? 'Submitting...' : 'Confirm Registration'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================
// VOLUNTEERS
// ============================================================

function VolunteersSection() {
  const ref                     = useRef<HTMLElement>(null)
  const [active, setActive]     = useState<string | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const st = (t: string) => ({ scrollTrigger: { trigger: t, start: 'top 85%' } })
      gsap.fromTo('.vol-label', { y:40,opacity:0 }, { y:0,opacity:1,duration:1, ...st('.vol-label') })
      gsap.fromTo('.vol-head',  { y:60,opacity:0 }, { y:0,opacity:1,duration:1.2,ease:'power3.out', ...st('.vol-head') })
      gsap.fromTo('.vol-intro', { y:30,opacity:0 }, { y:0,opacity:1,duration:0.9, ...st('.vol-intro') })
      gsap.fromTo('.unit-card', { y:65,opacity:0 }, { y:0,opacity:1,stagger:0.1,duration:1,ease:'power3.out', scrollTrigger:{ trigger:'.units-grid',start:'top 78%' } })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="volunteers" ref={ref} className="volunteers-section">
      <div className="section-container">
        <div className="section-label vol-label">03 — Join the Team</div>
        <h2 className="section-heading vol-head">Call for<br /><em>Volunteers</em></h2>
        <p className="volunteers-intro vol-intro">The Beyond Conference 2026 is powered by a team of committed, passionate individuals. Choose a unit that resonates with you, complete the form, and become part of something greater than yourself.</p>
        <div className="units-grid">
          {UNITS.map((unit, i) => (
            <article key={unit.name} className="unit-card">
              <div className="unit-number" aria-hidden="true">0{i + 1}</div>
              <h3 className="unit-name">{unit.name}</h3>
              <p className="unit-desc">{unit.desc}</p>
              <button
  className="join-btn"
  onClick={() => window.open(WHATSAPP[unit.name], '_blank', 'noopener,noreferrer')}
>
  Join Unit →
</button>
            </article>
          ))}
        </div>
      </div>
      {active && <VolunteerModal unit={active} onClose={() => setActive(null)} />}
    </section>
  )
}

// ============================================================
// FOOTER
// ============================================================

function Footer() {
  const scrollTo = (href: string) =>
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <img src={LOGO_URL} alt="The Beyond Conference" className="footer-logo" />
          <p>The Beyond Conference 2026</p>
          <p className="footer-tagline">There Is MORE.</p>
          <a href={INSTAGRAM_URL} className="footer-ig" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <IgIcon size={16} />
          </a>
        </div>
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            {NAV_SECTIONS.map(s => (
              <li key={s.href}>
                <a href={s.href} onClick={e => { e.preventDefault(); scrollTo(s.href) }}>{s.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-event">
          <h4>Event Details</h4>
          <p>30th May, 2026</p>
          <p>College of Medicine</p>
          <p>Lagos University Teaching Hospital</p>
          <p>Idi-Araba, Lagos</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} The Beyond Conference. All rights reserved.</p>
        <p>Convened by Bookola</p>
      </div>
    </footer>
  )
}

// ============================================================
// ROOT APP
// ============================================================

export default function App() {
  const [loaded, setLoaded] = useState(false)
  return (
    <>
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
      <div style={{ visibility: loaded ? 'visible' : 'hidden' }}>
        <Navbar />
        <main>
          <HeroSection />
          <div className="gold-line" />
          <VisionSection />
<div className="gold-line" />
<RegistrationSection />
<div className="gold-line" />
<PartnershipsSection />
          <div className="gold-line" />
          <VolunteersSection />
        </main>
        <Footer />
      </div>
    </>
  )
}
