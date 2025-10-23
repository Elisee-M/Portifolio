import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ExternalLink, Github, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import ParticleBackground from '@/components/ParticleBackground';
import CircuitBackground from '@/components/CircuitBackground';

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  tech: string[];
  demo_link: string | null;
  github_link: string | null;
}

const AllProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const navigate = useNavigate();

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

  const ensureHttpUrl = (url: string | null) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <CircuitBackground />
      <ParticleBackground />
      <Navigation />
      
      <div className="container mx-auto px-4 py-24">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            All Projects
          </h1>
          <p className="text-muted-foreground text-lg">
            Browse through all my projects and technical work
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden border-primary/20 bg-card/50 backdrop-blur-sm hover:shadow-elegant transition-all duration-300 group">
              <div className="relative overflow-hidden cursor-pointer" onClick={() => setZoomedImage(project.image_url)}>
                <img 
                  src={project.image_url} 
                  alt={project.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{project.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{project.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="bg-primary/10">
                      {tech}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  {project.demo_link && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(ensureHttpUrl(project.demo_link), '_blank')}
                      className="flex-1"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Demo
                    </Button>
                  )}
                  {project.github_link && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(ensureHttpUrl(project.github_link), '_blank')}
                      className="flex-1"
                    >
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!zoomedImage} onOpenChange={() => setZoomedImage(null)}>
        <DialogContent className="max-w-4xl">
          {zoomedImage && (
            <img src={zoomedImage} alt="Project" className="w-full h-auto" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllProjects;
