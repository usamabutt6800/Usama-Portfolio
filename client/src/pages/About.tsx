// src/pages/About.tsx
import { motion } from 'framer-motion';
import { FiDownload, FiMail, FiMapPin, FiGithub, FiLinkedin, FiCalendar, FiBook } from 'react-icons/fi';
import { useProfile } from '@/context/ProfileContext';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FADE_UP, STAGGER_CONTAINER } from '@/constants';

const About = () => {
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f0f1a' }}>
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#6c63ff', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const stats = [
    { icon: FiCalendar, value: profile?.stats?.yearsExperience ? `${profile.stats.yearsExperience}+` : '2+', label: 'Years Experience', color: '#6c63ff' },
    { icon: FiBook,     value: profile?.stats?.projectsCompleted ? `${profile.stats.projectsCompleted}+` : '10+', label: 'Projects Completed', color: '#a855f7' },
    { icon: FiMail,     value: profile?.stats?.clientsSatisfied ? `${profile.stats.clientsSatisfied}+` : '5+', label: 'Happy Clients', color: '#06b6d4' },
  ];

  const socials = [
    profile?.social?.github   && { icon: FiGithub,   href: profile.social.github,    label: 'GitHub' },
    profile?.social?.linkedin && { icon: FiLinkedin,  href: profile.social.linkedin,  label: 'LinkedIn' },
    profile?.email            && { icon: FiMail,      href: `mailto:${profile.email}`, label: 'Email' },
  ].filter(Boolean) as { icon: React.ElementType; href: string; label: string }[];

  return (
    <div id="about-section" className="min-h-screen pt-28 pb-24" style={{ background: '#0f0f1a' }}>
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader eyebrow="Who I Am" title="About" highlight="Me" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative w-full max-w-sm mx-auto aspect-square">
              {/* Glow */}
              <div className="absolute inset-0 rounded-3xl blur-2xl scale-105 opacity-40"
                style={{ background: 'linear-gradient(135deg, #6c63ff, #a855f7)' }} />

              {profile?.avatar?.url ? (
                <img src={profile.avatar.url} alt={profile.name}
                  className="relative rounded-3xl w-full h-full object-cover"
                  style={{ border: '1px solid rgba(255,255,255,0.1)' }} />
              ) : (
                <div className="relative rounded-3xl w-full h-full flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span className="font-display text-8xl font-bold" style={{ color: 'rgba(255,255,255,0.08)' }}>
                    {profile?.name?.split(' ').map(w => w[0]).join('').slice(0, 2) || 'UB'}
                  </span>
                </div>
              )}

              {/* Available badge */}
              {profile?.settings?.availableForWork !== false && (
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2.5 rounded-full"
                  style={{ background: 'rgba(15,15,26,0.9)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="font-mono text-xs text-green-400">Open to Work</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div variants={STAGGER_CONTAINER} initial="hidden" animate="visible">
            <motion.h2 variants={FADE_UP} className="font-display text-3xl md:text-4xl font-bold text-white mb-1">
              {profile?.name || 'Usama Butt'}
            </motion.h2>
            <motion.p variants={FADE_UP} className="font-mono text-sm mb-4 text-gradient">
              {profile?.title || 'MERN Stack Developer'}
            </motion.p>

            {/* Location & Email */}
            <motion.div variants={FADE_UP} className="flex flex-wrap gap-4 mb-6">
              {profile?.location && (
                <span className="flex items-center gap-1.5 text-sm font-body" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  <FiMapPin size={13} /> {profile.location}
                </span>
              )}
              {profile?.email && (
                <a href={`mailto:${profile.email}`}
                  className="flex items-center gap-1.5 text-sm font-body transition-colors"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#6c63ff'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)'}
                >
                  <FiMail size={13} /> {profile.email}
                </a>
              )}
            </motion.div>

            <motion.p variants={FADE_UP} className="font-body leading-relaxed mb-8 whitespace-pre-line"
              style={{ color: 'rgba(255,255,255,0.45)', fontSize: '15px' }}>
              {profile?.bio || 'MERN Stack Developer with experience building production web applications.'}
            </motion.p>

            {/* Social + Resume */}
            <motion.div variants={FADE_UP} className="flex flex-wrap items-center gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#6c63ff'; (e.currentTarget as HTMLElement).style.color = '#6c63ff'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)'; }}
                >
                  <Icon size={16} />
                </a>
              ))}
              {profile?.resume?.url && (
                <a href={profile.resume.url} target="_blank" rel="noopener noreferrer" download
                  className="btn-primary flex items-center gap-2 text-sm">
                  <FiDownload size={15} /> Download CV
                </a>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {stats.map(stat => (
            <div key={stat.label} className="glass p-8 text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}>
                <stat.icon size={22} style={{ color: stat.color }} />
              </div>
              <div className="font-display text-4xl font-bold mb-1" style={{ color: stat.color }}>{stat.value}</div>
              <div className="font-body text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default About;
