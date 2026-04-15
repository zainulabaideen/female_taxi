import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { MapPin, Phone, Mail, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#402763] text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-5">
             <img src="/logo.png" alt="SHEGO Logo" className="w-12 object-contain" />
            </Link>
            <p className="text-[#e1cfe6]/70 text-sm leading-relaxed mb-6">
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
                  className="w-9 h-9 rounded-full border border-[#e1cfe6]/30 flex items-center justify-center text-[#e1cfe6] hover:bg-[#ffcd60] hover:text-[#402763] hover:border-[#ffcd60] transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#ffcd60] font-bold text-lg mb-6">Quick Links</h3>
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
                    className="text-[#e1cfe6]/70 hover:text-[#ffcd60] transition-colors duration-200 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ffcd60]/40 group-hover:bg-[#ffcd60] transition-colors"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h3 className="text-[#ffcd60] font-bold text-lg mb-6">For Users</h3>
            <ul className="space-y-3">
              {[
                { label: 'Book a Ride', to: '/signup' },
                { label: 'Become a Driver', to: '/signup' },
                { label: 'Passenger Dashboard', to: '/dashboard/passenger' },
                { label: 'Driver Dashboard', to: '/dashboard/driver' },
                { label: 'SOS Emergency', to: '/safety' },
                { label: 'Privacy Policy', to: '#' },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.to}
                    className="text-[#e1cfe6]/70 hover:text-[#ffcd60] transition-colors duration-200 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ffcd60]/40 group-hover:bg-[#ffcd60] transition-colors"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-[#ffcd60] font-bold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#e1cfe6]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={15} className="text-[#ffcd60]" />
                </div>
                <span className="text-[#e1cfe6]/70 text-sm leading-relaxed">
                  123 Women's Safety Blvd,<br />Karachi, Pakistan
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#e1cfe6]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone size={15} className="text-[#ffcd60]" />
                </div>
                <a href="tel:+921234567890" className="text-[#e1cfe6]/70 hover:text-[#ffcd60] text-sm transition-colors">
                  +92 123 456 7890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#e1cfe6]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail size={15} className="text-[#ffcd60]" />
                </div>
                <a href="mailto:support@shego.pk" className="text-[#e1cfe6]/70 hover:text-[#ffcd60] text-sm transition-colors">
                  support@shego.pk
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#e1cfe6]/10">
        <div className="container mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#e1cfe6]/50 text-sm">
            © {new Date().getFullYear()} SHEGO. All rights reserved.
          </p>
          <p className="text-[#e1cfe6]/50 text-sm flex items-center gap-1">
            Made with <Heart size={13} className="text-[#ffcd60] fill-[#ffcd60]" /> for women's safety
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;