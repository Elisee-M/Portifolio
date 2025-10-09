import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';

interface Certification {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  image_url: string;
}

const CertificationsList = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    const { data } = await supabase
      .from('certifications')
      .select('*')
      .order('issue_date', { ascending: false });
    
    if (data) setCertifications(data);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('certifications')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Error deleting certification', variant: 'destructive' });
    } else {
      toast({ title: 'Certification deleted successfully' });
      fetchCertifications();
    }
  };

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Existing Certifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {certifications.map((cert) => (
            <div key={cert.id} className="flex items-center gap-4 p-4 border border-primary/20 rounded-lg">
              <img src={cert.image_url} alt={cert.title} className="w-20 h-20 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-bold">{cert.title}</h3>
                <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                <p className="text-xs text-muted-foreground">{new Date(cert.issue_date).toLocaleDateString()}</p>
              </div>
              <Button variant="destructive" size="icon" onClick={() => handleDelete(cert.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificationsList;