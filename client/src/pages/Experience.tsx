// src/pages/Experience.tsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiBriefcase } from 'react-icons/fi';
import { experienceAPI } from '@/services/api';
import { Experience as ExperienceType } from '@/types';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FADE_UP } from '@/constants';
import { formatDate, getDuration } from '@/utils';

const ExperienceCard = ({ exp, index }: { exp: ExperienceType; index: number }) => (
  <motion.div
    variants={FADE_UP}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="relative pl-10 pb-10 last:pb-0"
  >
    {/* Timeline line */}
    <div className="absolute left-3 top-4 bottom-0 w-px" style={{ background: 'rgba(108,99,255,0.2)' }} />
    {/* Timeline dot */}
    <div
      className="absolute left-0 top-3 w-6 h-6 rounded-full flex items-center justify-center"
      style={exp.isCurrent ? {
        background: 'linear-gradient(135deg, #6c63ff, #a855f7)',
        boxShadow: '0 0 15px rgba(108,99,255,0.5)',
      } : {
        background: 'rgba(255,255,255,0.05)',
        border: '2px solid rgba(255,255,255,0.1)',
      }}
    >
      <div className="w-2 h-2 rounded-full bg-white opacity-80" />
    </div>

    {/* Card */}
    <div className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(108,99,255,0.25)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'}
    >
      <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-white">{exp.position}</h3>
          <p className="font-body text-sm text-gradient mt-0.5">{exp.company}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          {exp.isCurrent && (
            <span className="px-3 py-1 rounded-full text-xs font-mono text-white"
              style={{ background: 'linear-gradient(135deg, #6c63ff, #a855f7)' }}>
              Current
            </span>
          )}
          <div className="flex items-center gap-1.5 font-mono text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <FiCalendar size={11} />
            {formatDate(exp.startDate)} — {exp.isCurrent ? 'Present' : formatDate(exp.endDate!)}
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>({getDuration(exp.startDate, exp.endDate)})</span>
          </div>
          {exp.location && (
            <div className="flex items-center gap-1 font-body text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
              <FiMapPin size={11} /> {exp.location}
            </div>
          )}
        </div>
      </div>

      <p className="font-body text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>
        {exp.description}
      </p>

      {exp.responsibilities?.length > 0 && (
        <ul className="space-y-1.5 mb-4">
          {exp.responsibilities.map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-sm font-body" style={{ color: 'rgba(255,255,255,0.35)' }}>
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#6c63ff' }} />
              {r}
            </li>
          ))}
        </ul>
      )}

      {exp.techUsed?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {exp.techUsed.map(tech => (
            <span key={tech} className="px-2.5 py-1 rounded-lg text-xs font-mono"
              style={{ background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)', color: '#a78bfa' }}>
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  </motion.div>
);

const Experience = () => {
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    experienceAPI.getAll()
      .then(res => setExperiences(res.data.experiences))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-28 pb-24" style={{ background: '#0f0f1a' }}>
      <div className="max-w-4xl mx-auto px-6">
        <SectionHeader
          eyebrow="My Journey"
          title="Work"
          highlight="Experience"
          description="Companies I've worked with and the impact I've made along the way."
        />

        {loading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-48 rounded-2xl animate-pulse ml-10"
                style={{ background: 'rgba(255,255,255,0.04)' }} />
            ))}
          </div>
        ) : experiences.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center gap-3" style={{ color: 'rgba(255,255,255,0.2)' }}>
            <FiBriefcase size={40} className="opacity-20" />
            <p className="font-body">No experience entries yet.</p>
          </div>
        ) : (
          <div>
            {experiences.map((exp, i) => (
              <ExperienceCard key={exp._id} exp={exp} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Experience;
