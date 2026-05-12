// src/pages/admin/AdminDashboard.tsx
// Main admin dashboard with stats and quick actions

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiGrid, FiCode, FiAward, FiBriefcase, FiMail, FiFileText, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { projectsAPI, skillsAPI, experienceAPI, contactAPI, blogsAPI } from '@/services/api';
import { STAGGER_CONTAINER, SCALE_IN } from '@/constants';
import toast from 'react-hot-toast';

interface Stats {
  projects: number;
  skills: number;
  experience: number;
  messages: number;
  blogs: number;
}

const StatCard = ({ icon: Icon, label, value, href, color }: {
  icon: React.ElementType; label: string; value: number | string;
  href: string; color: string;
}) => (
  <Link to={href}>
    <motion.div
      variants={SCALE_IN}
      whileHover={{ scale: 1.02 }}
      className="bg-dark-200 rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
          <Icon size={20} style={{ color }} />
        </div>
        <span className="font-display text-3xl font-bold text-white">{value}</span>
      </div>
      <p className="font-body text-sm text-white/40">{label}</p>
    </motion.div>
  </Link>
);

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({ projects: 0, skills: 0, experience: 0, messages: 0, blogs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [p, s, e, c, b] = await Promise.allSettled([
          projectsAPI.getAll(),
          skillsAPI.getAll(),
          experienceAPI.getAll(),
          contactAPI.getAll(),
          blogsAPI.getAll(),
        ]);
        setStats({
          projects:   p.status === 'fulfilled' ? p.value.data.count || 0 : 0,
          skills:     s.status === 'fulfilled' ? s.value.data.skills?.length || 0 : 0,
          experience: e.status === 'fulfilled' ? e.value.data.experiences?.length || 0 : 0,
          messages:   c.status === 'fulfilled' ? c.value.data.pagination?.total || 0 : 0,
          blogs:      b.status === 'fulfilled' ? b.value.data.blogs?.length || 0 : 0,
        });
      } catch { /* silent */ } finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const cards = [
    { icon: FiCode,      label: 'Projects',    value: stats.projects,   href: '/admin/projects',   color: '#00f5ff' },
    { icon: FiAward,     label: 'Skills',       value: stats.skills,     href: '/admin/skills',     color: '#7c3aed' },
    { icon: FiBriefcase, label: 'Experience',   value: stats.experience, href: '/admin/experience', color: '#f59e0b' },
    { icon: FiMail,      label: 'Messages',     value: stats.messages,   href: '/admin/messages',   color: '#ef4444' },
    { icon: FiFileText,  label: 'Blog Posts',   value: stats.blogs,      href: '/admin/blogs',      color: '#10b981' },
  ];

  return (
    <div className="min-h-screen bg-dark">
      {/* Admin Navbar */}
      <header className="bg-dark-100 border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan/10 flex items-center justify-center">
            <FiGrid size={16} className="text-cyan" />
          </div>
          <span className="font-display font-bold text-white">Admin Panel</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm text-white/40 hover:text-white transition-colors font-body">
            View Site
          </Link>
          <div className="flex items-center gap-2 text-sm text-white/40 font-body">
            <FiUser size={14} />
            {user?.name}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 transition-colors font-body"
          >
            <FiLogOut size={14} />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="font-display text-3xl font-bold text-white">
            Welcome back, <span className="text-cyan">{user?.name}</span> 👋
          </h1>
          <p className="font-body text-white/30 mt-1">Here's your portfolio overview.</p>
        </motion.div>

        {/* Stats Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-dark-200 rounded-2xl h-32 animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div
            variants={STAGGER_CONTAINER}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10"
          >
            {cards.map(c => <StatCard key={c.label} {...c} />)}
          </motion.div>
        )}

        {/* Quick Actions */}
        <div className="bg-dark-200 rounded-2xl border border-white/5 p-6">
          <h2 className="font-display text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Add Project',    href: '/admin/projects',   color: '#00f5ff' },
              { label: 'Add Skill',      href: '/admin/skills',     color: '#7c3aed' },
              { label: 'Add Experience', href: '/admin/experience', color: '#f59e0b' },
              { label: 'Write Blog',     href: '/admin/blogs',      color: '#10b981' },
            ].map(action => (
              <Link
                key={action.label}
                to={action.href}
                className="flex items-center justify-center p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-sm font-body transition-all duration-300"
                style={{ color: action.color }}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
