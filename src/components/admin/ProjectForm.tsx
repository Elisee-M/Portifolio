import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';

const ProjectForm = () => {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    demo_link: '',
    tech: '',
    github_link: '',
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      toast({ title: 'Please select an image', variant: 'destructive' });
      return;
    }

    setLoading(true);

    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from('projects')
        .insert({
          ...formData,
          image_url: publicUrl,
          tech: formData.tech.split(',').map(t => t.trim()),
        });

      if (insertError) throw insertError;

      toast({ title: 'Project added successfully!' });
      setFormData({
        title: '',
        description: '',
        demo_link: '',
        tech: '',
        github_link: '',
      });
      setImageFile(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
          Add New Project
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="border-primary/20 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="border-primary/20 focus:border-primary min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Project Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              required
              className="border-primary/20 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tech">Technologies (comma-separated)</Label>
            <Input
              id="tech"
              value={formData.tech}
              onChange={(e) => setFormData({ ...formData, tech: e.target.value })}
              placeholder="ESP32, Firebase, React"
              required
              className="border-primary/20 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="demo_link">Demo Link (optional)</Label>
            <Input
              id="demo_link"
              type="url"
              value={formData.demo_link}
              onChange={(e) => setFormData({ ...formData, demo_link: e.target.value })}
              className="border-primary/20 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="github_link">GitHub Link (optional)</Label>
            <Input
              id="github_link"
              type="url"
              value={formData.github_link}
              onChange={(e) => setFormData({ ...formData, github_link: e.target.value })}
              className="border-primary/20 focus:border-primary"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Upload className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProjectForm;