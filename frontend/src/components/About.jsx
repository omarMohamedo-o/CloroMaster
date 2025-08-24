import React from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaUsers, FaAward, FaGlobe, FaLightbulb, FaHeart } from 'react-icons/fa';

export default function About() {
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
    hidden: { y: 16, opacity: 0.001 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const features = [
    {
      icon: FaLeaf,
      title: "Eco-Friendly",
      description: "100% sustainable solutions"
    },
    {
      icon: FaUsers,
      title: "Expert Team",
      description: "Certified professionals"
    },
    {
      icon: FaAward,
      title: "Award Winning",
      description: "Industry recognition"
    },
    {
      icon: FaGlobe,
      title: "Global Impact",
      description: "Worldwide solutions"
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden transform-gpu will-change-transform">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 right-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Left Content */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="space-y-4">
              <motion.div
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-brand/10 text-brand text-sm font-medium"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.08 }}
                viewport={{ once: true, amount: 0.15 }}
              >
                <FaLeaf className="text-lg" />
                About Our Company
              </motion.div>
              
              <motion.h2
                className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.12 }}
                viewport={{ once: true, amount: 0.15 }}
              >
                We're passionate about{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-emerald-500">
                  protecting the planet
                </span>{' '}
                while helping businesses thrive
              </motion.h2>
            </div>

            <motion.p
              className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.14 }}
              viewport={{ once: true, amount: 0.15 }}
            >
              At ChloroMaster, we are a collective of engineers, ecologists, and designers 
              dedicated to building sustainable strategies and technologies that reduce 
              environmental impact while improving business outcomes.
            </motion.p>

            <motion.p
              className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.16 }}
              viewport={{ once: true, amount: 0.15 }}
            >
              Founded by environmental experts and engineers, we strive to lead the green 
              revolution by combining innovation, expertise, and care for the planet.
            </motion.p>

            {/* Features Grid */}
            <motion.div
              className="grid grid-cols-2 gap-6 pt-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.18 }}
              viewport={{ once: true, amount: 0.15 }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
                  layout
                  whileHover={{ y: -5, scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.06 }}
                  viewport={{ once: true, amount: 0.15 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand to-emerald-500 flex items-center justify-center">
                    <feature.icon className="text-white text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.22 }}
              viewport={{ once: true, amount: 0.15 }}
            >
              <motion.button
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-brand to-emerald-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaHeart className="text-lg" />
                Join Our Mission
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Content - Image */}
          <motion.div
            variants={itemVariants}
            className="relative"
          >
            <motion.div
              className="relative rounded-2xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              viewport={{ once: true, amount: 0.15 }}
              whileHover={{ scale: 1.02 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1497493292307-31c376b6e479?q=80&w=1200&auto=format&fit=crop" 
                alt="ChloroMaster team working on sustainable solutions" 
                className="w-full h-96 lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </motion.div>

            {/* Floating stats card */}
            <motion.div
              className="absolute -bottom-8 -left-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.22 }}
              viewport={{ once: true, amount: 0.15 }}
              whileHover={{ y: -5, scale: 1.05 }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-brand mb-2">15+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Years Experience</div>
              </div>
            </motion.div>

            {/* Decorative elements */}
            <motion.div
              className="absolute -top-4 -right-4 w-8 h-8 bg-brand/20 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute top-1/2 -left-4 w-4 h-4 bg-emerald-500/30 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}