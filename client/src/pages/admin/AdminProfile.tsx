// src/pages/admin/AdminProfile.tsx — Fixed version
// Fixes: UI refresh after save, image preview, proper FormData sending

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiSave, FiUser, FiCheckCircle } from 'react-icons/fi';
import { profileAPI } from '@/services/api';
import { cn } from '@/utils';

const inputCls = 'w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-sm font-body text-white placeholder:text-white/20 focus:outline-none focus:border-cyan/50 transition-all';
const labelCls = 'font-mono text-xs text-white/30 uppercase tracking-wider mb-1.5 block';

interface ProfileForm {
  name: string;
  title: string;
  shortBio: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  yearsExperience: number;
  projectsCompleted: number;
  clientsSatisfied: number;
  resumeUrl: string;
  availableForWork: boolean;
}

const AdminProfile = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  const { register, handleSubmit, reset } = useForm<ProfileForm>();

  // ── Load current profile data ──────────────────────────────────────────────
  const loadProfile = async () => {
    try {
      const res = await profileAPI.get();
      const p = res.data.profile;
      setAvatarPreview(p.avatar?.url || '');
      reset({
        name:               p.name || '',
        title:              p.title || '',
        shortBio:           p.shortBio || '',
        bio:                p.bio || '',
        email:              p.email || '',
        phone:              p.phone || '',
        location:           p.location || '',
        github:             p.social?.github || '',
        linkedin:           p.social?.linkedin || '',
        twitter:            p.social?.twitter || '',
        instagram:          p.social?.instagram || '',
        yearsExperience:    p.stats?.yearsExperience || 0,
        projectsCompleted:  p.stats?.projectsCompleted || 0,
        clientsSatisfied:   p.stats?.clientsSatisfied || 0,
        resumeUrl:          p.resume?.url || '',
        availableForWork:   p.settings?.availableForWork ?? true,
      });
    } catch {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProfile(); }, []);

  // ── Handle avatar file select — show preview immediately ──────────────────
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    // Show preview instantly using FileReader
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  // ── Submit — build FormData manually with correct nested keys ─────────────
  const onSubmit = async (data: ProfileForm) => {
    setSubmitting(true);
    setSaved(false);
    try {
      const formData = new FormData();

      // Basic fields
      formData.append('name',     data.name);
      formData.append('title',    data.title);
      formData.append('shortBio', data.shortBio);
      formData.append('bio',      data.bio);
      formData.append('email',    data.email);
      formData.append('phone',    data.phone);
      formData.append('location', data.location);

      // Nested social fields — backend parseNestedFormData handles these
      formData.append('social[github]',    data.github);
      formData.append('social[linkedin]',  data.linkedin);
      formData.append('social[twitter]',   data.twitter);
      formData.append('social[instagram]', data.instagram);

      // Nested stats
      formData.append('stats[yearsExperience]',   String(data.yearsExperience   || 0));
      formData.append('stats[projectsCompleted]',  String(data.projectsCompleted  || 0));
      formData.append('stats[clientsSatisfied]',   String(data.clientsSatisfied   || 0));

      // Settings
      formData.append('resumeUrl', data.resumeUrl || '');
      formData.append('settings[availableForWork]', String(data.availableForWork));

      // Avatar image (only if a new one was selected)
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const res = await profileAPI.update(formData);

      // Update preview with the URL returned from server
      if (res.data.profile?.avatar?.url) {
        setAvatarPreview(res.data.profile.avatar.url);
      }

      setSaved(true);
      toast.success('Profile saved successfully! ✅');
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to save profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan border-t-transparent rounded-full animate-spin" />
          <p className="font-mono text-xs text-white/30">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-2xl font-bold text-white">Profile Settings</h1>
          {saved && (
            <div className="flex items-center gap-2 text-green-400 font-mono text-sm">
              <FiCheckCircle size={16} /> Saved!
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* ── Avatar ───────────────────────────────────────────────────── */}
          <div className="bg-dark-200 rounded-2xl border border-white/5 p-6">
            <h2 className="font-display text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
              Profile Photo
            </h2>
            <div className="flex items-center gap-6">
              {/* Preview */}
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-dark-300 border border-white/10 flex-shrink-0">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                    onError={() => setAvatarPreview('')}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FiUser size={32} className="text-white/20" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleAvatarChange}
                  className="w-full text-sm text-white/40 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan/10 file:text-cyan file:text-sm file:font-mono cursor-pointer"
                />
                <p className="font-body text-xs text-white/20 mt-2">
                  JPG, PNG or WebP · Max 5MB
                  · Saved locally (add Cloudinary for cloud storage)
                </p>
                {avatarFile && (
                  <p className="font-mono text-xs text-cyan mt-1">
                    ✓ {avatarFile.name} selected — will upload on save
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── Basic Info ───────────────────────────────────────────────── */}
          <div className="bg-dark-200 rounded-2xl border border-white/5 p-6">
            <h2 className="font-display text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Full Name</label>
                <input {...register('name')} placeholder="Usama Butt" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Title / Role</label>
                <input {...register('title')} placeholder="MERN Stack Developer" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input {...register('email')} type="email" placeholder="your@email.com" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Phone</label>
                <input {...register('phone')} placeholder="+92 300 1234567" className={inputCls} />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>Location</label>
                <input {...register('location')} placeholder="Lahore, Pakistan" className={inputCls} />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>Short Bio (shown in hero section)</label>
                <textarea
                  {...register('shortBio')}
                  placeholder="MERN Stack developer passionate about building scalable web apps."
                  rows={2}
                  className={cn(inputCls, 'resize-none')}
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>Full Bio (shown on About page)</label>
                <textarea
                  {...register('bio')}
                  placeholder="Write your detailed biography here..."
                  rows={5}
                  className={cn(inputCls, 'resize-none')}
                />
              </div>
            </div>
          </div>

          {/* ── Stats ────────────────────────────────────────────────────── */}
          <div className="bg-dark-200 rounded-2xl border border-white/5 p-6">
            <h2 className="font-display text-sm font-semibold text-white/60 uppercase tracking-wider mb-1">
              Stats
            </h2>
            <p className="font-body text-xs text-white/20 mb-4">Shown in the hero section of your portfolio</p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Years Experience</label>
                <input
                  type="number" min="0"
                  {...register('yearsExperience', { valueAsNumber: true })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Projects Done</label>
                <input
                  type="number" min="0"
                  {...register('projectsCompleted', { valueAsNumber: true })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Happy Clients</label>
                <input
                  type="number" min="0"
                  {...register('clientsSatisfied', { valueAsNumber: true })}
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          {/* ── Social Links ─────────────────────────────────────────────── */}
          <div className="bg-dark-200 rounded-2xl border border-white/5 p-6">
            <h2 className="font-display text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
              Social Links
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>GitHub URL</label>
                <input {...register('github')} placeholder="https://github.com/username" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>LinkedIn URL</label>
                <input {...register('linkedin')} placeholder="https://linkedin.com/in/username" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Twitter / X URL</label>
                <input {...register('twitter')} placeholder="https://twitter.com/username" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Instagram URL</label>
                <input {...register('instagram')} placeholder="https://instagram.com/username" className={inputCls} />
              </div>
            </div>
          </div>

          {/* ── Resume / CV URL ────────────────────────────────────────────── */}
          <div className="bg-dark-200 rounded-2xl border border-white/5 p-6">
            <h2 className="font-display text-sm font-semibold text-white/60 uppercase tracking-wider mb-1">
              Resume / CV
            </h2>
            <p className="font-body text-xs text-white/20 mb-4">Paste your Google Drive direct download link here</p>
            <input
              {...register('resumeUrl')}
              placeholder="https://drive.google.com/uc?export=download&id=YOUR_FILE_ID"
              className={inputCls}
            />
            <p className="font-body text-xs text-white/20 mt-2">
              How to get the link: Google Drive → Right-click CV → Share → Anyone with link → Copy link ID → use https://drive.google.com/uc?export=download&id=FILE_ID
            </p>
          </div>

          {/* ── Availability ─────────────────────────────────────────────── */}
          <div className="bg-dark-200 rounded-2xl border border-white/5 p-6">
            <h2 className="font-display text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
              Availability
            </h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('availableForWork')}
                className="w-4 h-4 accent-cyan rounded"
              />
              <div>
                <span className="font-body text-sm text-white">Available for work</span>
                <p className="font-body text-xs text-white/30 mt-0.5">
                  Shows the green "Available for Work" badge on your portfolio
                </p>
              </div>
            </label>
          </div>

          {/* ── Save Button ───────────────────────────────────────────────── */}
          <button
            type="submit"
            disabled={submitting}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all duration-300',
              submitting
                ? 'bg-white/10 text-white/30 cursor-not-allowed'
                : saved
                ? 'bg-green-500 text-white'
                : 'bg-cyan text-dark hover:shadow-cyan hover:scale-[1.01]'
            )}
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : saved ? (
              <>
                <FiCheckCircle size={18} />
                Saved Successfully!
              </>
            ) : (
              <>
                <FiSave size={18} />
                Save Profile
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminProfile;
