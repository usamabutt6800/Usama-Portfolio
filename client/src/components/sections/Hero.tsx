// src/components/sections/Hero.tsx
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { Link } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiTwitter, FiMail, FiDownload, FiArrowDown } from 'react-icons/fi';
import { useProfile } from '@/context/ProfileContext';
import { FADE_UP, STAGGER_CONTAINER } from '@/constants';

// Tech stack icons with real SVG logos
const techIcons = [
  { name: 'React',      color: '#61DAFB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'Node.js',   color: '#339933', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
  { name: 'MongoDB',   color: '#47A248', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
  { name: 'Express',   color: '#ffffff', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
  { name: 'TypeScript',color: '#3178C6', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
  { name: 'JavaScript',color: '#F7DF1E', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  { name: 'Tailwind',  color: '#06B6D4', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg' },
  { name: 'Git',       color: '#F05032', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
];

const Hero = () => {
  const { profile } = useProfile();
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!gridRef.current) return;
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      gridRef.current.style.background =
        `radial-gradient(circle at ${x}% ${y}%, rgba(108,99,255,0.08) 0%, transparent 60%)`;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const roles = profile?.roles?.length
    ? profile.roles.flatMap(r => [r, 2000])
    : ['MERN Stack Developer', 2000, 'Full Stack Developer', 2000, 'React Developer', 2000, 'Node.js Developer', 2000];

  const socialLinks = [
    profile?.social?.github   && { icon: FiGithub,   href: profile.social.github,    label: 'GitHub' },
    profile?.social?.linkedin && { icon: FiLinkedin,  href: profile.social.linkedin,  label: 'LinkedIn' },
    profile?.social?.twitter  && { icon: FiTwitter,   href: profile.social.twitter,   label: 'Twitter' },
    profile?.email            && { icon: FiMail,      href: `mailto:${profile.email}`, label: 'Email' },
  ].filter(Boolean) as { icon: React.ElementType; href: string; label: string }[];

  const stats = [
    { value: profile?.stats?.yearsExperience   ? `${profile.stats.yearsExperience}+`  : '2+',  label: 'Years Exp.' },
    { value: profile?.stats?.projectsCompleted ? `${profile.stats.projectsCompleted}+` : '10+', label: 'Projects' },
    { value: profile?.stats?.clientsSatisfied  ? `${profile.stats.clientsSatisfied}+`  : '5+',  label: 'Clients' },
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1040 50%, #0f1a2e 100%)' }}>
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-100" />
      {/* Mouse glow */}
      <div ref={gridRef} className="absolute inset-0 transition-all duration-500" />
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse-slow" style={{ background: 'radial-gradient(circle, #6c63ff, transparent)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl animate-pulse-slow" style={{ background: 'radial-gradient(circle, #a855f7, transparent)', animationDelay: '1s' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-28 pb-16 text-center w-full">

        {/* Available badge */}
        {profile?.settings?.availableForWork !== false && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/30 bg-green-500/5 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-mono tracking-wider">Available for Work</span>
          </motion.div>
        )}

        {/* Name */}
        <motion.div variants={STAGGER_CONTAINER} initial="hidden" animate="visible">
          <motion.p variants={FADE_UP} className="font-mono text-sm tracking-[0.3em] uppercase mb-3" style={{ color: '#a855f7' }}>
            Hello, I'm
          </motion.p>
          <motion.h1 variants={FADE_UP} className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-4">
            {profile?.name || 'Usama Butt'}
          </motion.h1>

          {/* Typewriter */}
          <motion.div variants={FADE_UP} className="text-xl md:text-2xl font-body mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <TypeAnimation
              sequence={roles as (string | number)[]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="font-semibold text-gradient"
            />
          </motion.div>
        </motion.div>

        {/* Bio */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="font-body text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.45)' }}
        >
          {profile?.shortBio || 'MERN Stack Developer building production web applications with React, Node.js, Express and MongoDB.'}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-10"
        >
          <Link to="/projects" className="btn-primary flex items-center gap-2">
            View My Work
            <FiArrowDown size={16} />
          </Link>

          {/* CV Download */}
          {profile?.resume?.url ? (
            <a href={profile.resume.url} target="_blank" rel="noopener noreferrer" download
              className="btn-outline flex items-center gap-2">
              <FiDownload size={16} />
              Download CV
            </a>
          ) : (
            <Link to="/contact" className="btn-outline">
              Hire Me
            </Link>
          )}
        </motion.div>

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="flex items-center justify-center gap-4 mb-16"
          >
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#6c63ff'; (e.currentTarget as HTMLElement).style.color = '#6c63ff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}
              >
                <Icon size={17} />
              </a>
            ))}
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="grid grid-cols-3 gap-6 max-w-sm mx-auto mb-16"
        >
          {stats.map(stat => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-3xl font-bold text-gradient">{stat.value}</div>
              <div className="font-mono text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Tech Icons Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] mb-6" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Technologies I Work With
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {techIcons.map(tech => (
              <div key={tech.name} className="group flex flex-col items-center gap-2 cursor-default">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <img src={tech.icon} alt={tech.name} className="w-7 h-7 object-contain"
                    onError={(e) => {
                      // Fallback: show colored letter if icon fails
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <span className="font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: tech.color }}>
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
