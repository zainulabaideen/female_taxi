import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { MapPin, Phone, Mail, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#e1cfe6] text-[#402763]">
      {/* Main Footer */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-5">
             <img src="/logo.png" alt="SHEGO Logo" className="w-18 object-contain" />
            </Link>
            <p className="text-[#402763]/70 text-sm leading-relaxed mb-6">
              Safe, reliable, and empowering rides for women — by women. Your safety is our top priority, every single trip.
            </p>
            <div className="flex gap-3">
              {[
                { icon: <FaFacebookF size={14} />, href: '#' },
                { icon: <FaTwitter size={14} />, href: '#' },
                { icon: <FaInstagram size={14} />, href: '#' },
                { icon: <FaLinkedinIn size={14} />, href: '#' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-9 h-9 rounded-full border border-[#402763]/30 flex items-center justify-center text-[#402763] hover:bg-[#402763] hover:text-[#ffcd60] hover:border-[#402763] transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#402763] font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: 'Home', to: '/' },
                { label: 'About Us', to: '/about' },
                { label: 'Safety', to: '/safety' },
                { label: 'Contact Us', to: '/contact' },
                { label: 'Sign In', to: '/login' },
                { label: 'Sign Up', to: '/signup' },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.to}
                    className="text-[#402763]/70 hover:text-[#402763] transition-colors duration-200 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#402763]/40 group-hover:bg-[#402763] transition-colors"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h3 className="text-[#402763] font-bold text-lg mb-6">For Users</h3>
            <ul className="space-y-3">
              {[
                { label: 'Book a Ride', to: '/signup' },
                { label: 'Become a Driver', to: '/signup' },
                { label: 'Passenger Dashboard', to: '/' }, // /dashboard/passenger
                { label: 'Driver Dashboard', to: '/' }, // /dashboard/driver
                { label: 'SOS Emergency', to: '/safety' },
                { label: 'Privacy Policy', to: '#' },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.to}
                    className="text-[#402763]/70 hover:text-[#402763] transition-colors duration-200 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#402763]/40 group-hover:bg-[#402763] transition-colors"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-[#402763] font-bold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#402763]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={15} className="text-[#402763]" />
                </div>
                <span className="text-[#402763]/70 text-sm leading-relaxed">
                  123 Women's Safety Blvd,<br />Lahore, Pakistan
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#402763]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone size={15} className="text-[#402763]" />
                </div>
                <a href="tel:+921234567890" className="text-[#402763]/70 hover:text-[#402763] text-sm transition-colors">
                  +92 123 456 7890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#402763]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail size={15} className="text-[#402763]" />
                </div>
                <a href="mailto:support@shego.pk" className="text-[#402763]/70 hover:text-[#402763] text-sm transition-colors">
                  support@shego.pk
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#402763]/20">
        <div className="container mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#402763]/60 text-sm">
            © {new Date().getFullYear()} SHEGO. All rights reserved.
          </p>
          <p className="text-[#402763]/60 text-sm flex items-center gap-1">
            Made with <Heart size={13} className="text-[#402763] fill-[#402763]" /> for women's safety
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;