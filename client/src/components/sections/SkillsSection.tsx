// src/components/sections/SkillsSection.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { skillsAPI } from '@/services/api';
import { Skill } from '@/types';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SKILL_CATEGORIES, STAGGER_CONTAINER, FADE_UP } from '@/constants';

const SkillCard = ({ skill }: { skill: Skill }) => (
  <motion.div
    variants={FADE_UP}
    className="p-4 rounded-2xl transition-all duration-300 hover:-translate-y-1 group"
    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
    onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = `${skill.color || '#6c63ff'}40`}
    onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'}
  >
    <div className="flex justify-between items-center mb-3">
      <span className="font-body text-sm text-white font-medium">{skill.name}</span>
      <span className="font-mono text-xs" style={{ color: skill.color || '#6c63ff' }}>{skill.level}%</span>
    </div>
    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${skill.level}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        className="h-full rounded-full"
        style={{ background: `linear-gradient(90deg, ${skill.color || '#6c63ff'}, ${skill.color || '#a855f7'})` }}
      />
    </div>
  </motion.div>
);

const SkillsSection = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    skillsAPI.getAll()
      .then(res => setSkills(res.data.skills))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const grouped = SKILL_CATEGORIES.map(cat => ({
    ...cat,
    skills: skills.filter(s => s.category === cat.value),
  })).filter(cat => cat.skills.length > 0);

  return (
    <section className="py-24" style={{ background: 'rgba(255,255,255,0.02)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          eyebrow="What I Know"
          title="Technical"
          highlight="Skills"
          description="Technologies and tools I work with to build scalable, modern applications."
        />

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-16 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
            ))}
          </div>
        ) : grouped.length === 0 ? (
          <p className="text-center py-12 font-body" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Add skills from Admin → Skills
          </p>
        ) : (
          <div className="space-y-10">
            {grouped.map(cat => (
              <div key={cat.value}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-3 h-3 rounded-full" style={{ background: cat.color }} />
                  <span className="font-mono text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    {cat.label}
                  </span>
                  <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
                </div>
                <motion.div
                  variants={STAGGER_CONTAINER}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
                >
                  {cat.skills.map(skill => <SkillCard key={skill._id} skill={skill} />)}
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SkillsSection;
