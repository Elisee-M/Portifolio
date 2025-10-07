import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';
import { 
  Cpu, 
  Wifi, 
  Brain, 
  Code2, 
  Smartphone, 
  Settings,
  Zap,
  Microchip
} from 'lucide-react';

const SkillsSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  const skills = [
    { name: 'C/C++', level: 90, icon: Code2, color: 'from-neon-cyan to-neon-blue' },
    { name: 'IoT Development', level: 95, icon: Wifi, color: 'from-neon-purple to-neon-pink' },
    { name: 'ESP32/ESP8266', level: 88, icon: Microchip, color: 'from-neon-green to-neon-cyan' },
    { name: 'TinyML', level: 85, icon: Brain, color: 'from-neon-pink to-neon-purple' },
    { name: 'React/JavaScript', level: 80, icon: Smartphone, color: 'from-neon-blue to-neon-green' },
    { name: 'CAD Design', level: 75, icon: Settings, color: 'from-neon-cyan to-neon-pink' },
    { name: 'Firebase', level: 82, icon: Zap, color: 'from-neon-purple to-neon-blue' },
    { name: 'Arduino IDE', level: 92, icon: Cpu, color: 'from-neon-green to-neon-cyan' }
  ];

  const categories = [
    {
      title: 'Embedded Systems',
      description: 'Microcontroller programming and hardware interfacing',
      skills: skills.slice(0, 4)
    },
    {
      title: 'Software Development',
      description: 'Web technologies and application development',
      skills: skills.slice(4, 8)
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById('skills');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  return (
    <section id="skills" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {skills.map((skill, index) => (
            <div 
              key={skill.name}
              className="p-6 rounded-lg bg-gradient-to-br from-card to-muted/50 border border-border text-center hover:scale-105 transition-transform floating-icons group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`p-3 rounded-lg bg-gradient-to-r ${skill.color} bg-opacity-20 mx-auto mb-3 w-fit group-hover:scale-110 transition-transform`}>
                <skill.icon className="w-6 h-6 text-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground block">{skill.name}</span>
              <div className="mt-3">
                <div className="relative">
                  <Progress 
                    value={isVisible ? skill.level : 0} 
                    className="h-2 bg-muted"
                  />
                  <div 
                    className={`absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r ${skill.color} transition-all duration-1000 ease-out`}
                    style={{ 
                      width: isVisible ? `${skill.level}%` : '0%',
                      transitionDelay: `${index * 100}ms`
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground font-mono mt-1 block">
                  {skill.level}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;