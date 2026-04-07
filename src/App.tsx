/**
 * THE BEYOND CONFERENCE 2026 — App.tsx
 *
 * ============================================================
 * SETUP INSTRUCTIONS
 * ============================================================
 *
 * 1. EMAILJS SETUP (for volunteer email notifications):
 *    a. Go to https://www.emailjs.com and create a free account
 *    b. Create a new Email Service (Gmail, Outlook, etc.)
 *    c. Create a new Email Template using these variables:
 *       Subject: New Volunteer — {{volunteer_name}} ({{unit}})
 *       Body Template:
 *         NEW VOLUNTEER REGISTRATION — Beyond Conference 2026
 *         Full Name:    {{volunteer_name}}
 *         Phone:        {{volunteer_phone}}
 *         Email:        {{volunteer_email}}
 *         Unit:         {{unit}}
 *         Attending:    {{attending}}
 *         Mode:         {{mode}}
 *         Registered:   {{timestamp}}
 *         ─────────────────────────────
 *         {{unit}} Total: {{unit_total}}
 *         All Units Stats: {{all_stats}}
 *    d. Replace SERVICE_ID, TEMPLATE_ID, and PUBLIC_KEY below
 *
 * 2. DONATION PROGRESS:
 *    Update AMOUNT_RAISED (in Naira) whenever a new donation arrives.
 *    e.g. 300000 = ₦300,000
 * ============================================================
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import emailjs from '@emailjs/browser'

gsap.registerPlugin(ScrollTrigger)

// ============================================================
// CONFIGURATION — EDIT THESE VALUES
// ============================================================

/** Update this value to reflect current total donations (in Naira) */
const AMOUNT_RAISED = 0

const TOTAL_BUDGET = 2_400_000

const ACCOUNT = {
  number: '7350104678',
  bank: 'Wema Bank',
  name: 'Bukola D. Adewuyi',
}

const EMAILJS_CONFIG = {
  SERVICE_ID:  'YOUR_SERVICE_ID',   // e.g. 'service_abc123'
  TEMPLATE_ID: 'YOUR_TEMPLATE_ID',  // e.g. 'template_xyz789'
  PUBLIC_KEY:  'YOUR_PUBLIC_KEY',   // e.g. 'aBcDeFgHiJkLmNop'
}

const LOGO_URL =
  'https://image2url.com/r2/default/images/1775526751389-21009a87-43a1-4cae-9afa-4ac23128ac50.jpg'

const HERO_IMG =
  'https://image2url.com/r2/default/images/1775559218217-257adcce-d9db-4691-9ec1-f9cd3eb1bb2d.jpg'

// ============================================================
// VOLUNTEER UNIT DATA
// ============================================================

const WHATSAPP: Record<string, string | null> = {
  'Registration Unit': null,
  'Media Unit':        null,
  'Ushering Unit':     'https://chat.whatsapp.com/BRbGiZQSLZ8GeBsppdXZPN?mode=gi_t',
  'Protocol Unit':     'https://chat.whatsapp.com/FpBpsBCzaGM8VruurR3aLR?mode=gi_t',
  'Sponsorship Unit':  'https://chat.whatsapp.com/JNygLrMq5ijKhlM6tJdqr6?mode=gi_t',
  'Logistics Unit':    null,
  'Welfare Unit':      null,
}

const UNITS = [
  {
    name: 'Registration Unit',
    desc: 'Coordinate seamless check-in and attendee management on the day.',
  },
  {
    name: 'Media Unit',
    desc: 'Document, live-stream, and tell the story of this gathering.',
  },
  {
    name: 'Ushering Unit',
    desc: 'Welcome every attendee and guide them through the experience.',
  },
  {
    name: 'Protocol Unit',
    desc: 'Manage VIP liaison, speaker coordination, and stage ceremonies.',
  },
  {
    name: 'Sponsorship Unit',
    desc: 'Bridge the gap between the conference vision and its partners.',
  },
  {
    name: 'Logistics Unit',
    desc: 'Oversee equipment, venue setup, and operational excellence.',
  },
  {
    name: 'Welfare Unit',
    desc: 'Champion the comfort and wellbeing of every person present.',
  },
]

// ============================================================
// HELPERS
// ============================================================

const formatNaira = (n: number) =>
  '₦' + n.toLocaleString('en-NG')

const getCount = (unit: string): number => {
  try {
    const all = JSON.parse(localStorage.getItem('beyond_counts') || '{}')
    return all[unit] || 0
  } catch { return 0 }
}

const incrementCount = (unit: string): { newCount: number; allStats: string } => {
  try {
    const all = JSON.parse(localStorage.getItem('beyond_counts') || '{}')
    all[unit] = (all[unit] || 0) + 1
    localStorage.setItem('beyond_counts', JSON.stringify(all))
    const allStats = UNITS.map(u => `${u.name}: ${all[u.name] || 0}`).join(' | ')
    return { newCount: all[unit], allStats }
  } catch {
    return { newCount: 1, allStats: 'unavailable' }
  }
}

// ============================================================
// LOADER
// ============================================================

function Loader({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(ref.current, {
          duration: 0.7,
          opacity: 0,
          ease: 'power2.inOut',
          onComplete: onDone,
        })
      },
    })
    tl.to({}, { duration: 1.4 })
  }, [onDone])

  return (
    <div ref={ref} className="loader-screen">
      <div className="loader-logo">
        <img src={LOGO_URL} alt="Beyond Conference" />
      </div>
      <div className="loader-line" />
    </div>
  )
}

// ============================================================
// NAVBAR
// ============================================================

const NAV_SECTIONS = [
  { label: 'Home',                    href: '#home' },
  { label: 'Our Vision',              href: '#vision' },
  { label: 'Partnerships & Support',  href: '#partnerships' },
  { label: 'Call for Volunteers',     href: '#volunteers' },
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
      gsap.to(overlayRef.current, {
        duration: 0.7,
        clipPath: 'circle(170% at 95% 5%)',
        ease: 'power3.inOut',
      })
      gsap.fromTo(
        linksRef.current ? Array.from(linksRef.current.children) : [],
        { y: 70, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.09, delay: 0.35, duration: 0.8, ease: 'power3.out' }
      )
    } else {
      gsap.to(overlayRef.current, {
        duration: 0.55,
        clipPath: 'circle(0% at 95% 5%)',
        ease: 'power3.inOut',
      })
    }
  }, [open])

  const navigate = useCallback((href: string) => {
    setOpen(false)
    setTimeout(() => {
      const el = document.querySelector(href)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 650)
  }, [])

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <button
          className="nav-logo"
          onClick={() => navigate('#home')}
          aria-label="Back to top"
          style={{ background: 'none', border: 'none', padding: 0 }}
        >
          <img src={LOGO_URL} alt="The Beyond Conference" />
        </button>

        <button
          className={`hamburger ${open ? 'active' : ''}`}
          onClick={() => setOpen(v => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <div
        ref={overlayRef}
        className="nav-overlay"
        style={{ clipPath: 'circle(0% at 95% 5%)' }}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        <div ref={linksRef} className="nav-links">
          {NAV_SECTIONS.map(s => (
            <button
              key={s.href}
              className="nav-link-item"
              onClick={() => navigate(s.href)}
            >
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
  const heroRef    = useRef<HTMLElement>(null)
  const imgRef     = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const titleRef   = useRef<HTMLHeadingElement>(null)
  const detailsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 })

      tl.fromTo(
        imgRef.current,
        { scale: 1.12, opacity: 0 },
        { scale: 1, opacity: 1, duration: 2.2, ease: 'power2.out' }
      )
      .fromTo(
        eyebrowRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
        '-=1.6'
      )
      .fromTo(
        titleRef.current,
        { y: 100, opacity: 0, skewY: 3 },
        { y: 0, opacity: 1, skewY: 0, duration: 1.3, ease: 'power3.out' },
        '-=0.85'
      )
      .fromTo(
        detailsRef.current ? Array.from(detailsRef.current.children) : [],
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.9, ease: 'power3.out' },
        '-=0.7'
      )

      // Parallax
      gsap.to(imgRef.current, {
        yPercent: 22,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="home" ref={heroRef} className="hero-section">
      <div ref={imgRef} className="hero-image-bg" aria-hidden="true" />
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
            <span className="detail-value">
              Official Launch of <em>Beyond the Books</em>
            </span>
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
  { text: 'There is MORE to who you are.' },
  { text: 'There is MORE to what you can achieve.' },
  { text: 'There is MORE to what God can do through you.' },
  { text: 'There is MORE waiting to be discovered within you.' },
]

function VisionSection() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const fadeUp = (selector: string, trigger?: string, extra = {}) =>
        gsap.fromTo(
          selector,
          { y: 55, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1.1, ease: 'power3.out',
            scrollTrigger: { trigger: trigger || selector, start: 'top 82%' },
            ...extra,
          }
        )

      fadeUp('.vision-section .section-label')
      fadeUp('.vision-heading')
      gsap.fromTo(
        '.vision-intro p',
        { y: 35, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: 0.2, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '.vision-intro', start: 'top 82%' },
        }
      )
      gsap.fromTo(
        '.vision-pillar',
        { y: 60, opacity: 0, scale: 0.97 },
        {
          y: 0, opacity: 1, scale: 1, stagger: 0.12, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '.vision-pillars', start: 'top 78%' },
        }
      )
      fadeUp('.vision-closing')
    }, ref)

    return () => ctx.revert()
  }, [])

  return (
    <section id="vision" ref={ref} className="vision-section">
      <div className="section-container">
        <div className="section-label">01 — Conference Vision</div>

        <h2 className="vision-heading section-heading">
          There Is <em>More</em><br />To You
        </h2>

        <div className="vision-intro">
          <p>
            The BEYOND Conference 2026 is a transformational gathering designed to awaken
            young people to the truth that there is more to them than society, past
            experiences, limitations, or self-doubt have defined.
          </p>
          <p>
            The heart of this conference is to communicate a powerful, life-altering truth
            to every person who walks through those doors.
          </p>
        </div>

        <div className="vision-pillars">
          {PILLARS.map((p, i) => (
            <div key={i} className="vision-pillar">
              <span className="pillar-number">0{i + 1}</span>
              <p>
                {p.text.replace('MORE', '').split('').length > 0 ? (
                  <>
                    {p.text.includes('MORE')
                      ? <>
                          {p.text.split('MORE')[0]}
                          <strong>MORE</strong>
                          {p.text.split('MORE')[1]}
                        </>
                      : p.text}
                  </>
                ) : p.text}
              </p>
            </div>
          ))}
        </div>

        <p className="vision-closing">
          This conference will inspire young people to recognise the beauty, capacity,
          and limitless potential deposited on their inside — and to take intentional steps
          toward becoming all they were created to be.
        </p>
      </div>
    </section>
  )
}

// ============================================================
// PARTNERSHIPS & SUPPORT
// ============================================================

const SUPPORT_ITEMS = [
  'Financial Sponsorship',
  'Souvenir Production Support',
  'Media Coverage',
  'Refreshments Sponsorship',
  'Equipment Sponsorship',
]

function PartnershipsSection() {
  const ref         = useRef<HTMLElement>(null)
  const fillRef     = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const pct = Math.min((AMOUNT_RAISED / TOTAL_BUDGET) * 100, 100)

  const copy = (value: string, label: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(label)
      setTimeout(() => setCopied(null), 2200)
    })
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.partnerships-section .section-label', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1,
        scrollTrigger: { trigger: '.partnerships-section .section-label', start: 'top 85%' },
      })
      gsap.fromTo('.partnerships-heading', { y: 60, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: '.partnerships-heading', start: 'top 82%' },
      })
      gsap.fromTo('.support-item', { x: -40, opacity: 0 }, {
        x: 0, opacity: 1, stagger: 0.08, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.support-list', start: 'top 80%' },
      })
      gsap.fromTo(fillRef.current, { width: '0%' }, {
        width: `${pct}%`,
        duration: 2.4,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.progress-container', start: 'top 80%' },
      })
      gsap.fromTo('.account-card', { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: '.account-card', start: 'top 84%' },
      })
    }, ref)

    return () => ctx.revert()
  }, [pct])

  return (
    <section id="partnerships" ref={ref} className="partnerships-section">
      <div className="section-container">
        <div className="section-label">02 — Call for Support</div>

        <h2 className="partnerships-heading section-heading">
          Partnerships<br />& <em>Support</em>
        </h2>

        <div className="partnerships-grid">
          {/* Left — Support Needed */}
          <div className="support-column">
            <p className="column-heading">Support Needed</p>
            <ul className="support-list">
              {SUPPORT_ITEMS.map(item => (
                <li key={item} className="support-item">{item}</li>
              ))}
            </ul>
          </div>

          {/* Right — Funding & Account */}
          <div className="funding-column">
            <p className="column-heading">Financial Goal</p>

            <div className="progress-container">
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
                  key={label}
                  className="account-row"
                  onClick={() => copy(val, label)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && copy(val, label)}
                  aria-label={`Copy ${label}: ${val}`}
                >
                  <span className="account-field-label">{label}</span>
                  <span className="account-value">{val}</span>
                  <span className="copy-btn">
                    {copied === label ? 'Copied' : 'Copy'}
                  </span>
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
// VOLUNTEERS
// ============================================================

interface FormState {
  name:      string
  phone:     string
  email:     string
  attending: '' | 'Yes' | 'No'
  mode:      '' | 'Virtual' | 'Physical'
}

const EMPTY_FORM: FormState = {
  name: '', phone: '', email: '', attending: '', mode: '',
}

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error'

function VolunteerModal({
  unit,
  onClose,
}: {
  unit: string
  onClose: () => void
}) {
  const ref    = useRef<HTMLDivElement>(null)
  const [form, setForm]     = useState<FormState>(EMPTY_FORM)
  const [status, setStatus] = useState<SubmitStatus>('idle')

  // Animate in
  useEffect(() => {
    gsap.fromTo(ref.current, { y: 80, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.55, ease: 'power3.out',
    })
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const close = useCallback(() => {
    gsap.to(ref.current, {
      y: 80, opacity: 0, duration: 0.4, ease: 'power3.in',
      onComplete: onClose,
    })
  }, [onClose])

  const setField = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm(f => ({ ...f, [k]: v }))

  const submit = async () => {
    if (!form.name || !form.phone || !form.email || !form.attending || !form.mode) {
      alert('Please complete all fields before confirming.')
      return
    }

    setStatus('sending')

    const { newCount, allStats } = incrementCount(unit)
    const now = new Date().toLocaleString('en-NG', {
      timeZone: 'Africa/Lagos',
      dateStyle: 'long',
      timeStyle: 'short',
    })

    try {
      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        {
          unit,
          volunteer_name:  form.name,
          volunteer_phone: form.phone,
          volunteer_email: form.email,
          attending:       form.attending,
          mode:            form.mode,
          unit_total:      String(newCount),
          all_stats:       allStats,
          timestamp:       now,
        },
        EMAILJS_CONFIG.PUBLIC_KEY
      )
      setStatus('success')

      // Redirect to WhatsApp group after brief pause
      const link = WHATSAPP[unit]
      setTimeout(() => {
        if (link) window.open(link, '_blank', 'noopener,noreferrer')
        close()
      }, 2600)
    } catch {
      setStatus('error')
    }
  }

  return (
    <div
      className="modal-backdrop"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label={`Join ${unit}`}
    >
      <div ref={ref} className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={close} aria-label="Close form">
          Close
        </button>

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
            {WHATSAPP[unit]
              ? <p className="redirect-note">Taking you to the group chat now...</p>
              : <p className="redirect-note">Group link coming soon — we will be in touch.</p>
            }
          </div>
        ) : (
          <div className="modal-form">
            <div className="form-field">
              <label htmlFor="vol-name">Full Name</label>
              <input
                id="vol-name"
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={e => setField('name', e.target.value)}
                autoComplete="name"
              />
            </div>

            <div className="form-field">
              <label htmlFor="vol-phone">Phone Number</label>
              <input
                id="vol-phone"
                type="tel"
                placeholder="e.g. 08012345678"
                value={form.phone}
                onChange={e => setField('phone', e.target.value)}
                autoComplete="tel"
              />
            </div>

            <div className="form-field">
              <label htmlFor="vol-email">Email Address</label>
              <input
                id="vol-email"
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={e => setField('email', e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Will you be attending?</label>
                <div className="radio-group" role="radiogroup">
                  {(['Yes', 'No'] as const).map(opt => (
                    <label
                      key={opt}
                      className={`radio-option ${form.attending === opt ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="attending"
                        value={opt}
                        checked={form.attending === opt}
                        onChange={() => setField('attending', opt)}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-field">
                <label>Participation Mode</label>
                <div className="radio-group" role="radiogroup">
                  {(['Virtual', 'Physical'] as const).map(opt => (
                    <label
                      key={opt}
                      className={`radio-option ${form.mode === opt ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="mode"
                        value={opt}
                        checked={form.mode === opt}
                        onChange={() => setField('mode', opt)}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {status === 'error' && (
              <p className="error-msg" role="alert">
                Something went wrong. Please check your connection and try again.
              </p>
            )}

            <button
              className="confirm-btn"
              onClick={submit}
              disabled={status === 'sending'}
              aria-busy={status === 'sending'}
            >
              {status === 'sending' ? 'Submitting...' : 'Confirm Registration'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function VolunteersSection() {
  const ref           = useRef<HTMLElement>(null)
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.volunteers-section .section-label', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1,
        scrollTrigger: { trigger: '.volunteers-section .section-label', start: 'top 85%' },
      })
      gsap.fromTo('.volunteers-heading', { y: 60, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: '.volunteers-heading', start: 'top 82%' },
      })
      gsap.fromTo('.volunteers-intro', { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.9,
        scrollTrigger: { trigger: '.volunteers-intro', start: 'top 85%' },
      })
      gsap.fromTo('.unit-card', { y: 65, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.units-grid', start: 'top 78%' },
      })
    }, ref)

    return () => ctx.revert()
  }, [])

  return (
    <section id="volunteers" ref={ref} className="volunteers-section">
      <div className="section-container">
        <div className="section-label">03 — Join the Team</div>

        <h2 className="volunteers-heading section-heading">
          Call for<br /><em>Volunteers</em>
        </h2>

        <p className="volunteers-intro">
          The Beyond Conference 2026 is powered by a team of committed, passionate
          individuals. Choose a unit that resonates with you, complete the form, and
          become part of something greater than yourself.
        </p>

        <div className="units-grid">
          {UNITS.map((unit, i) => (
            <article
              key={unit.name}
              className="unit-card"
              style={{ '--delay': `${i * 0.08}s` } as React.CSSProperties}
            >
              <div className="unit-number" aria-hidden="true">0{i + 1}</div>
              <h3 className="unit-name">{unit.name}</h3>
              <p className="unit-desc">{unit.desc}</p>
              <button
                className="join-btn"
                onClick={() => setActive(unit.name)}
                aria-label={`Join ${unit.name}`}
              >
                Join Unit
              </button>
            </article>
          ))}
        </div>
      </div>

      {active && (
        <VolunteerModal
          unit={active}
          onClose={() => setActive(null)}
        />
      )}
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
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            {NAV_SECTIONS.map(s => (
              <li key={s.href}>
                <a
                  href={s.href}
                  onClick={e => { e.preventDefault(); scrollTo(s.href) }}
                >
                  {s.label}
                </a>
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
        <p>© {new Date().getFullYear()} The Beyond Conference. All rights reserved.</p>
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

  useEffect(() => {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY)
  }, [])

  return (
    <>
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
      <div className="app" style={{ visibility: loaded ? 'visible' : 'hidden' }}>
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
