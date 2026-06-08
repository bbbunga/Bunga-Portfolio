"use client";

import { useState, useEffect } from "react";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        className="mobile-menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="mobile-menu-backdrop"
            onClick={() => setIsOpen(false)}
          />
          <nav className="mobile-menu" aria-label="Mobile navigation">
            <a href="#about" className="mobile-menu-link" onClick={handleLinkClick}>
              About
            </a>
            <a href="#projects" className="mobile-menu-link" onClick={handleLinkClick}>
              Project Archive
            </a>
            <a href="#skills" className="mobile-menu-link" onClick={handleLinkClick}>
              Skills
            </a>
            <a href="#contact" className="mobile-menu-link" onClick={handleLinkClick}>
              Contact
            </a>
          </nav>
        </>
      )}
    </>
  );
}
