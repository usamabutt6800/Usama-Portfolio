// src/components/layout/AdminLayout.tsx
// Shared layout for all admin pages — sidebar + header

import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGrid, FiCode, FiAward, FiBriefcase,
  FiMail, FiFileText, FiUser, FiLogOut,
  FiExternalLink, FiMenu, FiX,
} from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/utils';
import toast from 'react-hot-toast';

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: FiGrid },
  { label: 'Projects',  path: '/admin/projects',  icon: FiCode },
  { label: 'Skills',    path: '/admin/skills',    icon: FiAward },
  { label: 'Experience',path: '/admin/experience',icon: FiBriefcase },
  { label: 'Messages',  path: '/admin/messages',  icon: FiMail },
  { label: 'Blogs',     path: '/admin/blogs',     icon: FiFileText },
  { label: 'Profile',   path: '/admin/profile',   icon: FiUser },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5">
        <Link to="/admin/dashboard" className="font-display text-lg font-bold text-white">
          Admin<span className="text-cyan">.</span>
        </Link>
        <p className="font-mono text-xs text-white/20 mt-0.5">{user?.email}</p>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body transition-all duration-200',
                isActive
                  ? 'bg-cyan/10 text-cyan border border-cyan/20'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              )}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="px-3 py-4 border-t border-white/5 space-y-1">
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body text-white/30 hover:text-white hover:bg-white/5 transition-all"
        >
          <FiExternalLink size={16} />
          View Site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-all"
        >
          <FiLogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-dark-100 border-r border-white/5 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-dark/80 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-56 bg-dark-100 border-r border-white/5 md:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-dark-100 border-b border-white/5">
          <button onClick={() => setSidebarOpen(true)} className="text-white/60 hover:text-white">
            <FiMenu size={22} />
          </button>
          <span className="font-display font-bold text-white">Admin Panel</span>
          <Link to="/" target="_blank" className="text-white/40 hover:text-cyan">
            <FiExternalLink size={18} />
          </Link>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
