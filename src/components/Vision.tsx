import React, { forwardRef } from 'react';

const Vision = forwardRef<HTMLElement>((props, ref) => {
  const bulletPoints = [
    "Who you are",
    "What you can achieve",
    "What God can do",
    "What is waiting to be discovered"
  ];

  return (
    <section ref={ref} id="ourvision" className="py-16 md:py-20 px-6 md:px-12 bg-navy-800">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-gold mb-8 md:mb-12 text-center animate-on-scroll">
          Our Vision
        </h2>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <div className="space-y-4 md:space-y-6 animate-on-scroll">
            <p className="text-lg md:text-xl leading-relaxed">
              To inspire a generation to pursue the <span className="text-gold font-semibold">"MORE"</span> that lies within—
              unlocking divine potential and transforming communities through faith, purpose, and action.
            </p>
            <div className="h-1 w-20 bg-gold rounded-full"></div>
            <p className="text-white/80 italic">
              "Beyond boundaries, beyond limits—into your destiny."
            </p>
          </div>
          <ul className="space-y-3 md:space-y-4 animate-on-scroll">
            {bulletPoints.map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-base md:text-lg group">
                <span className="text-gold text-2xl md:text-3xl group-hover:scale-110 transition-transform">✦</span>
                <span className="text-white group-hover:text-gold transition-colors">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
});

Vision.displayName = 'Vision';

export default Vision;
