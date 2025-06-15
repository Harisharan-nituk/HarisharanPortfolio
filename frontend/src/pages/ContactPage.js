// frontend/src/pages/ContactPage.js
import React, { useState, useEffect } from 'react';
import ContactForm from '../components/contact/ContactForm';
import * as socialLinkService from '../services/socialLinkService';
import { motion } from 'framer-motion';
import { 
  Smartphone, Github, Linkedin, Twitter as TwitterIconLucide, 
  Code, ExternalLink, Globe, Link as LinkIcon, Mail, Info, Phone, MapPin 
} from 'lucide-react';

const iconComponents = {
  github: Github, linkedin: Linkedin, twitter: TwitterIconLucide, leetcode: Code,
  whatsapp: Smartphone, website: Globe, email: Mail, externallink: ExternalLink,
  info: Info, link: LinkIcon, default: LinkIcon,
};

const colorMap = {
    github: 'bg-gray-800 text-white hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600',
    linkedin: 'bg-blue-600 text-white hover:bg-blue-700',
    twitter: 'bg-sky-500 text-white hover:bg-sky-600',
    email: 'bg-red-600 text-white hover:bg-red-700',
    default: 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600'
};

const ContactPage = () => {
    const [socialLinks, setSocialLinks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLinks = async () => {
            setIsLoading(true);
            try {
                const data = await socialLinkService.getPublicSocialLinks();
                setSocialLinks(data || []);
            } catch (error) {
                console.error("Failed to fetch social links:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLinks();
    }, []);

    // Animation variants for the text
    const sentence = {
      hidden: { opacity: 1 },
      visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
    };
    const letter = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-900 overflow-hidden">
          <div className="container mx-auto px-4 py-16 sm:py-24">
              
              {/* --- NEW INTERACTIVE "GET IN TOUCH" SECTION --- */}
              <div className="text-center mb-20">
                  <motion.h1 
                    className="text-5xl md:text-7xl font-extrabold text-gray-800 dark:text-white"
                    variants={sentence}
                    initial="hidden"
                    animate="visible"
                  >
                    {"Get In Touch".split("").map((char, index) => (
                      <motion.span key={char + "-" + index} variants={letter}>
                        {char}
                      </motion.span>
                    ))}
                  </motion.h1>
                  <motion.p 
                    className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    Have a project in mind or just want to say hello? I’d love to hear from you.
                  </motion.p>
              </div>

              <div className="grid lg:grid-cols-2 lg:gap-16 items-start">
                  <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
                    className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg mb-10 lg:mb-0"
                  >
                      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Contact Information</h2>
                      <div className="space-y-6">
                          <div className="flex items-start gap-4"><div className="mt-1 flex-shrink-0 text-indigo-500 dark:text-indigo-400"><Mail size={22} /></div><div><h3 className="font-semibold text-gray-700 dark:text-gray-200">Email</h3><a href="mailto:bt21cse016@nituk.ac.in" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">bt21cse016@nituk.ac.in</a></div></div>
                          <div className="flex items-start gap-4"><div className="mt-1 flex-shrink-0 text-indigo-500 dark:text-indigo-400"><Phone size={22} /></div><div><h3 className="font-semibold text-gray-700 dark:text-gray-200">Phone</h3><p className="text-gray-600 dark:text-gray-300">+91 8447173197</p></div></div>
                          <div className="flex items-start gap-4"><div className="mt-1 flex-shrink-0 text-indigo-500 dark:text-indigo-400"><MapPin size={22} /></div><div><h3 className="font-semibold text-gray-700 dark:text-gray-200">Location</h3><p className="text-gray-600 dark:text-gray-300">Ghaziabad, India</p></div></div>
                      </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
                    className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg"
                  >
                      <ContactForm />
                  </motion.div>
              </div>

              {socialLinks.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="pt-16 mt-16 border-t border-gray-200 dark:border-slate-700"
                >
                    <h2 className="text-xl font-semibold text-center mb-8">Or Connect Via Socials</h2>
                    {isLoading ? <p className="text-center">Loading...</p> : (
                        <div className="flex flex-wrap justify-center items-center gap-5">
                            {socialLinks.map((link) => {
                                const IconComponent = iconComponents[link.iconName.toLowerCase()] || iconComponents.default;
                                const colors = colorMap[link.iconName.toLowerCase()] || colorMap.default;
                                return (
                                    <motion.a key={link._id} href={link.url} target="_blank" rel="noopener noreferrer" title={link.name} className={`flex items-center justify-center h-14 w-14 rounded-full shadow-md transition-all duration-300 ${colors}`} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                        <IconComponent size={24} />
                                    </motion.a>
                                );
                            })}
                        </div>
                    )}
                </motion.div>
              )}
          </div>
        </div>
    );
};

export default ContactPage;