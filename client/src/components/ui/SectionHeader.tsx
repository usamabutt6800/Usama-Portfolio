// src/components/ui/SectionHeader.tsx
import { motion } from 'framer-motion';

interface Props {
  eyebrow?: string;
  title: string;
  highlight?: string;
  description?: string;
  center?: boolean;
}

export const SectionHeader = ({ eyebrow, title, highlight, description, center = true }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className={`mb-14 ${center ? 'text-center' : ''}`}
  >
    {eyebrow && (
      <span className="font-mono text-xs uppercase tracking-[0.3em] mb-3 block text-gradient">
        {eyebrow}
      </span>
    )}
    <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight">
      {title}{' '}
      {highlight && <span className="text-gradient">{highlight}</span>}
    </h2>
    {description && (
      <p className="mt-4 max-w-2xl mx-auto font-body text-base leading-relaxed"
        style={{ color: 'rgba(255,255,255,0.4)' }}>
        {description}
      </p>
    )}
    {/* Underline decoration */}
    <div className="flex items-center justify-center mt-5 gap-2">
      <div className="h-px w-12 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #6c63ff)' }} />
      <div className="w-2 h-2 rounded-full" style={{ background: '#6c63ff' }} />
      <div className="h-px w-12 rounded-full" style={{ background: 'linear-gradient(90deg, #a855f7, transparent)' }} />
    </div>
  </motion.div>
);
