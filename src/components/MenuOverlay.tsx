import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface MenuOverlayProps {
  isOpen: boolean;
  onNavigate: (id: string) => void;
}

const MenuOverlay: React.FC<MenuOverlayProps> = ({ isOpen, onNavigate }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<(HTMLLIElement | null)[]>([]);
  
  const menuItems = [
    { name: "Home", id: "home" },
    { name: "Our Vision", id: "ourvision" },
    { name: "Partnerships/Support", id: "partnerships" },
    { name: "Volunteers", id: "volunteers" }
  ];

  useEffect(() => {
    if (isOpen) {
      gsap.to(overlayRef.current, {
        duration: 0.6,
        clipPath: "circle(150% at 100% 0%)",
        ease: "power4.inOut",
        visibility: "visible"
      });
      gsap.fromTo(menuItemsRef.current,
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          stagger: 0.1, 
          duration: 0.6, 
          ease: "back.out(1.2)",
          delay: 0.2
        }
      );
    } else {
      gsap.to(overlayRef.current, {
        duration: 0.5,
        clipPath: "circle(0% at 100% 0%)",
        ease: "power4.inOut",
        onComplete: () => {
          if (overlayRef.current) overlayRef.current.style.visibility = "hidden";
        }
      });
    }
  }, [isOpen]);

  return (
    <div 
      ref={overlayRef} 
      className="fixed inset-0 z-40 bg-navy-800/98 backdrop-blur-xl flex items-center justify-center"
      style={{ clipPath: "circle(0% at 100% 0%)", visibility: "hidden" }}
    >
      <ul className="text-center space-y-6 md:space-y-8">
        {menuItems.map((item, idx) => (
          <li 
            key={idx} 
            ref={el => menuItemsRef.current[idx] = el}
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-gold hover:text-white cursor-pointer transition-all duration-300 hover:scale-110"
            onClick={() => onNavigate(item.id)}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuOverlay;
