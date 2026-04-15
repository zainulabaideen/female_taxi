import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield } from 'lucide-react';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Safety', to: '/safety' },
  { label: 'Contact', to: '/contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-[#402763]/5 border-b border-[#e1cfe6]/50'
          : 'bg-white/80 backdrop-blur-md border-b border-[#e1cfe6]/30'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
           <img src="/logo.png" alt="shego" className='w-12'/>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  pathname === link.to
                    ? 'text-[#402763] bg-[#e1cfe6]/60'
                    : 'text-[#402763]/70 hover:text-[#402763] hover:bg-[#e1cfe6]/40'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2 text-sm font-bold text-[#402763] border-2 border-[#402763]/20 rounded-xl hover:border-[#402763] hover:bg-[#402763]/5 transition-all duration-200"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2 text-sm font-bold text-[#402763] bg-[#ffcd60] rounded-xl hover:bg-[#ffcd60]/80 hover:shadow-lg hover:shadow-[#ffcd60]/30 transition-all duration-200"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-[#402763] hover:bg-[#e1cfe6]/40 transition"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="container mx-auto px-6 pb-5 pt-2 border-t border-[#e1cfe6]/40 bg-white/98">
          <div className="flex flex-col gap-1 mb-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  pathname === link.to
                    ? 'text-[#402763] bg-[#e1cfe6]/60'
                    : 'text-[#402763]/70 hover:text-[#402763] hover:bg-[#e1cfe6]/30'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex gap-3">
            <Link
              to="/login"
              className="flex-1 py-2.5 text-center text-sm font-bold text-[#402763] border-2 border-[#402763]/20 rounded-xl hover:border-[#402763] transition"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="flex-1 py-2.5 text-center text-sm font-bold text-[#402763] bg-[#ffcd60] rounded-xl hover:bg-[#ffcd60]/80 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;