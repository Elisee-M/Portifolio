import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github } from 'lucide-react';
import rgbLampProject from '@/assets/rgb-lamp-project.jpg';
import fingerprintAttendance from '@/assets/fingerprint-attendance.jpg';
import pestDetectionAi from '@/assets/pest-detection-ai.jpg';
import smartParking from '@/assets/smart-parking.jpg';
import homeMonitoring from '@/assets/home-monitoring.jpg';

const ProjectsSection = () => {
  const projects = [
    {
      title: 'WiFi-Controlled RGB Mood Lamp 💡',
      description: 'Real-time color control via web sliders using ESP8266 and Firebase. Perfect for creating ambient lighting that responds to your mood!',
      image: rgbLampProject,
      tech: ['ESP8266', 'Firebase', 'HTML/CSS/JS', 'Arduino'],
      demo: '#',
      github: 'https://github.com/Elisee-M'
    },
    {
      title: 'Fingerprint Attendance System 👆',
      description: 'Teacher attendance monitoring using AS608 fingerprint sensor and ESP32. Streamlines attendance tracking with biometric security.',
      image: fingerprintAttendance,
      tech: ['ESP32', 'Firebase', 'Biometrics', 'AS608 Sensor'],
      demo: '#',
      github: 'https://github.com/Elisee-M'
    },
    {
      title: 'TinyML Pest Detection 🌱',
      description: 'AI-powered pest detection system for agriculture using TensorFlow Lite on ESP32-CAM. Helps farmers protect their crops intelligently.',
      image: pestDetectionAi,
      tech: ['TinyML', 'ESP32-CAM', 'TensorFlow Lite', 'Computer Vision'],
      demo: '#',
      github: 'https://github.com/Elisee-M'
    },
    {
      title: 'Smart Parking System 🚗',
      description: 'Automated parking management system using IoT sensors and real-time data processing for efficient space utilization.',
      image: smartParking,
      tech: ['ESP32', 'IoT Sensors', 'Real-time Data', 'Mobile App'],
      demo: '#',
      github: 'https://github.com/Elisee-M'
    },
    {
      title: 'Home Monitoring System 🏠',
      description: 'Comprehensive home automation and security system with remote monitoring capabilities and smart device integration.',
      image: homeMonitoring,
      tech: ['ESP8266', 'Smart Sensors', 'Mobile App', 'Cloud Platform'],
      demo: '#',
      github: 'https://github.com/Elisee-M'
    }
  ];

  return (
    <section id="projects" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="neon-text">Featured Projects</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-6">
            From smart lighting to AI-powered agriculture 🚀
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card 
              key={project.title}
              className="gradient-border bg-card/50 backdrop-blur-sm overflow-hidden hover:scale-105 transition-all duration-300 glow-hover group"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Project Image */}
              <div className="relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {project.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <Badge 
                      key={tech} 
                      variant="secondary"
                      className="bg-secondary/20 text-secondary border-secondary/50"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="default" 
                    size="sm"
                    className="bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:scale-105 transition-transform"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Live Demo
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-accent text-accent hover:bg-accent hover:text-accent-foreground hover:scale-105 transition-transform"
                    asChild
                  >
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      Code
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* More Projects CTA */}
        <div className="text-center mt-16">
          <Button 
            variant="outline" 
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-all neon-glow-cyan"
            asChild
          >
            <a href="https://github.com/Elisee-M" target="_blank" rel="noopener noreferrer">
              <Github className="w-5 h-5 mr-2" />
              View All Projects on GitHub
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;