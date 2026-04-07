/**
 * THE BEYOND CONFERENCE 2026 — App.tsx
 *
 * ============================================================
 * GOOGLE APPS SCRIPT SETUP (replaces EmailJS)
 * ============================================================
 *
 * 1. Go to https://script.google.com → New Project
 * 2. Paste the Apps Script code below into the editor
 * 3. Click Deploy → New Deployment → Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the deployed Web App URL → paste into APPS_SCRIPT_URL below
 *
 * ─── PASTE THIS INTO YOUR APPS SCRIPT PROJECT ───────────────
 *
 * function doPost(e) {
 *   try {
 *     var data = JSON.parse(e.postData.contents);
 *     var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
 *     sheet.appendRow([
 *       new Date(), data.name, data.phone, data.email,
 *       data.unit, data.attending, data.mode, data.timestamp
 *     ]);
 *     var statsBlock =
 *       'Current applications: ' + data.stats.total + '\n' +
 *       'Registration unit: '    + data.stats.registration + '\n' +
 *       'Media unit: '           + data.stats.media + '\n' +
 *       'Ushering unit: '        + data.stats.ushering + '\n' +
 *       'Protocol unit: '        + data.stats.protocol + '\n' +
 *       'Sponsorship unit: '     + data.stats.sponsorship + '\n' +
 *       'Logistics unit: '       + data.stats.logistics + '\n' +
 *       'Welfare unit: '         + data.stats.welfare;
 *
 *     var body =
 *       'NEW VOLUNTEER REGISTRATION — Beyond Conference 2026\n' +
 *       '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
 *       'VOLUNTEER DETAILS\n\n' +
 *       'Full Name:      ' + data.name      + '\n' +
 *       'Phone Number:   ' + data.phone     + '\n' +
 *       'Email Address:  ' + data.email     + '\n' +
 *       'Unit:           ' + data.unit      + '\n' +
 *       'Attending:      ' + data.attending + '\n' +
 *       'Mode:           ' + data.mode      + '\n' +
 *       'Submitted:      ' + data.timestamp + '\n\n' +
 *       '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
 *       '📊 STATISTICS\n\n' + statsBlock + '\n\n' +
 *       '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
 *
 *     GmailApp.sendEmail(
 *       Session.getActiveUser().getEmail(),
 *       'New Volunteer — ' + data.name + ' (' + data.unit + ') | Beyond 2026',
 *       body
 *     );
 *     return ContentService
 *       .createTextOutput(JSON.stringify({ success: true }))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   } catch(err) {
 *     return ContentService
 *       .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   }
 * }
 *
 * function doGet(e) {
 *   return ContentService
 *     .createTextOutput('Beyond Conference 2026 — Apps Script Active')
 *     .setMimeType(ContentService.MimeType.TEXT);
 * }
 * ─────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ============================================================
// CONFIGURATION — EDIT THESE VALUES
// ============================================================

const AMOUNT_RAISED = 0
const TOTAL_BUDGET  = 2_400_000

const ACCOUNT = {
  number: '7350104678',
  bank:   'Wema Bank',
  name:   'Bukola D. Adewuyi',
}

/** Paste your deployed Google Apps Script URL here */
const APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL'

const INSTAGRAM_URL =
  'https://www.instagram.com/the_beyond_community?igsh=eDVtdGpvM3B3bTF5'

const LOGO_URL =
  'https://image2url.com/r2/default/images/1775526751389-21009a87-43a1-4cae-9afa-4ac23128ac50.jpg'

// ✦ NEW HERO IMAGE — Beyond Community banner with globe
const HERO_IMG =
  'https://image2url.com/r2/default/images/1775559218217-257adcce-d9db-4691-9ec1-f9cd3eb1bb2d.jpg'

// ============================================================
// VOLUNTEER UNIT DATA — all WhatsApp links now filled
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

const getCount = (unit: string): number => {
  try {
    const all = JSON.parse(localStorage.getItem('beyond_counts') || '{}')
    return Number(all[unit]) || 0
  } catch { return 0 }
}

const getAllCounts = (): Record<string, number> => {
  try {
    const all = JSON.parse(localStorage.getItem('beyond_counts') || '{}')
    return Object.fromEntries(UNITS.map(u => [u.name, Number(all[u.name]) || 0]))
  } catch { return Object.fromEntries(UNITS.map(u => [u.name, 0])) }
}

const getTotalCount = (): number =>
  UNITS.reduce((s, u) => s + getCount(u.name), 0)

const incrementCount = (unit: string) => {
  try {
    const all = JSON.parse(localStorage.getItem('beyond_counts') || '{}')
    all[unit] = (Number(all[unit]) || 0) + 1
    localStorage.setItem('beyond_counts', JSON.stringify(all))
    return {
      newCount: all[unit] as number,
      stats: {
        total:        UNITS.reduce((s, u) => s + (Number(all[u.name]) || 0), 0),
        registration: Number(all['Registration Unit']) || 0,
        media:        Number(all['Media Unit'])         || 0,
        ushering:     Number(all['Ushering Unit'])      || 0,
        protocol:     Number(all['Protocol Unit'])      || 0,
        sponsorship:  Number(all['Sponsorship Unit'])   || 0,
        logistics:    Number(all['Logistics Unit'])     || 0,
        welfare:      Number(all['Welfare Unit'])       || 0,
      },
    }
  } catch {
    return { newCount: 1, stats: { total: 1, registration: 0, media: 0, ushering: 0, protocol: 0, sponsorship: 0, logistics: 0, welfare: 0 } }
  }
}

// ============================================================
// INSTAGRAM ICON
// ============================================================

function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
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
          duration: 0.7, opacity: 0, ease: 'power2.inOut', onComplete: onDone,
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
// NAVBAR  (+ Instagram link + border separator)
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
    setTimeout(() => {
      const el = document.querySelector(href)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 650)
  }, [])

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        {/* Logo */}
        <button
          className="nav-logo-btn"
          onClick={() => navigate('#home')}
          aria-label="Back to top"
        >
          <img src={LOGO_URL} alt="The Beyond Conference" />
        </button>

        {/* Instagram link — centre of navbar */}
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="nav-instagram-link"
          aria-label="Follow us on Instagram"
        >
          <InstagramIcon size={17} />
          <span>@the_beyond_community</span>
        </a>

        {/* Hamburger */}
        <button
          className={`hamburger ${open ? 'active' : ''}`}
          onClick={() => setOpen(v => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* ✦ Decorative gold border line below the navbar */}
      <div className="navbar-separator" aria-hidden="true" />

      {/* Full-screen overlay menu */}
      <div
        ref={overlayRef}
        className="nav-overlay"
        style={{ clipPath: 'circle(0% at 95% 5%)' }}
        role="dialog" aria-modal="true" aria-hidden={!open}
      >
        <div ref={linksRef} className="nav-links">
          {NAV_SECTIONS.map(s => (
            <button key={s.href} className="nav-link-item" onClick={() => navigate(s.href)}>
              {s.label}
            </button>
          ))}
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link-item nav-link-ig-item"
          >
            <InstagramIcon size={24} />
            Instagram
          </a>
        </div>
      </div>
    </>
  )
}

// ============================================================
// HERO SECTION — Mind-blowing GSAP + canvas rotating globe
// ============================================================

function HeroSection() {
  const heroRef    = useRef<HTMLElement>(null)
  const imgRef     = useRef<HTMLDivElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const accentsRef = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const titleRef   = useRef<HTMLHeadingElement>(null)
  const detailsRef = useRef<HTMLDivElement>(null)

  // ── Canvas: continuously rotating globe wireframe ──────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let animId: number
    let angle   = 0

    function resize() {
      const parent = canvas.parentElement
      if (!parent) return
      const r   = parent.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio, 2)
      canvas.width  = r.width  * dpr
      canvas.height = r.height * dpr
      canvas.style.width  = r.width  + 'px'
      canvas.style.height = r.height + 'px'
    }
    resize()
    window.addEventListener('resize', resize)

    function draw() {
      const ctx = canvas.getContext('2d')
      if (!ctx) { animId = requestAnimationFrame(draw); return }

      const dpr = Math.min(window.devicePixelRatio, 2)
      const W   = canvas.width  / dpr
      const H   = canvas.height / dpr

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.save()
      ctx.scale(dpr, dpr)

      // ── Globe centre (matches where the globe sits in the image) ──
      const cx = W * 0.5
      const cy = H * 0.62
      const R  = Math.min(W * 0.22, H * 0.20, 130)

      // Outer atmospheric glow
      const glow = ctx.createRadialGradient(cx, cy, R * 0.3, cx, cy, R * 1.8)
      glow.addColorStop(0,   'rgba(126, 200, 227, 0.18)')
      glow.addColorStop(0.5, 'rgba(126, 200, 227, 0.06)')
      glow.addColorStop(1,   'transparent')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(cx, cy, R * 1.8, 0, Math.PI * 2)
      ctx.fill()

      // Gold inner core glow
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.7)
      core.addColorStop(0,   'rgba(193, 154, 38, 0.12)')
      core.addColorStop(1,   'transparent')
      ctx.fillStyle = core
      ctx.beginPath()
      ctx.arc(cx, cy, R * 0.7, 0, Math.PI * 2)
      ctx.fill()

      // ── Latitude rings ──────────────────────────────────────
      for (let lat = -75; lat <= 75; lat += 15) {
        const sinL  = Math.sin((lat * Math.PI) / 180)
        const cosL  = Math.cos((lat * Math.PI) / 180)
        const yOff  = R * sinL
        const rx    = R * cosL
        const eq    = lat === 0
        const alpha = eq ? 0.7 : (0.12 + Math.abs(cosL) * 0.25)

        ctx.beginPath()
        ctx.ellipse(cx, cy + yOff, rx, rx * 0.12, 0, 0, Math.PI * 2)
        ctx.strokeStyle = eq
          ? `rgba(232, 187, 80, ${alpha})`
          : `rgba(126, 200, 227, ${alpha})`
        ctx.lineWidth = eq ? 1.8 : 0.7
        ctx.stroke()
      }

      // ── Longitude arcs (spinning) ────────────────────────────
      for (let lon = 0; lon < 180; lon += 18) {
        const theta = ((lon * 2 + angle) * Math.PI) / 180
        const cosT  = Math.cos(theta)

        ctx.beginPath()
        let moved = false
        for (let phi = 0; phi <= Math.PI * 2 + 0.04; phi += 0.035) {
          const x = cx + R * Math.sin(phi) * cosT
          const y = cy - R * Math.cos(phi)
          if (!moved) { ctx.moveTo(x, y); moved = true }
          else ctx.lineTo(x, y)
        }
        const vis = Math.max(0, cosT)
        ctx.strokeStyle = `rgba(193, 154, 38, ${vis * 0.55})`
        ctx.lineWidth   = 0.9
        ctx.stroke()
      }

      // ── Shimmering surface dots ──────────────────────────────
      const t = Date.now() * 0.001
      for (let i = 0; i < 14; i++) {
        const phi2  = (i / 14) * Math.PI * 2 + angle * 0.012
        const theta2 = Math.sin(i * 1.5) * Math.PI * 0.45
        const x = cx + R * Math.cos(theta2) * Math.cos(phi2)
        const y = cy - R * Math.sin(theta2)
        if (Math.cos(phi2) > 0) {
          const pulse = 0.35 + Math.sin(t * 1.8 + i) * 0.3
          ctx.beginPath()
          ctx.arc(x, y, 1.8, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(232, 187, 80, ${pulse})`
          ctx.fill()
        }
      }

      // ── Pole markers ─────────────────────────────────────────
      ctx.beginPath()
      ctx.arc(cx, cy - R, 3.5, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(232, 187, 80, 0.8)'
      ctx.fill()
      ctx.shadowColor = 'rgba(232, 187, 80, 0.6)'
      ctx.shadowBlur  = 8
      ctx.fill()
      ctx.shadowBlur  = 0

      ctx.beginPath()
      ctx.arc(cx, cy + R, 3, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(126, 200, 227, 0.6)'
      ctx.fill()

      ctx.restore()
      angle  += 0.38
      animId  = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  // ── GSAP: entrance + continuous accent float ───────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const accents = accentsRef.current
        ? Array.from(accentsRef.current.children) as HTMLElement[]
        : []

      const tl = gsap.timeline({ delay: 0.25 })

      // Image zoom-in + brighten
      tl.fromTo(imgRef.current,
        { scale: 1.12, opacity: 0, filter: 'brightness(0.35) saturate(0.5)' },
        { scale: 1, opacity: 1, filter: 'brightness(1) saturate(1)', duration: 3, ease: 'power2.out' }
      )

      // Canvas globe fade-in
      .fromTo(canvasRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 2.8, ease: 'power2.inOut' },
        '-=2.5'
      )

      // Accent rectangles burst in from random directions
      .fromTo(accents,
        { opacity: 0, scale: 0.1, rotation: (i: number) => (i % 2 === 0 ? -25 : 25) },
        {
          opacity: 1, scale: 1, rotation: 0,
          stagger: { each: 0.07, from: 'random' },
          duration: 1.4, ease: 'back.out(2.2)',
        },
        '-=2.2'
      )

      // Eyebrow
      .fromTo(eyebrowRef.current,
        { y: 45, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' },
        '-=1.5'
      )

      // Title — dramatic slide
      .fromTo(titleRef.current,
        { y: 100, opacity: 0, skewY: 5 },
        { y: 0, opacity: 1, skewY: 0, duration: 1.6, ease: 'power3.out' },
        '-=0.95'
      )

      // Details strip
      .fromTo(
        detailsRef.current ? Array.from(detailsRef.current.children) : [],
        { y: 38, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 1, ease: 'power3.out' },
        '-=0.9'
      )

      // Continuous gentle float for each accent rectangle
      accents.forEach((el, i) => {
        gsap.to(el, {
          y:        `random(-22, 22)`,
          x:        `random(-10, 10)`,
          rotation: `random(-7, 7)`,
          duration:  3.5 + i * 0.55,
          ease:     'sine.inOut',
          repeat:   -1,
          yoyo:     true,
          delay:     i * 0.35,
        })
      })

      // Scroll parallax on image
      gsap.to(imgRef.current, {
        yPercent: 28,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end:   'bottom top',
          scrub: 1.8,
        },
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="home" ref={heroRef} className="hero-section">
      {/* Background image */}
      <div
        ref={imgRef}
        className="hero-image-bg"
        style={{ backgroundImage: `url('${HERO_IMG}')` }}
        aria-hidden="true"
      />

      {/* Canvas: rotating globe wireframe overlay */}
      <canvas ref={canvasRef} className="hero-globe-canvas" aria-hidden="true" />

      {/* Floating yellow + blue rectangle accents matching the image style */}
      <div ref={accentsRef} className="hero-accents" aria-hidden="true">
        <div className="accent accent-y1" />
        <div className="accent accent-y2" />
        <div className="accent accent-y3" />
        <div className="accent accent-y4" />
        <div className="accent accent-b1" />
        <div className="accent accent-b2" />
        <div className="accent accent-b3" />
      </div>

      {/* Gradient overlay */}
      <div className="hero-overlay" aria-hidden="true" />

      {/* Content */}
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
// VISION SECTION
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
      gsap.fromTo('.vision-section .section-label', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1,
        scrollTrigger: { trigger: '.vision-section .section-label', start: 'top 82%' },
      })
      gsap.fromTo('.vision-heading', { y: 60, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: '.vision-heading', start: 'top 82%' },
      })
      gsap.fromTo('.vision-intro p', { y: 35, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.2, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.vision-intro', start: 'top 82%' },
      })
      gsap.fromTo('.vision-pillar', { y: 60, opacity: 0, scale: 0.97 }, {
        y: 0, opacity: 1, scale: 1, stagger: 0.12, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.vision-pillars', start: 'top 78%' },
      })
      gsap.fromTo('.vision-closing', { y: 35, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1,
        scrollTrigger: { trigger: '.vision-closing', start: 'top 82%' },
      })
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
                {p.text.includes('MORE') ? (
                  <>
                    {p.text.split('MORE')[0]}
                    <strong>MORE</strong>
                    {p.text.split('MORE')[1]}
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
// PARTNERSHIPS & SUPPORT SECTION
// ============================================================

const SUPPORT_ITEMS = [
  'Financial Sponsorship',
  'Souvenir Production Support',
  'Media Coverage',
  'Refreshments Sponsorship',
  'Equipment Sponsorship',
]

function PartnershipsSection() {
  const ref     = useRef<HTMLElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
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
        width: `${pct}%`, duration: 2.4, ease: 'power2.out',
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
          <div className="support-column">
            <p className="column-heading">Support Needed</p>
            <ul className="support-list">
              {SUPPORT_ITEMS.map(item => (
                <li key={item} className="support-item">{item}</li>
              ))}
            </ul>
          </div>
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
                  <span className="copy-btn">{copied === label ? 'Copied ✓' : 'Copy'}</span>
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
// VOLUNTEER MODAL — Google Apps Script + WhatsApp redirect
// ============================================================

interface FormState {
  name:      string
  phone:     string
  email:     string
  attending: '' | 'Yes' | 'No'
  mode:      '' | 'Virtual' | 'Physical'
}

const EMPTY_FORM: FormState = { name: '', phone: '', email: '', attending: '', mode: '' }
type SubmitStatus = 'idle' | 'sending' | 'success' | 'error'

function VolunteerModal({
  unit,
  onClose,
}: {
  unit:    string
  onClose: () => void
}) {
  const ref                     = useRef<HTMLDivElement>(null)
  const [form,   setForm]       = useState<FormState>(EMPTY_FORM)
  const [status, setStatus]     = useState<SubmitStatus>('idle')
  const [errMsg, setErrMsg]     = useState('')
  const waLink                  = WHATSAPP[unit] || null

  // Entrance animation
  useEffect(() => {
    gsap.fromTo(ref.current,
      { y: 80, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.65, ease: 'power3.out' }
    )
  }, [])

  const close = useCallback(() => {
    gsap.to(ref.current, {
      y: 60, opacity: 0, duration: 0.4, ease: 'power3.in', onComplete: onClose,
    })
  }, [onClose])

  const openWhatsApp = () => {
    if (waLink) window.open(waLink, '_blank', 'noopener,noreferrer')
  }

  const submit = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim() || !form.attending || !form.mode) {
      setErrMsg('Please fill in all fields before submitting.')
      return
    }
    setErrMsg('')
    setStatus('sending')

    const { stats } = incrementCount(unit)

    const payload = {
      name:      form.name.trim(),
      phone:     form.phone.trim(),
      email:     form.email.trim(),
      unit,
      attending: form.attending,
      mode:      form.mode,
      timestamp: new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' }),
      stats,
    }

    try {
      // mode: 'no-cors' is required for Google Apps Script from a browser.
      // We cannot read the response body in this mode, so we assume success
      // as long as the network request doesn't throw. The Apps Script will
      // still receive and process the data normally.
      await fetch(APPS_SCRIPT_URL, {
        method:  'POST',
        mode:    'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body:    JSON.stringify(payload),
      })
      setStatus('success')
    } catch {
      setStatus('error')
      setErrMsg('Network error. Please check your connection and try again.')
    }
  }

  const change = (field: keyof FormState, val: string) =>
    setForm(f => ({ ...f, [field]: val } as FormState))

  return (
    <div
      className="modal-backdrop"
      onClick={e => e.target === e.currentTarget && close()}
    >
      <div
        ref={ref}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Volunteer registration — ${unit}`}
      >
        <button className="modal-close" onClick={close} aria-label="Close">✕ Close</button>

        {/* Header */}
        <div className="modal-header">
          <p className="modal-unit-label">{unit}</p>
          <h3 className="modal-title">Volunteer Registration</h3>
        </div>

        {/* ── Success state ── */}
        {status === 'success' ? (
          <div className="modal-success">
            <div className="success-check">✓</div>
            <h4>You're In!</h4>
            <p>
              Your registration for the <strong>{unit}</strong> has been received.
              Join the WhatsApp group to stay connected with your team.
            </p>
            {waLink && (
              <button className="whatsapp-btn" onClick={openWhatsApp}>
                {/* WhatsApp logo */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Join {unit} WhatsApp Group
              </button>
            )}
            <button className="modal-done-btn" onClick={close}>Done</button>
          </div>
        ) : (
          /* ── Form state ── */
          <div className="modal-form">
            <div className="form-field">
              <label htmlFor="vol-name">Full Name</label>
              <input
                id="vol-name" type="text" placeholder="Your full name"
                value={form.name} onChange={e => change('name', e.target.value)}
                disabled={status === 'sending'}
              />
            </div>

            <div className="form-field">
              <label htmlFor="vol-phone">Phone Number</label>
              <input
                id="vol-phone" type="tel" placeholder="e.g. 08012345678"
                value={form.phone} onChange={e => change('phone', e.target.value)}
                disabled={status === 'sending'}
              />
            </div>

            <div className="form-field">
              <label htmlFor="vol-email">Email Address</label>
              <input
                id="vol-email" type="email" placeholder="your@email.com"
                value={form.email} onChange={e => change('email', e.target.value)}
                disabled={status === 'sending'}
              />
            </div>

            <div className="form-field">
              <label>Will you be attending the conference?</label>
              <div className="radio-group">
                {(['Yes', 'No'] as const).map(opt => (
                  <label key={opt} className={`radio-btn ${form.attending === opt ? 'active' : ''}`}>
                    <input
                      type="radio" name="attending" value={opt}
                      checked={form.attending === opt}
                      onChange={() => change('attending', opt)}
                      disabled={status === 'sending'}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-field">
              <label>Participation Mode</label>
              <div className="radio-group">
                {(['Virtual', 'Physical'] as const).map(opt => (
                  <label key={opt} className={`radio-btn ${form.mode === opt ? 'active' : ''}`}>
                    <input
                      type="radio" name="mode" value={opt}
                      checked={form.mode === opt}
                      onChange={() => change('mode', opt)}
                      disabled={status === 'sending'}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>

            {errMsg && <p className="form-error" role="alert">{errMsg}</p>}

            <button
              className={`submit-btn ${status === 'sending' ? 'loading' : ''}`}
              onClick={submit}
              disabled={status === 'sending'}
            >
              {status === 'sending' ? (
                <><span className="spinner" /> Submitting…</>
              ) : (
                'Confirm Registration'
              )}
            </button>

            {status === 'error' && (
              <p className="form-error" role="alert" style={{ marginTop: 12 }}>
                Something went wrong. Please try again.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================
// VOLUNTEERS SECTION
// ============================================================

function VolunteersSection() {
  const ref = useRef<HTMLElement>(null)
  const [activeUnit, setActiveUnit] = useState<string | null>(null)
  const [counts,     setCounts]     = useState<Record<string, number>>(getAllCounts)

  const handleClose = () => {
    setCounts(getAllCounts())   // refresh counts after any submission
    setActiveUnit(null)
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.volunteers-section .section-label', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1,
        scrollTrigger: { trigger: '.volunteers-section .section-label', start: 'top 85%' },
      })
      gsap.fromTo('.volunteers-section .section-heading', { y: 60, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: '.volunteers-section .section-heading', start: 'top 82%' },
      })
      gsap.fromTo('.volunteers-intro', { y: 35, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1,
        scrollTrigger: { trigger: '.volunteers-intro', start: 'top 85%' },
      })
      gsap.fromTo('.unit-card', { y: 55, opacity: 0, scale: 0.96 }, {
        y: 0, opacity: 1, scale: 1, stagger: 0.09, duration: 0.95, ease: 'power3.out',
        scrollTrigger: { trigger: '.units-grid', start: 'top 80%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="volunteers" ref={ref} className="volunteers-section">
      <div className="section-container">
        <div className="section-label">03 — Serve With Us</div>
        <h2 className="section-heading">
          Call for<br /><em>Volunteers</em>
        </h2>
        <p className="volunteers-intro">
          The Beyond Conference 2026 is powered by people — passionate, dedicated
          individuals who believe in the message of MORE. Choose your unit and be
          part of something extraordinary.
        </p>

        <div className="units-grid">
          {UNITS.map((u, i) => (
            <div key={u.name} className="unit-card">
              <span className="unit-number">0{i + 1}</span>
              <h3 className="unit-name">{u.name}</h3>
              <p className="unit-desc">{u.desc}</p>
              <div className="unit-count-badge">
                <span className="count-dot" />
                <span>
                  {counts[u.name] ?? 0} volunteer{(counts[u.name] ?? 0) !== 1 ? 's' : ''}
                </span>
              </div>
              <button className="join-btn" onClick={() => setActiveUnit(u.name)}>
                Join This Unit
              </button>
            </div>
          ))}
        </div>
      </div>

      {activeUnit && (
        <VolunteerModal unit={activeUnit} onClose={handleClose} />
      )}
    </section>
  )
}

// ============================================================
// FOOTER — with Instagram link
// ============================================================

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src={LOGO_URL} alt="The Beyond Conference" className="footer-logo" />
          <div className="footer-brand-text">
            <p className="footer-name">The Beyond Conference 2026</p>
            <p className="footer-sub">Theme: MORE · 30th May 2026 · LUTH, Lagos</p>
          </div>
        </div>

        <div className="footer-divider" />

        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="footer-instagram"
          aria-label="Follow on Instagram"
        >
          <InstagramIcon size={24} />
          <div>
            <span className="footer-ig-handle">@the_beyond_community</span>
            <span className="footer-ig-sub">Follow us on Instagram</span>
          </div>
        </a>

        <div className="footer-divider" />

        <p className="footer-copy">
          © {new Date().getFullYear()} The Beyond Community · All rights reserved
        </p>
      </div>
    </footer>
  )
}

// ============================================================
// APP ROOT
// ============================================================

export default function App() {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
      <div className={`site ${loaded ? 'site--visible' : 'site--hidden'}`}>
        <Navbar />
        <main>
          <HeroSection />
          <VisionSection />
          <PartnershipsSection />
          <VolunteersSection />
        </main>
        <Footer />
      </div>
    </>
  )
}
