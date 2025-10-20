import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  tech: string[];
  demo_link: string | null;
  github_link: string | null;
}

const ProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setProjects(data);
  };

  // Normalize URLs: add https:// if protocol is missing
  const ensureHttpUrl = (url: string | null): string => {
    if (!url) return '#';
    if (/^https?:\/\//i.test(url)) return url;
    return `https://${url}`;
  };
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
          {projects.length === 0 ? (
            <p className="col-span-full text-center text-muted-foreground">No projects yet. Add some from the admin panel!</p>
          ) : (
            projects.map((project, index) => (
              <Card 
                key={project.id}
                className="gradient-border bg-card/50 backdrop-blur-sm overflow-hidden hover:scale-105 transition-all duration-300 glow-hover group"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Project Image */}
                <div className="relative overflow-hidden">
                  <img 
                    src={project.image_url} 
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
                    {project.demo_link && (
                      <Button 
                        variant="default" 
                        size="sm"
                        className="bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:scale-105 transition-transform cursor-pointer"
                        asChild
                      >
                        <a href={ensureHttpUrl(project.demo_link)} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Live Demo
                        </a>
                      </Button>
                    )}
                    {project.github_link && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-accent text-accent hover:bg-accent hover:text-accent-foreground hover:scale-105 transition-transform cursor-pointer"
                        asChild
                      >
                        <a href={ensureHttpUrl(project.github_link)} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4 mr-2" />
                          Code
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
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