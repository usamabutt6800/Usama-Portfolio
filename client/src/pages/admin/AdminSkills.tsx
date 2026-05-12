// src/pages/admin/AdminSkills.tsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave } from 'react-icons/fi';
import { skillsAPI } from '@/services/api';
import { Skill } from '@/types';
import { SKILL_CATEGORIES } from '@/constants';
import { cn } from '@/utils';

const inputCls = 'w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-sm font-body text-white placeholder:text-white/20 focus:outline-none focus:border-cyan/50 transition-all';

interface SkillForm {
  name: string; category: string; level: number; color: string; order: number;
}

const AdminSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm<SkillForm>({
    defaultValues: { level: 80, color: '#00f5ff', order: 0 },
  });

  const fetchSkills = async () => {
    try {
      const res = await skillsAPI.getAll();
      setSkills(res.data.skills);
    } catch { toast.error('Failed to load skills'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSkills(); }, []);

  const openEdit = (skill: Skill) => {
    setEditingId(skill._id);
    setValue('name', skill.name);
    setValue('category', skill.category);
    setValue('level', skill.level);
    setValue('color', skill.color || '#00f5ff');
    setValue('order', skill.order || 0);
    setShowForm(true);
  };

  const onSubmit = async (data: SkillForm) => {
    setSubmitting(true);
    try {
      if (editingId) {
        await skillsAPI.update(editingId, data);
        toast.success('Skill updated!');
      } else {
        await skillsAPI.create(data);
        toast.success('Skill added!');
      }
      reset({ level: 80, color: '#00f5ff', order: 0 });
      setShowForm(false); setEditingId(null);
      fetchSkills();
    } catch { toast.error('Failed to save skill'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this skill?')) return;
    try {
      await skillsAPI.delete(id);
      toast.success('Skill deleted');
      setSkills(prev => prev.filter(s => s._id !== id));
    } catch { toast.error('Failed to delete'); }
  };

  // Group by category for display
  const grouped = SKILL_CATEGORIES.map(cat => ({
    ...cat,
    skills: skills.filter(s => s.category === cat.value),
  })).filter(g => g.skills.length > 0);

  return (
    <div className="min-h-screen bg-dark p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-2xl font-bold text-white">Skills</h1>
          <button
            onClick={() => { setShowForm(true); setEditingId(null); reset({ level: 80, color: '#00f5ff', order: 0 }); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan text-dark font-semibold text-sm hover:shadow-cyan transition-all"
          >
            <FiPlus size={16} /> Add Skill
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-dark-200 rounded-xl h-16 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {grouped.map(cat => (
              <div key={cat.value}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
                  <span className="font-mono text-xs uppercase tracking-widest text-white/30">{cat.label}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {cat.skills.map(skill => (
                    <motion.div
                      key={skill._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-dark-200 rounded-xl p-3 border border-white/5 group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-body text-sm text-white">{skill.name}</span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(skill)}
                            className="w-6 h-6 rounded text-white/30 hover:text-cyan flex items-center justify-center">
                            <FiEdit2 size={11} />
                          </button>
                          <button onClick={() => handleDelete(skill._id)}
                            className="w-6 h-6 rounded text-white/30 hover:text-red-400 flex items-center justify-center">
                            <FiTrash2 size={11} />
                          </button>
                        </div>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full">
                        <div className="h-full rounded-full" style={{ width: `${skill.level}%`, background: skill.color || '#00f5ff' }} />
                      </div>
                      <span className="font-mono text-xs text-white/20 mt-1 block">{skill.level}%</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
            {skills.length === 0 && (
              <div className="text-center py-16 text-white/20 font-body">No skills yet. Add your first skill!</div>
            )}
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md bg-dark-200 rounded-2xl border border-white/10 shadow-glass"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <h2 className="font-display text-lg font-bold text-white">{editingId ? 'Edit Skill' : 'Add Skill'}</h2>
                <button onClick={() => { setShowForm(false); reset(); }} className="text-white/40 hover:text-white"><FiX size={18} /></button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                <input {...register('name', { required: true })} placeholder="Skill name (e.g. React.js)" className={inputCls} />
                <select {...register('category')} className={inputCls}>
                  {SKILL_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
                <div>
                  <label className="font-mono text-xs text-white/30 uppercase tracking-wider mb-2 block">
                    Proficiency Level: <span className="text-cyan" id="level-val">80%</span>
                  </label>
                  <input
                    type="range" min="0" max="100" step="5"
                    {...register('level', { valueAsNumber: true })}
                    className="w-full accent-cyan"
                    onChange={e => { const el = document.getElementById('level-val'); if(el) el.textContent = e.target.value + '%'; }}
                  />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="font-mono text-xs text-white/30 uppercase tracking-wider mb-2 block">Color</label>
                    <div className="flex items-center gap-2">
                      <input type="color" {...register('color')} className="w-10 h-10 rounded-lg border-0 bg-transparent cursor-pointer" />
                      <input {...register('color')} placeholder="#00f5ff" className={cn(inputCls, 'flex-1')} />
                    </div>
                  </div>
                  <div className="w-24">
                    <label className="font-mono text-xs text-white/30 uppercase tracking-wider mb-2 block">Order</label>
                    <input type="number" {...register('order', { valueAsNumber: true })} className={inputCls} />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={submitting}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan text-dark font-semibold text-sm hover:shadow-cyan transition-all disabled:opacity-60">
                    <FiSave size={16} />{submitting ? 'Saving...' : editingId ? 'Update' : 'Add Skill'}
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

export default AdminSkills;
