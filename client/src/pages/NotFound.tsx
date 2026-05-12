// src/pages/NotFound.tsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#0f0f1a' }}>
    <div className="absolute inset-0 bg-grid-pattern" />
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative text-center"
    >
      <div className="font-display font-bold select-none leading-none mb-0" style={{ fontSize: '160px', color: 'rgba(108,99,255,0.08)' }}>
        404
      </div>
      <div className="-mt-8">
        <h1 className="font-display text-3xl font-bold text-white mb-3">
          Page Not <span className="text-gradient">Found</span>
        </h1>
        <p className="font-body mb-8 max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.35)' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary inline-flex">
          Go Back Home
        </Link>
      </div>
    </motion.div>
  </div>
);

export default NotFound;
