import Navigation from '@/components/Navigation';
import ParticleBackground from '@/components/ParticleBackground';
import CircuitBackground from '@/components/CircuitBackground';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ProjectsSection from '@/components/ProjectsSection';
import SkillsSection from '@/components/SkillsSection';
import CertificationsSection from '@/components/CertificationsSection';
import ContactSection from '@/components/ContactSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <CircuitBackground />
      <ParticleBackground />
      <Navigation />
      
      <div id="hero">
        <HeroSection />
      </div>
      
      <AboutSection />
      <ProjectsSection />
      <SkillsSection />
      <CertificationsSection />
      <ContactSection />
    </div>
  );
};

export default Index;
