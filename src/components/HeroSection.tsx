import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Github, Mail } from 'lucide-react';
import profilePhoto from '@/assets/profile-photo.jpg';

const HeroSection = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPhrase, setCurrentPhrase] = useState(0);
  
  const phrases = [
    'IoT Enthusiast 💻',
    'Embedded Systems Developer ⚡',
    'TinyML Explorer 🤖'
  ];

  useEffect(() => {
    const currentString = phrases[currentPhrase];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentIndex < currentString.length) {
          setDisplayText(currentString.substring(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (currentIndex > 0) {
          setDisplayText(currentString.substring(0, currentIndex - 1));
          setCurrentIndex(currentIndex - 1);
        } else {
          setIsDeleting(false);
          setCurrentPhrase((currentPhrase + 1) % phrases.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [currentIndex, isDeleting, currentPhrase, phrases]);

  return (
    <section className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Profile Photo */}
        <div className="relative inline-block mt-16">
          <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-primary neon-glow-cyan animate-pulse-glow">
            <img 
              src={profilePhoto} 
              alt="Elisee MUGIRANEZA" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -top-2 -right-2 text-2xl animate-bounce">⚡</div>
          <div className="absolute -bottom-2 -left-2 text-2xl animate-bounce animation-delay-400">🤖</div>
        </div>

        {/* Name and Title */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
            <span className="neon-text">ELISEE</span>
            <br />
            <span className="text-secondary">MUGIRANEZA</span>
          </h1>
          
          <div className="h-16 flex items-center justify-center">
            <p className="text-xl md:text-2xl text-muted-foreground font-mono">
              {displayText}
              <span className="animate-blink-caret border-r-2 border-primary ml-1"></span>
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Button 
            variant="default" 
            size="lg" 
            className="bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:scale-105 transition-transform neon-glow-cyan"
            asChild
          >
            <a href="mailto:mugiranezaelisee0@gmail.com">
              <Mail className="mr-2 h-5 w-5" />
              Get In Touch
            </a>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground hover:scale-105 transition-transform"
            asChild
          >
            <a href="https://github.com/Elisee-M" target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-5 w-5" />
              View Projects
            </a>
          </Button>
          
          <Button 
            variant="ghost" 
            size="lg"
            className="text-accent hover:text-accent-foreground hover:bg-accent hover:scale-105 transition-transform"
          >
            <Download className="mr-2 h-5 w-5" />
            Download CV
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;