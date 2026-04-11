import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Hero from './Hero';
import Features from './Features';
import HowItWorks from './HowItWorks';
import Stats from './Stats';
import Testimonials from './Testimonials';
import EmergencyCTA from './EmergencyCTA';

const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
      offset: 80,
    });
  }, []);

  return (
    <main className="overflow-hidden">
      <Hero />
      <Features />
      <HowItWorks />
      <Stats />
      <Testimonials />
      <EmergencyCTA />
    </main>
  );
};

export default Home;