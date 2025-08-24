import React, { useEffect, useRef } from 'react';

function easeOutQuad(t) { return t*(2-t); }

function animateValue(ref, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const eased = easeOutQuad(progress);
    const value = Math.floor(start + (end - start) * eased);
    if (ref.current) ref.current.textContent = value;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

export default function Counters() {
  const yearsRef = useRef();
  const projectsRef = useRef();
  const clientsRef = useRef();

  useEffect(() => {
    animateValue(yearsRef, 0, 12, 1200);
    animateValue(projectsRef, 0, 320, 1400);
    animateValue(clientsRef, 0, 150, 1600);
  }, []);

  return (
    <section className="py-12 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="card">
          <h3 className="text-5xl font-bold text-brand"><span ref={yearsRef}>0</span>+</h3>
          <p className="mt-2">Years of Experience</p>
        </div>
        <div className="card">
          <h3 className="text-5xl font-bold text-brand"><span ref={projectsRef}>0</span>+</h3>
          <p className="mt-2">Projects Completed</p>
        </div>
        <div className="card">
          <h3 className="text-5xl font-bold text-brand"><span ref={clientsRef}>0</span>+</h3>
          <p className="mt-2">Happy Clients</p>
        </div>
      </div>
    </section>
  );
}