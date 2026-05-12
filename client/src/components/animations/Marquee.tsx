// src/components/animations/Marquee.tsx
const ITEMS = [
  'React.js', 'Node.js', 'MongoDB', 'Express.js', 'TypeScript',
  'Tailwind CSS', 'REST API', 'JWT Auth', 'Redux', 'Git',
  'Vercel', 'Render', 'Postman', 'Mongoose', 'JavaScript',
];

const Marquee = () => {
  const all = [...ITEMS, ...ITEMS]; // duplicate for seamless loop

  return (
    <div className="overflow-hidden py-5" style={{ background: 'rgba(108,99,255,0.04)', borderTop: '1px solid rgba(108,99,255,0.1)', borderBottom: '1px solid rgba(108,99,255,0.1)' }}>
      <div className="flex whitespace-nowrap" style={{ animation: 'marquee 30s linear infinite' }}>
        {all.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2 mx-8 font-mono text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <span style={{ color: '#6c63ff' }}>✦</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
