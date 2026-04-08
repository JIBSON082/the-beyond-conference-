/**
 * THE BEYOND CONFERENCE 2026 — App.tsx
 *
 * ============================================================
 * GOOGLE APPS SCRIPT SETUP
 * ============================================================
 * 1. Go to https://script.google.com → New Project
 * 2. Paste the full contents of appscript.gs into the editor
 * 3. Fill in your SPREADSHEET_ID and RECIPIENT_EMAILS in the script
 * 4. Click Deploy → New Deployment → Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web App URL and paste it as APPS_SCRIPT_URL below
 *
 * UPDATE DONATION PROGRESS:
 * Change AMOUNT_RAISED below to reflect the current total raised.
 * ============================================================
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ============================================================
// CONFIGURATION
// ============================================================

const AMOUNT_RAISED = 0 // Update this value (in Naira) as donations arrive

const TOTAL_BUDGET = 2_400_000

const APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_WEB_APP_URL'

const LOGO_URL = 'https://image2url.com/r2/default/images/1775526751389-21009a87-43a1-4cae-9afa-4ac23128ac50.jpg'
const HERO_IMG = 'https://image2url.com/r2/default/images/1775559218217-257adcce-d9db-4691-9ec1-f9cd3eb1bb2d.jpg'
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

// ============================================================
// HELPERS
// ============================================================

const formatNaira = (n: number) => '₦' + n.toLocaleString('en-NG')

const incrementCount = (unit: string): { newCount: number; allStats: Record<string, number>; total: number } => {
  try {
    const all = JSON.parse(localStorage.getItem('beyond_counts') || '{}')
    all[unit] = (all[unit] || 0) + 1
    localStorage.setItem('beyond_counts', JSON.stringify(all))
    const total = UNITS.reduce((s, u) => s + (all[u.name] || 0), 0)
    return { newCount: all[unit], allStats: all, total }
  } catch {
    return { newCount: 1, allStats: {}, total: 1 }
  }
}

// ============================================================
// GOOGLE APPS SCRIPT SUBMIT
// ============================================================

async function sendToAppsScript(payload: Record<string, string | number>) {
  if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL === 'YOUR_APPS_SCRIPT_WEB_APP_URL') return
  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify(payload),
    })
  } catch (e) {
    console.warn('Apps Script submission failed — recorded locally only.', e)
  }
}

// ============================================================
// LOADER
// ============================================================

function Loader({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    setTimeout(() => {
      gsap.to(ref.current, {
        opacity: 0, duration: 0.7, delay: 0.5,
        onComplete: onDone,
      })
    }, 900)
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

const NAV_SECTIONS = [
  { label: 'Home',                   href: '#home'         },
  { label: 'Our Vision',             href: '#vision'       },
  { label: 'Partnerships & Support', href: '#partnerships' },
  { label: 'Call for Volunteers',    href: '#volunteers'   },
]

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
        <button className="nav-logo" onClick={() => navigate('#home')} aria-label="Back to top">
          <img src={LOGO_URL} alt="The Beyond Conference" />
        </button>
        <a
          href={INSTAGRAM_URL}
          className="nav-instagram"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          Instagram
        </a>
        <button
          className={`hamburger ${open ? 'active' : ''}`}
          onClick={() => setOpen(v => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
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
// GLOBE STAGE — orbital rings + particles
// ============================================================

function GlobeStage() {
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768
      const particleCount = isMobile ? 14 : 26

      // Create particles
      const container = stageRef.current?.querySelector('.globe-particles')
      if (container) {
        for (let i = 0; i < particleCount; i++) {
          const dot = document.createElement('div')
          dot.className = 'particle-dot'
          const angle  = (i / particleCount) * Math.PI * 2
          const radius = 38 + Math.random() * 46
          dot.style.left = `${50 + Math.cos(angle) * radius}%`
          dot.style.top  = `${50 + Math.sin(angle) * radius}%`
          dot.style.opacity = '0'
          container.appendChild(dot)

          gsap.to(dot, {
            opacity:  Math.random() * 0.85 + 0.15,
            scale:    Math.random() * 2.5 + 0.4,
            x:        (Math.random() - 0.5) * 28,
            y:        (Math.random() - 0.5) * 28,
            duration: 2.5 + Math.random() * 3,
            repeat:   -1,
            yoyo:     true,
            ease:     'sine.inOut',
            delay:    Math.random() * 2.5,
          })
        }
      }

      // Set ring initial tilt positions
      gsap.set('#ring1', { rotationX: 68 })
      gsap.set('#ring2', { rotationX: 40, rotationZ: 55 })
      gsap.set('#ring3', { rotationX: 20, rotationZ: -35 })
      gsap.set('#ring4', { rotationX: 82, rotationZ: 20 })

      // Continuous rotation — all GPU-only transforms
      gsap.to('#ring1', { rotation: 360,  duration: 14, repeat: -1, ease: 'none' })
      gsap.to('#ring2', { rotation: -360, duration: 21, repeat: -1, ease: 'none' })
      gsap.to('#ring3', { rotation: 360,  duration: 30, repeat: -1, ease: 'none' })
      gsap.to('#ring4', { rotation: -360, duration: 40, repeat: -1, ease: 'none' })

    }, stageRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={stageRef} className="globe-stage" id="globeStage" aria-hidden="true">
      <div className="globe-glow-outer" />
      <div className="globe-glow-inner" />
      <div className="ring ring-1" id="ring1" />
      <div className="ring ring-2" id="ring2" />
      <div className="ring ring-3" id="ring3" />
      <div className="ring ring-4" id="ring4" />
      <div className="globe-particles" />
    </div>
  )
}

// ============================================================
// HERO
// ============================================================

function HeroSection() {
  const heroRef    = useRef<HTMLElement>(null)
  const imgRef     = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const titleRef   = useRef<HTMLHeadingElement>(null)
  const detailsRef = useRef<HTMLDivElement>(null)
  const stageRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 })

      // Image cinematic entrance
      tl.fromTo(imgRef.current,
        { scale: 1.15, opacity: 0 },
        { scale: 1, opacity: 1, duration: 2.4, ease: 'power2.out' }
      )
      // Globe stage fades in
      .fromTo(stageRef.current,
        { opacity: 0, scale: 0.88 },
        { opacity: 1, scale: 1, duration: 1.8, ease: 'power3.out' },
        '-=2.0'
      )
      // Text reveals
      .fromTo(eyebrowRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
        '-=1.3'
      )
      .fromTo(titleRef.current,
        { y: 100, opacity: 0, skewY: 4 },
        { y: 0, opacity: 1, skewY: 0, duration: 1.4, ease: 'power3.out' },
        '-=0.8'
      )
      .fromTo(detailsRef.current ? Array.from(detailsRef.current.children) : [],
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.9, ease: 'power3.out' },
        '-=0.8'
      )

      // Parallax scroll on image
      gsap.to(imgRef.current, {
        yPercent: 22, ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1 },
      })

      // Globe stage gentle float
      gsap.to(stageRef.current, {
        y: -18, duration: 4, ease: 'sine.inOut', repeat: -1, yoyo: true,
      })

    }, heroRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="home" ref={heroRef} className="hero-section">
      <div ref={imgRef} className="hero-image-bg" style={{ backgroundImage: `url('${HERO_IMG}')` }} aria-hidden="true" />
      <div ref={stageRef}><GlobeStage /></div>
      <div className="hero-overlay" aria-hidden="true" />

      <div className="hero-content">
        <div ref={eyebrowRef} className="hero-eyebrow">Theme: MORE</div>
        <h1 ref={titleRef} className="hero-title">
          THE BEYOND<br />CONFERENCE
          <span className="hero-year">2026</span>
        </h1>
        <div ref={detailsRef} className="hero-details">
          <div className="hero-detail-item">
            <span className="detail-label">Date</span>
            <span className="detail-value">30th May, 2026</span>
          </div>
          <div className="hero-detail-divider" aria-hidden="true" />
          <div className="hero-detail-item">
            <span className="detail-label">Venue</span>
            <span className="detail-value">The New Great Hall, LUTH, Lagos</span>
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
      const st = (trigger: string) => ({ scrollTrigger: { trigger, start: 'top 82%' } })
      gsap.fromTo('.v-label',  { y:40,opacity:0 }, { y:0,opacity:1,duration:1, ...st('.v-label') })
      gsap.fromTo('.v-head',   { y:60,opacity:0 }, { y:0,opacity:1,duration:1.2,ease:'power3.out', ...st('.v-head') })
      gsap.fromTo('.v-intro p',{ y:35,opacity:0 }, { y:0,opacity:1,stagger:0.2,duration:1, ...st('.v-intro') })
      gsap.fromTo('.vision-pillar', { y:60,opacity:0,scale:0.97 }, { y:0,opacity:1,scale:1,stagger:0.12,duration:1,ease:'power3.out', scrollTrigger:{ trigger:'.vision-pillars',start:'top 78%' } })
      gsap.fromTo('.v-closing',{ y:40,opacity:0 }, { y:0,opacity:1,duration:1, ...st('.v-closing') })
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
// PARTNERSHIPS
// ============================================================

function PartnershipsSection() {
  const ref     = useRef<HTMLElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const pct = Math.min((AMOUNT_RAISED / TOTAL_BUDGET) * 100, 100)

  const copy = (val: string, label: string) => {
    navigator.clipboard.writeText(val).then(() => {
      setCopied(label)
      setTimeout(() => setCopied(null), 2200)
    })
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      const st = (t: string) => ({ scrollTrigger: { trigger: t, start: 'top 82%' } })
      gsap.fromTo('.p-label', { y:40,opacity:0 }, { y:0,opacity:1,duration:1, ...st('.p-label') })
      gsap.fromTo('.p-head',  { y:60,opacity:0 }, { y:0,opacity:1,duration:1.2,ease:'power3.out', ...st('.p-head') })
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
  const ref = useRef<HTMLDivElement>(null)
  const [form, setForm]     = useState<FormState>({ name:'', phone:'', email:'', attending:'', mode:'' })
  const [status, setStatus] = useState<SubmitStatus>('idle')

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
      alert('Please complete all fields before confirming.')
      return
    }
    setStatus('sending')

    const { newCount, allStats, total } = incrementCount(unit)
    const now = new Date().toLocaleString('en-NG', { timeZone:'Africa/Lagos', dateStyle:'long', timeStyle:'short' })

    await sendToAppsScript({
      name: form.name, phone: form.phone, email: form.email,
      unit, attending: form.attending, mode: form.mode,
      timestamp: now,
      // Per-unit counts for Apps Script email
      totalAll: total,
      countRegistration: allStats['Registration Unit'] || 0,
      countMedia:        allStats['Media Unit']        || 0,
      countUshering:     allStats['Ushering Unit']     || 0,
      countProtocol:     allStats['Protocol Unit']     || 0,
      countSponsorship:  allStats['Sponsorship Unit']  || 0,
      countLogistics:    allStats['Logistics Unit']    || 0,
      countWelfare:      allStats['Welfare Unit']      || 0,
    })

    setStatus('success')
    setTimeout(() => {
      window.open(WHATSAPP[unit], '_blank', 'noopener,noreferrer')
      close()
    }, 2600)
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
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p>Welcome to the {unit}.</p>
            <p className="redirect-note">Taking you to the group chat now...</p>
          </div>
        ) : (
          <div className="modal-form">
            <div className="form-field">
              <label htmlFor="vol-name">Full Name</label>
              <input id="vol-name" type="text" placeholder="Enter your full name" value={form.name} onChange={e => setField('name', e.target.value)} autoComplete="name" />
            </div>
            <div className="form-field">
              <label htmlFor="vol-phone">Phone Number</label>
              <input id="vol-phone" type="tel" placeholder="e.g. 08012345678" value={form.phone} onChange={e => setField('phone', e.target.value)} autoComplete="tel" />
            </div>
            <div className="form-field">
              <label htmlFor="vol-email">Email Address</label>
              <input id="vol-email" type="email" placeholder="your@email.com" value={form.email} onChange={e => setField('email', e.target.value)} autoComplete="email" />
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Will you be attending?</label>
                <div className="radio-group">
                  {(['Yes','No'] as const).map(opt => (
                    <label key={opt} className={`radio-option ${form.attending === opt ? 'selected' : ''}`}>
                      <input type="radio" name="attending" value={opt} checked={form.attending === opt} onChange={() => setField('attending', opt)} />
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
                      <input type="radio" name="mode" value={opt} checked={form.mode === opt} onChange={() => setField('mode', opt)} />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            {status === 'error' && <p className="error-msg">Something went wrong. Please try again.</p>}
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
  const ref           = useRef<HTMLElement>(null)
  const [active, setActive] = useState<string | null>(null)

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
              <button className="join-btn" onClick={() => setActive(unit.name)}>Join Unit</button>
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
          <a href={INSTAGRAM_URL} className="footer-instagram" target="_blank" rel="noopener noreferrer">
            Instagram
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
          <p>The New Great Hall</p>
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
          <PartnershipsSection />
          <div className="gold-line" />
          <VolunteersSection />
        </main>
        <Footer />
      </div>
    </>
  )
}
