import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-6 md:py-8 text-center bg-navy-900 border-t border-gold/20">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-white/60 text-sm md:text-base">
          © 2026 The Beyond Community. All rights reserved.
        </p>
        <p className="text-white/40 text-xs mt-2">
          Empowering lives through faith, purpose, and action
        </p>
      </div>
    </footer>
  );
};

export default Footer;
