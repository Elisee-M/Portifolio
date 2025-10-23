import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  tech: string[];
  demo_link: string | null;
  github_link: string | null;
}

interface ProjectsListProps {
  onEdit: (project: Project) => void;
}

const ProjectsList = ({ onEdit }: ProjectsListProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const { toast } = useToast();

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

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Error deleting project', variant: 'destructive' });
    } else {
      toast({ title: 'Project deleted successfully' });
      fetchProjects();
    }
  };

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Existing Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {projects.map((project) => (
            <div key={project.id} className="flex items-center gap-4 p-4 border border-primary/20 rounded-lg">
              <img src={project.image_url} alt={project.title} className="w-20 h-20 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-bold">{project.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => onEdit(project)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(project.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectsList;