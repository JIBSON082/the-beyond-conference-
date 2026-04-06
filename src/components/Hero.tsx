import React, { forwardRef, useEffect, useRef } from 'react';
import gsap from 'gsap';

const Hero = forwardRef<HTMLElement>((props, ref) => {
  const logoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Netflix-style logo animation
    const tl = gsap.timeline();
    tl.fromTo(logoRef.current, 
      { scale: 0.1, opacity: 0, filter: "blur(10px)" },
      { scale: 1, opacity: 1, filter: "blur(0px)", duration: 1.2, ease: "power4.out" }
    )
    .to(logoRef.current, {
      boxShadow: "0 0 30px 15px rgba(255,215,0,0.5)",
      duration: 0.5,
      repeat: 1,
      yoyo: true,
      ease: "power1.inOut"
    }, "-=0.3");
  }, []);

  return (
    <section ref={ref} id="home" className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-24">
      <img 
        ref={logoRef} 
        src="https://image2url.com/r2/default/images/1775492166817-4df4e1ed-3e50-4fc4-96ad-42b628eec777.jpg" 
        alt="The Beyond Community" 
        className="w-40 md:w-56 lg:w-64 mb-8 rounded-full shadow-2xl border-4 border-gold/30"
      />
      <h1 className="text-3xl md:text-6xl lg:text-7xl font-bold text-gold animate-on-scroll tracking-tight">
        THE BEYOND CONFERENCE 2026
      </h1>
      <p className="text-5xl md:text-7xl lg:text-8xl font-black text-white my-4 md:my-6 animate-on-scroll">
        MORE
      </p>
      <div className="text-white text-base md:text-lg lg:text-xl space-y-2 animate-on-scroll">
        <p>📍 Venue: College of Medicine, LUTH, Lagos</p>
        <p>📅 Date: 30th May 2026</p>
        <p>👤 Convener: Bookola</p>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
