// src/components/sections/ContactSection.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiMail, FiMapPin, FiSend, FiGithub, FiLinkedin, FiTwitter, FiPhone } from 'react-icons/fi';
import { contactAPI } from '@/services/api';
import { ContactForm } from '@/types';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FADE_UP, STAGGER_CONTAINER } from '@/constants';
import { useProfile } from '@/context/ProfileContext';
import { cn } from '@/utils';

const inputClass = [
  'w-full rounded-xl px-4 py-3.5',
  'font-body text-sm text-white',
  'focus:outline-none transition-all duration-300',
].join(' ');

const inputStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'white',
};

const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { profile } = useProfile();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactForm>();

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    try {
      await contactAPI.send(data);
      toast.success("Message sent! I'll get back to you soon 🚀");
      reset();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to send. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    profile?.email    && { icon: FiMail,    label: 'Email',    value: profile.email,                                 href: `mailto:${profile.email}` },
    profile?.phone    && { icon: FiPhone,   label: 'Phone',    value: profile.phone,                                 href: `tel:${profile.phone}` },
    profile?.location && { icon: FiMapPin,  label: 'Location', value: profile.location,                              href: '#' },
    profile?.social?.github   && { icon: FiGithub,   label: 'GitHub',   value: profile.social.github.replace('https://', ''),   href: profile.social.github },
    profile?.social?.linkedin && { icon: FiLinkedin, label: 'LinkedIn', value: profile.social.linkedin.replace('https://', ''), href: profile.social.linkedin },
    profile?.social?.twitter  && { icon: FiTwitter,  label: 'Twitter',  value: profile.social.twitter.replace('https://', ''),  href: profile.social.twitter },
  ].filter(Boolean) as { icon: React.ElementType; label: string; value: string; href: string }[];

  return (
    <section id="contact" className="py-24" style={{ background: '#0f0f1a' }}>
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          eyebrow="Get In Touch"
          title="Let's Work"
          highlight="Together"
          description="Have a project in mind or want to discuss an opportunity? I'd love to hear from you."
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* ── Contact Info ──────────────────────────────────────────── */}
          <motion.div
            variants={STAGGER_CONTAINER}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-4"
          >
            <motion.p variants={FADE_UP} className="font-body leading-relaxed mb-6"
              style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px' }}>
              I'm currently available for freelance work and full-time positions.
              Whether it's a startup MVP or a complex enterprise app — let's talk.
            </motion.p>

            {contactInfo.length > 0 ? contactInfo.map(({ icon: Icon, label, value, href }) => (
              <motion.a
                key={label}
                variants={FADE_UP}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl transition-all duration-300 group"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(108,99,255,0.3)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                  style={{ background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)', color: '#6c63ff' }}>
                  <Icon size={18} />
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-xs uppercase tracking-wider mb-0.5"
                    style={{ color: 'rgba(255,255,255,0.25)' }}>{label}</div>
                  <div className="font-body text-sm truncate"
                    style={{ color: 'rgba(255,255,255,0.7)' }}>{value}</div>
                </div>
              </motion.a>
            )) : (
              <motion.div variants={FADE_UP} className="p-4 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="font-body text-sm" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  Add contact details in Admin → Profile
                </p>
              </motion.div>
            )}

            {/* Availability */}
            {profile?.settings?.availableForWork !== false && (
              <motion.div variants={FADE_UP} className="p-4 rounded-xl mt-2"
                style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="font-mono text-xs text-green-400 uppercase tracking-wider">
                    Available for Work
                  </span>
                </div>
                <p className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  Response time: within 24 hours
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* ── Contact Form ──────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-3"
          >
            <div className="p-8 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <h3 className="font-display text-lg font-semibold text-white mb-6">Send a Message</h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      placeholder="Your Name"
                      className={cn(inputClass, errors.name ? 'border-red-500/50' : '')}
                      style={{ ...inputStyle, ...(errors.name ? { borderColor: 'rgba(239,68,68,0.5)' } : {}) }}
                      onFocus={e => (e.target as HTMLElement).style.borderColor = 'rgba(108,99,255,0.5)'}
                      onBlur={e => (e.target as HTMLElement).style.borderColor = errors.name ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
                  </div>
                  <div>
                    <input
                      {...register('email', {
                        required: 'Email is required',
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                      })}
                      type="email"
                      placeholder="your@email.com"
                      className={inputClass}
                      style={{ ...inputStyle, ...(errors.email ? { borderColor: 'rgba(239,68,68,0.5)' } : {}) }}
                      onFocus={e => (e.target as HTMLElement).style.borderColor = 'rgba(108,99,255,0.5)'}
                      onBlur={e => (e.target as HTMLElement).style.borderColor = errors.email ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <input
                    {...register('subject', { required: 'Subject is required' })}
                    placeholder="Project Inquiry / Job Offer / Collaboration"
                    className={inputClass}
                    style={{ ...inputStyle, ...(errors.subject ? { borderColor: 'rgba(239,68,68,0.5)' } : {}) }}
                    onFocus={e => (e.target as HTMLElement).style.borderColor = 'rgba(108,99,255,0.5)'}
                    onBlur={e => (e.target as HTMLElement).style.borderColor = errors.subject ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}
                  />
                  {errors.subject && <p className="mt-1 text-xs text-red-400">{errors.subject.message}</p>}
                </div>

                {/* Message */}
                <div>
                  <textarea
                    {...register('message', {
                      required: 'Message is required',
                      minLength: { value: 20, message: 'Message is too short (min 20 chars)' },
                    })}
                    placeholder="Tell me about your project or opportunity..."
                    rows={6}
                    className={inputClass}
                    style={{ ...inputStyle, resize: 'none', ...(errors.message ? { borderColor: 'rgba(239,68,68,0.5)' } : {}) }}
                    onFocus={e => (e.target as HTMLElement).style.borderColor = 'rgba(108,99,255,0.5)'}
                    onBlur={e => (e.target as HTMLElement).style.borderColor = errors.message ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}
                  />
                  {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all duration-300"
                  style={isSubmitting ? {
                    background: 'rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.3)',
                    cursor: 'not-allowed',
                  } : {
                    background: 'linear-gradient(135deg, #6c63ff, #a855f7)',
                    color: 'white',
                    cursor: 'pointer',
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend size={16} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
