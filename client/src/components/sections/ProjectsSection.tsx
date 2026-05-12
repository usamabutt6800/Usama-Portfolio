// src/components/sections/ProjectsSection.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiExternalLink, FiGithub, FiCode } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { projectsAPI } from '@/services/api';
import { Project, ProjectCategory } from '@/types';
import { PROJECT_CATEGORIES, SCALE_IN, STAGGER_CONTAINER } from '@/constants';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { cn } from '@/utils';

const ProjectCard = ({ project }: { project: Project }) => (
  <motion.div
    variants={SCALE_IN}
    layout
    className="group rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2"
    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
    onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(108,99,255,0.3)'}
    onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'}
  >
    {/* Thumbnail */}
    <div className="relative overflow-hidden aspect-video">
      {project.thumbnail?.url ? (
        <img src={project.thumbnail.url} alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      ) : (
        <div className="w-full h-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.15), rgba(168,85,247,0.15))' }}>
          <FiCode size={40} style={{ color: 'rgba(108,99,255,0.4)' }} />
        </div>
      )}

      {/* Hover overlay with links */}
      <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'rgba(15,15,26,0.85)' }}>
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
            className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            style={{ background: 'linear-gradient(135deg, #6c63ff, #a855f7)', color: 'white' }}>
            <FiExternalLink size={18} />
          </a>
        )}
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
            className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
            <FiGithub size={18} />
          </a>
        )}
      </div>

      {project.featured && (
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-mono font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #6c63ff, #a855f7)' }}>
          Featured
        </span>
      )}
    </div>

    {/* Content */}
    <div className="p-6">
      <h3 className="font-display text-lg font-semibold text-white mb-2 group-hover:text-gradient transition-all">
        {project.title}
      </h3>
      <p className="font-body text-sm mb-4 line-clamp-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
        {project.description}
      </p>
      {/* Tech tags */}
      <div className="flex flex-wrap gap-2">
        {project.techStack?.slice(0, 4).map(tech => (
          <span key={tech} className="px-2.5 py-1 rounded-lg text-xs font-mono"
            style={{ background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)', color: '#a78bfa' }}>
            {tech}
          </span>
        ))}
        {project.techStack?.length > 4 && (
          <span className="text-xs font-mono self-center" style={{ color: 'rgba(255,255,255,0.2)' }}>
            +{project.techStack.length - 4}
          </span>
        )}
      </div>
    </div>
  </motion.div>
);

const ProjectsSection = ({ showAll = false }: { showAll?: boolean }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await projectsAPI.getAll(activeCategory !== 'all' ? { category: activeCategory } : {});
        setProjects(showAll ? res.data.projects : res.data.projects.slice(0, 6));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, [activeCategory, showAll]);

  return (
    <section className="py-24" style={{ background: '#0f0f1a' }}>
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          eyebrow="My Work"
          title="Featured"
          highlight="Projects"
          description="A selection of projects I've built — from full-stack web apps to API-driven platforms."
        />

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {PROJECT_CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value as ProjectCategory)}
              className="px-4 py-2 rounded-full text-sm font-mono transition-all duration-300"
              style={activeCategory === cat.value ? {
                background: 'linear-gradient(135deg, #6c63ff, #a855f7)',
                color: 'white',
                border: '1px solid transparent',
              } : {
                background: 'transparent',
                color: 'rgba(255,255,255,0.4)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl aspect-[4/3] animate-pulse"
                style={{ background: 'rgba(255,255,255,0.04)' }} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 font-body" style={{ color: 'rgba(255,255,255,0.2)' }}>
            No projects in this category yet.
          </div>
        ) : (
          <motion.div
            variants={STAGGER_CONTAINER}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {projects.map(project => <ProjectCard key={project._id} project={project} />)}
            </AnimatePresence>
          </motion.div>
        )}

        {!showAll && projects.length > 0 && (
          <div className="text-center mt-12">
            <Link to="/projects" className="btn-outline inline-flex items-center gap-2">
              View All Projects
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
