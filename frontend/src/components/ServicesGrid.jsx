import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSeedling, FaChalkboardTeacher, FaBolt, FaLeaf, FaRecycle, FaSolarPanel } from 'react-icons/fa';
import servicesData from '../data/services';

export default function ServicesGrid() {
  const [active, setActive] = useState('All');
  const cats = ['All', ...Array.from(new Set(servicesData.map(s => s.category)))];

  const filtered = active === 'All' ? servicesData : servicesData.filter(s => s.category === active);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06
      }
    }
  };

  const itemVariants = {
    hidden: { y: 14, opacity: 0.001 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const getIcon = (category) => {
    const icons = {
      'Sustainable Design': FaSeedling,
      'Eco Consulting': FaChalkboardTeacher,
      'Green Technology': FaBolt,
      'Renewable Energy': FaSolarPanel,
      'Waste Management': FaRecycle,
      'default': FaLeaf
    };
    return icons[category] || icons.default;
  };

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transform-gpu will-change-transform">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-emerald-500">Services</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Comprehensive sustainable solutions designed to transform your business 
            while protecting our planet for future generations.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div 
          className="flex justify-center gap-3 mb-12 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          viewport={{ once: true }}
        >
          {cats.map(cat => (
            <motion.button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                active === cat 
                  ? 'bg-gradient-to-r from-brand to-emerald-500 text-white shadow-lg' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
              }`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Services Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filtered.map((service, idx) => {
              const IconComponent = getIcon(service.category);
              return (
                <motion.article
                  key={service.id}
                  variants={itemVariants}
                  className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 overflow-hidden"
                  layout
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  {/* Background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Icon */}
                  <motion.div
                    className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-brand to-emerald-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: 5 }}
                  >
                    <IconComponent className="text-white text-2xl" />
                  </motion.div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-brand transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                      {service.desc}
                    </p>

                    {/* Category Badge */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="px-4 py-2 rounded-full bg-brand/10 text-brand text-sm font-medium">
                        {service.category}
                      </span>
                      <motion.button
                        className="text-brand hover:text-emerald-500 transition-colors duration-300"
                        whileHover={{ x: 5 }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </motion.button>
                    </div>

                    {/* Learn More Button */}
                    <motion.button
                      className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-brand to-emerald-500 text-white font-semibold hover:shadow-lg transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Learn More
                    </motion.button>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-brand/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-4 left-4 w-1 h-1 bg-emerald-500/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100" />
                </motion.article>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-brand/10 to-emerald-500/10 rounded-2xl p-8 border border-brand/20">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Start Your Sustainable Journey?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Let's discuss how we can help you implement sustainable solutions that benefit both your business and the environment.
            </p>
            <motion.button
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-brand to-emerald-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaLeaf className="text-lg" />
              Get Started Today
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}