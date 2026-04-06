import React from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  toggleMenu: () => void;
  menuOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleMenu, menuOpen }) => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-navy-600/90 backdrop-blur-md py-4 px-6 md:px-12 flex justify-between items-center border-b border-gold/20">
      <img 
        src="https://image2url.com/r2/default/images/1775492166817-4df4e1ed-3e50-4fc4-96ad-42b628eec777.jpg" 
        alt="The Beyond Community Logo" 
        className="h-12 w-auto md:h-14 object-contain"
      />
      <button 
        onClick={toggleMenu} 
        className="text-gold hover:text-gold-600 transition-colors focus:outline-none"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        {menuOpen ? <X size={32} /> : <Menu size={32} />}
      </button>
    </header>
  );
};

export default Header;
