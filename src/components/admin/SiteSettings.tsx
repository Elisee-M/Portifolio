import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';

const SiteSettings = () => {
  const [loading, setLoading] = useState(false);
  const [limits, setLimits] = useState({
    projects: 4,
    certifications: 4,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase
      .from('site_settings')
      .select('*')
      .eq('setting_key', 'homepage_limits')
      .single();
    
    if (data?.setting_value) {
      setLimits(data.setting_value as typeof limits);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('site_settings')
        .update({
          setting_value: limits,
        })
        .eq('setting_key', 'homepage_limits');

      if (error) throw error;

      toast({ title: 'Settings updated successfully!' });
    } catch (error: any) {
      toast({
        title: 'Error updating settings',
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
          Homepage Display Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="projects-limit">Projects on Homepage</Label>
            <Input
              id="projects-limit"
              type="number"
              min="1"
              max="20"
              value={limits.projects}
              onChange={(e) => setLimits({ ...limits, projects: parseInt(e.target.value) })}
              required
              className="border-primary/20 focus:border-primary"
            />
            <p className="text-sm text-muted-foreground">
              Number of projects to display on the homepage
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="certifications-limit">Certifications on Homepage</Label>
            <Input
              id="certifications-limit"
              type="number"
              min="1"
              max="20"
              value={limits.certifications}
              onChange={(e) => setLimits({ ...limits, certifications: parseInt(e.target.value) })}
              required
              className="border-primary/20 focus:border-primary"
            />
            <p className="text-sm text-muted-foreground">
              Number of certifications to display on the homepage
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SiteSettings;
