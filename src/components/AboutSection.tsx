import { Card, CardContent } from '@/components/ui/card';
import { Cpu, Wifi, Brain, Settings } from 'lucide-react';

const AboutSection = () => {
  const techIcons = [
    { icon: Wifi, label: 'IoT', color: 'text-neon-cyan' },
    { icon: Brain, label: 'TinyML', color: 'text-neon-purple' },
    { icon: Cpu, label: 'C++', color: 'text-neon-green' },
    { icon: Settings, label: 'CAD', color: 'text-neon-pink' }
  ];

  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="neon-text">About Me</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* About Text */}
          <div className="space-y-6">
            <Card className="gradient-border bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-primary mb-4">
                  Hi, I'm Elisee! 👋
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  I'm a passionate embedded systems engineer specializing in 
                  <span className="text-primary font-semibold"> IoT projects</span> with 
                  <span className="text-secondary font-semibold"> ESP8266</span>, 
                  <span className="text-accent font-semibold"> ESP32</span>, 
                  <span className="text-neon-purple font-semibold"> TinyML</span>, and 
                  <span className="text-neon-green font-semibold"> CAD design</span>.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  I love creating <span className="text-primary">smart devices</span>, 
                  <span className="text-secondary"> automated systems</span>, and 
                  <span className="text-accent"> tech experiments</span> that turn ideas into reality. 
                  When I'm not coding microcontrollers, you'll find me exploring the latest in 
                  <span className="text-neon-purple"> machine learning</span> and 
                  <span className="text-neon-cyan"> IoT innovations</span>.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tech Icons */}
          <div className="grid grid-cols-2 gap-6">
            {techIcons.map((tech, index) => (
              <Card 
                key={tech.label}
                className="gradient-border bg-card/30 backdrop-blur-sm hover:scale-105 transition-transform glow-hover"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardContent className="p-8 text-center">
                  <tech.icon className={`w-12 h-12 mx-auto mb-4 ${tech.color} floating-icons`} />
                  <h4 className="text-xl font-bold text-foreground">{tech.label}</h4>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {[
            { number: '10+', label: 'IoT Projects' },
            { number: '3+', label: 'Years Experience' },
            { number: '5+', label: 'TinyML Models' },
            { number: '∞', label: 'Ideas & Dreams' }
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className="text-center p-6 rounded-lg bg-gradient-to-br from-card to-muted/50 backdrop-blur-sm border border-border hover:scale-105 transition-transform"
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;