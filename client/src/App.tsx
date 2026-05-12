// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { ProfileProvider } from '@/context/ProfileContext';

// Layouts
import Layout from '@/components/layout/Layout';
import AdminLayout from '@/components/layout/AdminLayout';

// Public Pages
import Home from '@/pages/Home';
import About from '@/pages/About';
import Projects from '@/pages/Projects';
import Skills from '@/pages/Skills';
import Experience from '@/pages/Experience';
import Blog from '@/pages/Blog';
import Contact from '@/pages/Contact';
import NotFound from '@/pages/NotFound';

// Admin Pages
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminProjects from '@/pages/admin/AdminProjects';
import AdminSkills from '@/pages/admin/AdminSkills';
import AdminExperience from '@/pages/admin/AdminExperience';
import AdminMessages from '@/pages/admin/AdminMessages';
import AdminBlogs from '@/pages/admin/AdminBlogs';
import AdminProfile from '@/pages/admin/AdminProfile';

import ProtectedRoute from '@/routes/ProtectedRoute';
import CustomCursor from '@/components/common/CustomCursor';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProfileProvider>
          <div className="hidden md:block">
            <CustomCursor />
          </div>

          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1a1a1a',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                fontSize: '14px',
                fontFamily: 'DM Sans, sans-serif',
              },
              success: { iconTheme: { primary: '#00f5ff', secondary: '#0a0a0a' } },
              error:   { iconTheme: { primary: '#ef4444', secondary: '#ffffff' } },
            }}
          />

          <Routes>
            {/* Public */}
            <Route element={<Layout />}>
              <Route path="/"           element={<Home />} />
              <Route path="/about"      element={<About />} />
              <Route path="/projects"   element={<Projects />} />
              <Route path="/skills"     element={<Skills />} />
              <Route path="/experience" element={<Experience />} />
              <Route path="/blog"       element={<Blog />} />
              <Route path="/contact"    element={<Contact />} />
            </Route>

            {/* Admin login (no layout) */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected admin */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard"  element={<AdminDashboard />} />
                <Route path="/admin/projects"   element={<AdminProjects />} />
                <Route path="/admin/skills"     element={<AdminSkills />} />
                <Route path="/admin/experience" element={<AdminExperience />} />
                <Route path="/admin/messages"   element={<AdminMessages />} />
                <Route path="/admin/blogs"      element={<AdminBlogs />} />
                <Route path="/admin/profile"    element={<AdminProfile />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </ProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
