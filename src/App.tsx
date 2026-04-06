import React, { useEffect, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Vision from './components/Vision';
import FinancialTracker from './components/FinancialTracker';
import VolunteersGrid from './components/VolunteersGrid';
import Footer from './components/Footer';
import MenuOverlay from './components/MenuOverlay';
import { useScrollAnimation } from './hooks/useScrollAnimation';

function App() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const visionRef = useRef<HTMLElement>(null);
  const trackerRef = useRef<HTMLElement>(null);
  const volunteersRef = useRef<HTMLElement>(null);

  useScrollAnimation([heroRef, visionRef, trackerRef, volunteersRef]);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const scrollToSection = (id: string) => {
    closeMenu();
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-navy-600 text-white min-h-screen">
      <Header toggleMenu={toggleMenu} menuOpen={menuOpen} />
      <MenuOverlay isOpen={menuOpen} onNavigate={scrollToSection} />
      <main>
        <Hero ref={heroRef} />
        <Vision ref={visionRef} />
        <FinancialTracker ref={trackerRef} />
        <VolunteersGrid ref={volunteersRef} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
