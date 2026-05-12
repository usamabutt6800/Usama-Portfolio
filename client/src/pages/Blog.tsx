// src/pages/Blog.tsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiClock, FiEye, FiArrowRight } from 'react-icons/fi';
import { blogsAPI } from '@/services/api';
import { Blog as BlogType } from '@/types';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SCALE_IN, STAGGER_CONTAINER } from '@/constants';
import { formatDate } from '@/utils';

const BlogCard = ({ blog }: { blog: BlogType }) => (
  <motion.article
    variants={SCALE_IN}
    className="group bg-dark-200 rounded-2xl overflow-hidden border border-white/5 hover:border-cyan/20 transition-all duration-500"
  >
    {/* Cover image */}
    <div className="aspect-video overflow-hidden">
      {blog.coverImage?.url ? (
        <img
          src={blog.coverImage.url}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
      ) : (
        <div className="w-full h-full bg-dark-300 flex items-center justify-center">
          <span className="font-mono text-4xl text-white/10">{`</>`}</span>
        </div>
      )}
    </div>

    <div className="p-6">
      {/* Meta */}
      <div className="flex items-center gap-4 mb-3 text-xs font-mono text-white/30">
        <span>{formatDate(blog.createdAt)}</span>
        <span className="flex items-center gap-1"><FiClock size={11} /> {blog.readTime} min read</span>
        <span className="flex items-center gap-1"><FiEye size={11} /> {blog.views}</span>
      </div>

      <h3 className="font-display text-lg font-semibold text-white mb-2 group-hover:text-cyan transition-colors line-clamp-2">
        {blog.title}
      </h3>
      <p className="font-body text-sm text-white/40 mb-4 line-clamp-3">{blog.excerpt}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {blog.tags.slice(0, 3).map(tag => (
          <span key={tag} className="px-2 py-0.5 rounded-full bg-white/5 text-white/30 text-xs font-mono">
            #{tag}
          </span>
        ))}
      </div>

      <Link
        to={`/blog/${blog.slug}`}
        className="inline-flex items-center gap-2 text-sm text-cyan font-body hover:gap-3 transition-all duration-300"
      >
        Read Article <FiArrowRight size={14} />
      </Link>
    </div>
  </motion.article>
);

const Blog = () => {
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogsAPI.getAll()
      .then(res => setBlogs(res.data.blogs))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-dark pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          eyebrow="Thoughts & Tutorials"
          title="My"
          highlight="Blog"
          description="Articles about web development, JavaScript, MERN stack, and my personal learnings."
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-dark-200 rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 text-white/20 font-body">
            Blog posts will appear here once published from the admin panel.
          </div>
        ) : (
          <motion.div
            variants={STAGGER_CONTAINER}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {blogs.map(blog => <BlogCard key={blog._id} blog={blog} />)}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Blog;
