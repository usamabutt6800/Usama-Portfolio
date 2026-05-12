// src/pages/admin/AdminBlogs.tsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiEye } from 'react-icons/fi';
import { blogsAPI } from '@/services/api';
import { Blog } from '@/types';
import { formatDate, estimateReadTime } from '@/utils';
import { cn } from '@/utils';

const inputCls = 'w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-sm font-body text-white placeholder:text-white/20 focus:outline-none focus:border-cyan/50 transition-all';

interface BlogForm {
  title: string; excerpt: string; content: string;
  tags: string; category: string; published: boolean;
}

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, setValue, watch } = useForm<BlogForm>({
    defaultValues: { published: false },
  });

  const contentValue = watch('content', '');

  const fetchBlogs = async () => {
    try {
      const res = await blogsAPI.getAll();
      setBlogs(res.data.blogs);
    } catch { toast.error('Failed to load blogs'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBlogs(); }, []);

  const openEdit = (blog: Blog) => {
    setEditingSlug(blog.slug);
    setEditingId(blog._id);
    setValue('title', blog.title);
    setValue('excerpt', blog.excerpt);
    setValue('content', blog.content || '');
    setValue('tags', blog.tags?.join(', ') || '');
    setValue('category', blog.category || 'general');
    setValue('published', blog.published);
    setShowForm(true);
  };

  const onSubmit = async (data: BlogForm) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('excerpt', data.excerpt);
      formData.append('content', data.content);
      formData.append('category', data.category || 'general');
      formData.append('published', String(data.published));
      formData.append('readTime', String(estimateReadTime(data.content)));

      // Convert comma-separated tags to JSON array
      const tagsArr = data.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
      tagsArr.forEach(tag => formData.append('tags[]', tag));

      if (coverImage) formData.append('coverImage', coverImage);

      if (editingSlug) {
        await blogsAPI.update(editingSlug, formData);
        toast.success('Blog updated!');
      } else {
        await blogsAPI.create(formData);
        toast.success('Blog created!');
      }
      reset({ published: false });
      setShowForm(false); setEditingSlug(null); setEditingId(null); setCoverImage(null);
      fetchBlogs();
    } catch { toast.error('Failed to save blog post'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog post?')) return;
    try {
      await blogsAPI.delete(id);
      toast.success('Blog deleted');
      setBlogs(prev => prev.filter(b => b._id !== id));
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="min-h-screen bg-dark p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-2xl font-bold text-white">Blog Posts</h1>
          <button
            onClick={() => { setShowForm(true); setEditingSlug(null); setEditingId(null); reset({ published: false }); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan text-dark font-semibold text-sm hover:shadow-cyan transition-all"
          >
            <FiPlus size={16} /> Write Post
          </button>
        </div>

        {/* Blog List */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-dark-200 rounded-xl h-20 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {blogs.map(blog => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-4 bg-dark-200 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all"
              >
                {/* Cover thumbnail */}
                <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  {blog.coverImage?.url ? (
                    <img src={blog.coverImage.url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-dark-300 flex items-center justify-center">
                      <span className="font-mono text-white/10 text-xs">{`</>`}</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-body text-sm font-medium text-white truncate">{blog.title}</h3>
                    <span className={cn(
                      'px-2 py-0.5 rounded-full text-xs font-mono flex-shrink-0',
                      blog.published
                        ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                        : 'bg-white/5 border border-white/10 text-white/30'
                    )}>
                      {blog.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-white/20">{formatDate(blog.createdAt)}</span>
                    <span className="flex items-center gap-1 font-mono text-xs text-white/20">
                      <FiEye size={10} /> {blog.views}
                    </span>
                    <span className="font-mono text-xs text-white/20">{blog.readTime} min read</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(blog)}
                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-cyan hover:bg-cyan/10 transition-all">
                    <FiEdit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(blog._id)}
                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
            {blogs.length === 0 && (
              <div className="text-center py-16 text-white/20 font-body">
                No blog posts yet. Write your first article!
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
              className="w-full max-w-3xl bg-dark-200 rounded-2xl border border-white/10 shadow-glass max-h-[95vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-dark-200 flex items-center justify-between px-6 py-4 border-b border-white/5 z-10">
                <h2 className="font-display text-lg font-bold text-white">
                  {editingSlug ? 'Edit Post' : 'Write New Post'}
                </h2>
                <button
                  onClick={() => { setShowForm(false); reset(); setCoverImage(null); }}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                {/* Title */}
                <input
                  {...register('title', { required: 'Title is required' })}
                  placeholder="Post Title"
                  className={cn(inputCls, 'text-lg font-display')}
                />

                {/* Excerpt */}
                <textarea
                  {...register('excerpt', { required: 'Excerpt is required' })}
                  placeholder="Short excerpt (shown on blog listing page)"
                  rows={2}
                  className={cn(inputCls, 'resize-none')}
                />

                {/* Content */}
                <div>
                  <label className="font-mono text-xs text-white/30 uppercase tracking-wider mb-2 block">
                    Content (Markdown supported)
                    {contentValue && (
                      <span className="ml-2 text-cyan">
                        ~{estimateReadTime(contentValue)} min read
                      </span>
                    )}
                  </label>
                  <textarea
                    {...register('content', { required: 'Content is required' })}
                    placeholder="# Your blog content here...&#10;&#10;Write in Markdown format."
                    rows={14}
                    className={cn(inputCls, 'resize-y font-mono text-xs leading-relaxed')}
                  />
                </div>

                {/* Category & Tags row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      {...register('category')}
                      placeholder="Category (e.g. React, Node.js)"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <input
                      {...register('tags')}
                      placeholder="Tags: react, nodejs, mern"
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Cover Image */}
                <div>
                  <label className="font-mono text-xs text-white/30 uppercase tracking-wider mb-2 block">
                    Cover Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setCoverImage(e.target.files?.[0] || null)}
                    className="w-full text-sm text-white/40 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan/10 file:text-cyan file:text-sm file:font-mono cursor-pointer"
                  />
                </div>

                {/* Published toggle */}
                <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl bg-white/5 border border-white/5">
                  <input
                    type="checkbox"
                    {...register('published')}
                    className="w-4 h-4 accent-cyan rounded"
                  />
                  <div>
                    <span className="font-body text-sm text-white">Publish immediately</span>
                    <p className="font-body text-xs text-white/30 mt-0.5">
                      Uncheck to save as draft
                    </p>
                  </div>
                </label>

                {/* Submit */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan text-dark font-semibold text-sm hover:shadow-cyan transition-all disabled:opacity-60"
                  >
                    <FiSave size={16} />
                    {submitting ? 'Saving...' : editingSlug ? 'Update Post' : 'Publish Post'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); reset(); setCoverImage(null); }}
                    className="px-6 py-3 rounded-xl border border-white/10 text-white/40 text-sm hover:border-white/20 transition-all"
                  >
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

export default AdminBlogs;
