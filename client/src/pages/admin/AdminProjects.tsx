// src/pages/admin/AdminProjects.tsx
// Full CRUD for projects in admin panel

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave } from 'react-icons/fi';
import { projectsAPI } from '@/services/api';
import { Project } from '@/types';
import { PROJECT_CATEGORIES } from '@/constants';
import { cn } from '@/utils';

// Reusable input style
const inputCls = 'w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-sm font-body text-white placeholder:text-white/20 focus:outline-none focus:border-cyan/50 transition-all';

interface ProjectForm {
  title: string; description: string; longDescription: string;
  category: string; liveUrl: string; githubUrl: string;
  techStack: string; featured: boolean; status: string;
}

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProjectForm>();

  const fetchProjects = async () => {
    try {
      const res = await projectsAPI.getAll();
      setProjects(res.data.projects);
    } catch { toast.error('Failed to load projects'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProjects(); }, []);

  const openEdit = (project: Project) => {
    setEditingId(project._id);
    setValue('title', project.title);
    setValue('description', project.description);
    setValue('longDescription', project.longDescription || '');
    setValue('category', project.category);
    setValue('liveUrl', project.liveUrl || '');
    setValue('githubUrl', project.githubUrl || '');
    setValue('techStack', project.techStack?.join(', ') || '');
    setValue('featured', project.featured);
    setValue('status', project.status);
    setShowForm(true);
  };

  const onSubmit = async (data: ProjectForm) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => formData.append(k, String(v)));
      // Convert comma-separated tech to array

      formData.set('techStack', data.techStack);
      if (thumbnail) formData.append('thumbnail', thumbnail);

      if (editingId) {
        await projectsAPI.update(editingId, formData);
        toast.success('Project updated!');
      } else {
        await projectsAPI.create(formData);
        toast.success('Project created!');
      }
      reset(); setShowForm(false); setEditingId(null); setThumbnail(null);
      fetchProjects();
    } catch { toast.error('Failed to save project'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    try {
      await projectsAPI.delete(id);
      toast.success('Project deleted');
      setProjects(prev => prev.filter(p => p._id !== id));
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="min-h-screen bg-dark p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-2xl font-bold text-white">Projects</h1>
          <button
            onClick={() => { setShowForm(true); setEditingId(null); reset(); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan text-dark font-semibold text-sm hover:shadow-cyan transition-all"
          >
            <FiPlus size={16} /> Add Project
          </button>
        </div>

        {/* Projects List */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-dark-200 rounded-xl h-16 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map(project => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-4 bg-dark-200 rounded-xl p-4 border border-white/5"
              >
                {/* Thumbnail */}
                <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  {project.thumbnail?.url ? (
                    <img src={project.thumbnail.url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-dark-300 flex items-center justify-center">
                      <span className="text-white/20 text-xs font-mono">IMG</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-body text-sm font-medium text-white truncate">{project.title}</h3>
                    {project.featured && (
                      <span className="px-2 py-0.5 rounded-full bg-cyan/10 text-cyan text-xs font-mono">Featured</span>
                    )}
                  </div>
                  <p className="font-mono text-xs text-white/30 capitalize">{project.category} • {project.status}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(project)}
                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-cyan hover:bg-cyan/10 transition-all">
                    <FiEdit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(project._id)}
                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
            {projects.length === 0 && (
              <div className="text-center py-16 text-white/20 font-body">
                No projects yet. Click "Add Project" to get started.
              </div>
            )}
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-2xl bg-dark-200 rounded-2xl border border-white/10 shadow-glass max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-dark-200 flex items-center justify-between px-6 py-4 border-b border-white/5">
                <h2 className="font-display text-lg font-bold text-white">
                  {editingId ? 'Edit Project' : 'New Project'}
                </h2>
                <button onClick={() => { setShowForm(false); reset(); }}
                  className="w-8 h-8 rounded-lg text-white/40 hover:text-white flex items-center justify-center">
                  <FiX size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <input {...register('title', { required: true })} placeholder="Project Title" className={inputCls} />
                  </div>
                  <div className="col-span-2">
                    <textarea {...register('description', { required: true })} placeholder="Short description" rows={2} className={cn(inputCls, 'resize-none')} />
                  </div>
                  <div className="col-span-2">
                    <textarea {...register('longDescription')} placeholder="Long description (optional)" rows={3} className={cn(inputCls, 'resize-none')} />
                  </div>
                  <div>
                    <select {...register('category')} className={inputCls}>
                      {PROJECT_CATEGORIES.filter(c => c.value !== 'all').map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <select {...register('status')} className={inputCls}>
                      <option value="completed">Completed</option>
                      <option value="in-progress">In Progress</option>
                      <option value="planned">Planned</option>
                    </select>
                  </div>
                  <div>
                    <input {...register('liveUrl')} placeholder="Live URL (optional)" className={inputCls} />
                  </div>
                  <div>
                    <input {...register('githubUrl')} placeholder="GitHub URL (optional)" className={inputCls} />
                  </div>
                  <div className="col-span-2">
                    <input {...register('techStack')} placeholder="Tech stack (comma separated): React, Node.js, MongoDB" className={inputCls} />
                  </div>
                  <div className="col-span-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" {...register('featured')} className="w-4 h-4 accent-cyan rounded" />
                      <span className="font-body text-sm text-white/60">Mark as Featured</span>
                    </label>
                  </div>
                  <div className="col-span-2">
                    <label className="block font-body text-xs text-white/40 mb-2 uppercase tracking-wider">Thumbnail Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                      className="w-full text-sm text-white/40 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan/10 file:text-cyan file:text-sm file:font-mono cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan text-dark font-semibold text-sm hover:shadow-cyan transition-all disabled:opacity-60"
                  >
                    <FiSave size={16} />
                    {submitting ? 'Saving...' : (editingId ? 'Update Project' : 'Create Project')}
                  </button>
                  <button type="button" onClick={() => { setShowForm(false); reset(); }}
                    className="px-6 py-3 rounded-xl border border-white/10 text-white/40 text-sm hover:border-white/20 transition-all">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProjects;
