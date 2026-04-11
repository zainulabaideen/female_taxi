import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import AboutHero from './AboutHero';
import OurStory from './OurStory';
import OurValues from './OurValues';
import TeamSection from './TeamSection';

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic', offset: 80 });
  }, []);

  return (
    <main className="overflow-hidden">
      <AboutHero />
      <OurStory />
      <OurValues />
      <TeamSection />
    </main>
  );
};

export default About;