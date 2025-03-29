"use client";
import React, { useState } from 'react';
import AuthRedirect from '@/components/AuthRedirect';
import { FiExternalLink, FiMail, FiMessageSquare, FiArrowRight } from 'react-icons/fi';
import { FaLinkedin, FaGithub, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactPage() {
  const [activeCard, setActiveCard] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  
  const socialMedia = [
    {
      name: 'LinkedIn',
      link: 'https://www.linkedin.com/in/rehman-nry',
      icon: <FaLinkedin className="text-2xl" />,
      description: 'Connect with me professionally and explore my career journey.',
      username: 'rehman-nry',
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      iconBg: 'bg-blue-600',
      hoverColor: 'hover:border-blue-400 hover:shadow-blue-200',
    },
    {
      name: 'GitHub',
      link: 'https://github.com/rehmanNRY',
      icon: <FaGithub className="text-2xl" />,
      description: 'Explore my repositories and coding projects.',
      username: 'rehmanNRY',
      color: 'bg-slate-50 text-slate-800 border-slate-200',
      iconBg: 'bg-slate-800',
      hoverColor: 'hover:border-slate-400 hover:shadow-slate-200',
    },
    {
      name: 'Instagram',
      link: 'https://www.instagram.com/rehman_nry/',
      icon: <FaInstagram className="text-2xl" />,
      description: 'Follow my visual journey and creative moments.',
      username: 'rehman_nry',
      color: 'bg-pink-50 text-pink-600 border-pink-200',
      iconBg: 'bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500',
      hoverColor: 'hover:border-pink-400 hover:shadow-pink-200',
    },
    {
      name: 'WhatsApp',
      link: 'https://wa.link/fcyw8d',
      icon: <FaWhatsapp className="text-2xl" />,
      description: "Let's chat about projects, ideas, or collaborations!",
      username: '923014340329',
      color: 'bg-green-50 text-green-600 border-green-200',
      iconBg: 'bg-green-500',
      hoverColor: 'hover:border-green-400 hover:shadow-green-200',
    },
  ];

  const contactMethods = [
    {
      name: 'Send Email',
      description: 'Reach out via email for professional inquiries',
      icon: <FiMail className="text-blue-600 text-2xl" />,
      action: 'mailto:rehman.contact9@gmail.com',
      color: 'bg-blue-50 border-blue-200',
      hoverColor: 'hover:border-blue-400 hover:bg-blue-100',
    },
    {
      name: 'Direct Message',
      description: 'Send me a direct message for quick responses',
      icon: <FiMessageSquare className="text-indigo-600 text-2xl" />,
      action: 'https://wa.link/fcyw8d',
      color: 'bg-indigo-50 border-indigo-200',
      hoverColor: 'hover:border-indigo-400 hover:bg-indigo-100',
    }
  ];

  return (
    <AuthRedirect>
      <main className="min-h-screen bg-white py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="inline-block mb-6 p-2 rounded-full bg-blue-50"
            >
              <div className="bg-blue-100 p-3 rounded-full">
                <FiMessageSquare className="text-blue-600 text-3xl" />
              </div>
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-gray-900">
              Let's <span className="text-blue-600">Connect</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Choose your preferred way to reach out. I'm always open to new opportunities, collaborations, or just a friendly conversation.
            </p>
          </motion.div>

          {/* Social Media Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-20"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Social Profiles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {socialMedia.map((media, index) => (
                <motion.div
                  key={media.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                  onHoverStart={() => setActiveCard(media.name)}
                  onHoverEnd={() => setActiveCard(null)}
                  className={`relative rounded-2xl overflow-hidden shadow-sm border ${media.color} ${media.hoverColor} transition-all duration-300`}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`p-3 rounded-xl text-white ${media.iconBg}`}>
                        {media.icon}
                      </div>
                      <motion.div
                        animate={{ rotate: activeCard === media.name ? 360 : 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white/90 p-2 rounded-full shadow-sm"
                      >
                        <FiExternalLink className="text-gray-500 text-lg" />
                      </motion.div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold mb-2">{media.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 h-12">
                        {media.description}
                      </p>
                      <div className="flex items-center bg-white/80 border border-current/20 rounded-full px-3 py-1.5 w-fit">
                        <span className="text-sm font-medium">
                          {media.name === 'WhatsApp' ? '+' : '@'}{media.username}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Animated overlay on hover */}
                  <AnimatePresence>
                    {activeCard === media.name && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white/90 to-transparent flex justify-center"
                      >
                        <motion.span 
                          initial={{ y: 10 }}
                          animate={{ y: 0 }}
                          className="text-sm font-medium flex items-center gap-1"
                        >
                          Visit Profile <FiArrowRight />
                        </motion.span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Clickable overlay */}
                  <a
                    href={media.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 z-20"
                    aria-label={`Visit ${media.name}`}
                  ></a>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Contact Methods Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-20"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Direct Contact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {contactMethods.map((method, index) => (
                <motion.a
                  key={method.name}
                  href={method.action}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onHoverStart={() => setHoveredButton(method.name)}
                  onHoverEnd={() => setHoveredButton(null)}
                  className={`flex items-center gap-4 p-6 rounded-xl border ${method.color} ${method.hoverColor} transition-all duration-300`}
                >
                  <div className="p-3 rounded-lg bg-white shadow-sm">
                    {method.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      {method.name}
                      <motion.div
                        animate={{ x: hoveredButton === method.name ? 5 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FiArrowRight className={hoveredButton === method.name ? "opacity-100" : "opacity-0"} />
                      </motion.div>
                    </h3>
                    <p className="text-gray-600 text-sm">{method.description}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          {/* Portfolio Button */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center"
          >
            <div className="bg-gray-50 py-12 px-6 rounded-2xl max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Explore My Work</h2>
              <p className="text-gray-600 mb-8">
                Check out my complete portfolio to see my projects, skills, and experience.
              </p>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://rehman-nry.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-300"
              >
                View Portfolio
                <FiExternalLink className="ml-2" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </main>
    </AuthRedirect>
  );
}