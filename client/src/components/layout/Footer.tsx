// src/components/layout/Footer.tsx
import { Link } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiTwitter, FiMail, FiInstagram, FiHeart } from 'react-icons/fi';
import { NAV_LINKS } from '@/constants';
import { useProfile } from '@/context/ProfileContext';

const Footer = () => {
  const { profile } = useProfile();
  const year = new Date().getFullYear();

  const socialLinks = [
    profile?.social?.github    && { icon: FiGithub,   href: profile.social.github,    label: 'GitHub' },
    profile?.social?.linkedin  && { icon: FiLinkedin,  href: profile.social.linkedin,  label: 'LinkedIn' },
    profile?.social?.twitter   && { icon: FiTwitter,   href: profile.social.twitter,   label: 'Twitter' },
    profile?.social?.instagram && { icon: FiInstagram, href: profile.social.instagram, label: 'Instagram' },
    profile?.email             && { icon: FiMail,      href: `mailto:${profile.email}`, label: 'Email' },
  ].filter(Boolean) as { icon: React.ElementType; href: string; label: string }[];

  return (
    <footer style={{ background: '#0a0a14', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="font-display text-2xl font-bold">
              <span className="text-gradient">{profile?.name || 'Usama Butt'}</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed font-body" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {profile?.shortBio || 'MERN Stack Developer building production web applications.'}
            </p>
            {profile?.location && (
              <p className="mt-3 text-xs font-mono" style={{ color: 'rgba(255,255,255,0.2)' }}>
                📍 {profile.location}
              </p>
            )}
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display text-xs font-semibold uppercase tracking-widest mb-5"
              style={{ color: 'rgba(255,255,255,0.3)' }}>
              Navigation
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map(link => (
                <li key={link.path}>
                  <Link to={link.path}
                    className="text-sm font-body transition-colors duration-200"
                    style={{ color: 'rgba(255,255,255,0.35)' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#6c63ff'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)'}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-display text-xs font-semibold uppercase tracking-widest mb-5"
              style={{ color: 'rgba(255,255,255,0.3)' }}>
              Connect
            </h4>
            <div className="flex gap-3 flex-wrap mb-6">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#6c63ff'; (e.currentTarget as HTMLElement).style.color = '#6c63ff'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)'; }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>

            {profile?.settings?.availableForWork !== false && (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-mono text-green-400">Open to opportunities</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.2)' }}>
            © {year} {profile?.name || 'Usama Butt'}. All rights reserved.
          </p>
          <p className="text-xs font-body flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Built with <FiHeart size={11} className="text-red-400" /> using MERN Stack
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
