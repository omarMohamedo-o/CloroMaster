import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-scroll';
import { FaLeaf, FaLinkedinIn, FaFacebookF, FaInstagram, FaTwitter, FaArrowUp } from 'react-icons/fa';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = [
    { name: 'Home', to: 'home' },
    { name: 'Services', to: 'services' },
    { name: 'About', to: 'about' },
    { name: 'Contact', to: 'contact' }
  ];

  const socialLinks = [
    { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
    { icon: FaFacebookF, href: '#', label: 'Facebook' },
    { icon: FaInstagram, href: '#', label: 'Instagram' },
    { icon: FaTwitter, href: '#', label: 'Twitter' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 12, opacity: 0.001 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden transform-gpu will-change-transform">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid md:grid-cols-4 gap-8 mb-8"
        >
          {/* Company Info */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <motion.div 
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand to-emerald-500 flex items-center justify-center text-white font-bold shadow-lg"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FaLeaf className="text-lg" />
              </motion.div>
              <h3 className="text-2xl font-bold">
                Chloro<span className="text-brand">Master</span>
              </h3>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Leading the green revolution with innovative sustainable solutions. 
              We combine technology and nature to create a better future for all.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-white/10 hover:bg-brand/20 flex items-center justify-center text-white transition-all duration-300 group"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  variants={itemVariants}
                >
                  <social.icon className="text-lg group-hover:text-brand transition-colors duration-300" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-semibold mb-6 text-brand">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.map((link, index) => (
                <motion.li
                  key={link.name}
                  variants={itemVariants}
                >
                  <Link
                    to={link.to}
                    smooth
                    duration={600}
                    className="text-gray-300 hover:text-brand transition-colors duration-300 cursor-pointer block"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-semibold mb-6 text-brand">Contact Info</h4>
            <div className="space-y-3 text-gray-300">
              <motion.p variants={itemVariants}>
                Alexandria, Egypt
              </motion.p>
              <motion.p variants={itemVariants}>
                +20 3 486 0034
              </motion.p>
              <motion.p variants={itemVariants}>
                info@chloromaster.com
              </motion.p>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          variants={itemVariants}
          className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} ChloroMaster. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-brand transition-colors duration-300">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-brand transition-colors duration-300">
              Terms of Service
            </a>
          </div>

          {/* Scroll to top button */}
          <motion.button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand to-emerald-500 flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: 0.18 }}
            viewport={{ once: true, amount: 0.15 }}
          >
            <FaArrowUp className="text-sm" />
          </motion.button>
        </motion.div>
      </div>
    </footer>
  );
}