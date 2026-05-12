// src/pages/Home.tsx
import Hero from '@/components/sections/Hero';
import Marquee from '@/components/animations/Marquee';
import ProjectsSection from '@/components/sections/ProjectsSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ContactSection from '@/components/sections/ContactSection';

const Home = () => (
  <div style={{ background: '#0f0f1a' }}>
    <Hero />
    <Marquee />
    <ProjectsSection showAll={false} />
    <SkillsSection />
    <ContactSection />
  </div>
);

export default Home;
