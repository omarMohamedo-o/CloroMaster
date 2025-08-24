import React, { useEffect, useState } from 'react';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServicesGrid from './components/ServicesGrid';
import About from './components/About';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import { MotionConfig, useReducedMotion } from 'framer-motion';

export default function App(){
  const [dark, setDark] = useState(false);
  const prefersReduced = useReducedMotion();

  // Removed AOS; all animations handled with Framer Motion

  useEffect(()=>{
    const root = window.document.documentElement;
    if(dark) root.classList.add('dark'); else root.classList.remove('dark');
  },[dark]);

  const toggleDark = ()=> setDark(d=>!d);

  return (
    <MotionConfig
      transition={{ duration: prefersReduced ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
      reducedMotion={prefersReduced ? 'always' : 'never'}
    >
      <div className="transition-colors duration-300">
        <Navbar darkMode={dark} toggleDark={toggleDark} />
        <main className="pt-20">
          <Hero />
          <ServicesGrid />
          <About />
          <ContactForm />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}