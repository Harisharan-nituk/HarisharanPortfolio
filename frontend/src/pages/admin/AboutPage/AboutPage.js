// frontend/src/pages/admin/AboutPage/AboutPage.js
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Import Section Components
import WhoIAmSection from './WhoIAmSection';
import SkillsSection from './SkillsSection';
import EducationSection from './EducationSection';
import CertificationsSection from './CertificationsSection';
import AchievementsSection from './AchievementsSection';

const AboutPage = () => {
  const scrollRef = useRef(null);
  
  // Track scroll progress of the page
  const { scrollYProgress } = useScroll({ container: scrollRef });

  // Define the gradient colors that will transition
  const gradientColors = [
    "hsl(212, 96%, 20%)", // Deep Blue (for "Who I Am")
    "hsl(264, 96%, 25%)", // Deep Purple (for "Skills")
    "hsl(145, 96%, 20%)", // Deep Green (for "Education")
    "hsl(35, 96%, 25%)",  // Deep Orange (for "Achievements")
    "hsl(343, 96%, 30%)", // Deep Rose (for "Certifications")
  ];

  // Map scroll position to the background color
  const backgroundColor = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], gradientColors);

  const sections = [
    <WhoIAmSection />,
    <SkillsSection />,
    <EducationSection />,
    <AchievementsSection />,
    <CertificationsSection />
  ];

  return (
    <div ref={scrollRef} className="relative bg-white dark:bg-slate-900">
      {/* The Gradient background is a fixed layer that stays behind the content */}
      <motion.div
        style={{ backgroundColor }}
        className="fixed inset-0 h-screen w-full -z-10"
      />
      {/* The content scrolls normally on top of the gradient */}
      <div className="relative z-10 container mx-auto px-4 py-16 space-y-24">
        {sections.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {section}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AboutPage;