// src/pages/admin/AdminExperience.tsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave } from 'react-icons/fi';
import { experienceAPI } from '@/services/api';
import { Experience } from '@/types';
import { formatDate } from '@/utils';
import { cn } from '@/utils';

const inputCls = 'w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-sm font-body text-white placeholder:text-white/20 focus:outline-none focus:border-cyan/50 transition-all';

interface ExpForm {
  company: string; position: string; description: string;
  startDate: string; endDate: string; isCurrent: boolean;
  location: string; type: string; techUsed: string; responsibilities: string;
}

const AdminExperience = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, setValue, watch } = useForm<ExpForm>();
  const isCurrent = watch('isCurrent');

  const fetchExperiences = async () => {
    try {
      const res = await experienceAPI.getAll();
      setExperiences(res.data.experiences);
    } catch { toast.error('Failed to load experiences'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchExperiences(); }, []);

  const openEdit = (exp: Experience) => {
    setEditingId(exp._id);
    setValue('company', exp.company);
    setValue('position', exp.position);
    setValue('description', exp.description);
    setValue('startDate', exp.startDate?.split('T')[0] || '');
    setValue('endDate', exp.endDate?.split('T')[0] || '');
    setValue('isCurrent', exp.isCurrent);
    setValue('location', exp.location || '');
    setValue('type', exp.type);
    setValue('techUsed', exp.techUsed?.join(', ') || '');
    setValue('responsibilities', exp.responsibilities?.join('\n') || '');
    setShowForm(true);
  };

  const onSubmit = async (data: ExpForm) => {
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        techUsed: data.techUsed.split(',').map(t => t.trim()).filter(Boolean),
        responsibilities: data.responsibilities.split('\n').map(r => r.trim()).filter(Boolean),
        endDate: data.isCurrent ? null : data.endDate,
      };
      if (editingId) {
        await experienceAPI.update(editingId, payload);
        toast.success('Experience updated!');
      } else {
        await experienceAPI.create(payload);
        toast.success('Experience added!');
      }
      reset(); setShowForm(false); setEditingId(null);
      fetchExperiences();
    } catch { toast.error('Failed to save experience'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this experience?')) return;
    try {
      await experienceAPI.delete(id);
      toast.success('Experience deleted');
      setExperiences(prev => prev.filter(e => e._id !== id));
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="min-h-screen bg-dark p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-2xl font-bold text-white">Experience</h1>
          <button
            onClick={() => { setShowForm(true); setEditingId(null); reset(); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan text-dark font-semibold text-sm hover:shadow-cyan transition-all"
          >
            <FiPlus size={16} /> Add Experience
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="bg-dark-200 rounded-xl h-24 animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-4">
            {experiences.map(exp => (
              <motion.div key={exp._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-dark-200 rounded-xl p-5 border border-white/5 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display text-base font-semibold text-white">{exp.position}</h3>
                    {exp.isCurrent && <span className="px-2 py-0.5 text-xs font-mono rounded-full bg-cyan/10 text-cyan border border-cyan/20">Current</span>}
                  </div>
                  <p className="font-body text-sm text-cyan">{exp.company}</p>
                  <p className="font-mono text-xs text-white/30 mt-1">
                    {formatDate(exp.startDate)} — {exp.isCurrent ? 'Present' : formatDate(exp.endDate!)}
                    {exp.location && ` • ${exp.location}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(exp)}
                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-cyan hover:bg-cyan/10 transition-all">
                    <FiEdit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(exp._id)}
                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
            {experiences.length === 0 && (
              <div className="text-center py-16 text-white/20 font-body">No experience entries yet.</div>
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
                <h2 className="font-display text-lg font-bold text-white">{editingId ? 'Edit Experience' : 'Add Experience'}</h2>
                <button onClick={() => { setShowForm(false); reset(); }} className="text-white/40 hover:text-white"><FiX size={18} /></button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input {...register('company', { required: true })} placeholder="Company Name" className={inputCls} />
                  <input {...register('position', { required: true })} placeholder="Your Position" className={inputCls} />
                  <input {...register('location')} placeholder="Location (e.g. Remote)" className={inputCls} />
                  <select {...register('type')} className={inputCls}>
                    {['full-time', 'part-time', 'freelance', 'internship', 'contract'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <div>
                    <label className="font-mono text-xs text-white/30 mb-1 block">Start Date</label>
                    <input type="date" {...register('startDate', { required: true })} className={inputCls} />
                  </div>
                  <div>
                    <label className="font-mono text-xs text-white/30 mb-1 block">End Date</label>
                    <input type="date" {...register('endDate')} disabled={isCurrent} className={cn(inputCls, isCurrent && 'opacity-30')} />
                  </div>
                  <div className="col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" {...register('isCurrent')} className="accent-cyan" />
                      <span className="font-body text-sm text-white/60">I currently work here</span>
                    </label>
                  </div>
                  <div className="col-span-2">
                    <textarea {...register('description', { required: true })} placeholder="Role description" rows={3} className={cn(inputCls, 'resize-none')} />
                  </div>
                  <div className="col-span-2">
                    <textarea {...register('responsibilities')} placeholder="Key responsibilities (one per line)" rows={4} className={cn(inputCls, 'resize-none')} />
                  </div>
                  <div className="col-span-2">
                    <input {...register('techUsed')} placeholder="Technologies used (comma separated)" className={inputCls} />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={submitting}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan text-dark font-semibold text-sm hover:shadow-cyan transition-all disabled:opacity-60">
                    <FiSave size={16} />{submitting ? 'Saving...' : editingId ? 'Update' : 'Add Experience'}
                  </button>
                  <button type="button" onClick={() => { setShowForm(false); reset(); }}
                    className="px-6 py-3 rounded-xl border border-white/10 text-white/40 text-sm hover:border-white/20 transition-all">Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminExperience;
