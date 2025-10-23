import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import ParticleBackground from '@/components/ParticleBackground';
import CircuitBackground from '@/components/CircuitBackground';

interface Certification {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  image_url: string;
  credential_url: string | null;
}

const AllCertifications = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const navigate = useNavigate();

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
            All Certifications
          </h1>
          <p className="text-muted-foreground text-lg">
            View all my professional certifications and credentials
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certifications.map((cert) => (
            <Card key={cert.id} className="overflow-hidden border-primary/20 bg-card/50 backdrop-blur-sm hover:shadow-elegant transition-all duration-300 group">
              <div className="relative overflow-hidden cursor-pointer" onClick={() => setZoomedImage(cert.image_url)}>
                <img 
                  src={cert.image_url} 
                  alt={cert.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{cert.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Issued by</p>
                  <p className="font-medium">{cert.issuer}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Issue Date</p>
                  <p className="font-medium">{new Date(cert.issue_date).toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}</p>
                </div>

                {cert.credential_url && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(cert.credential_url!, '_blank')}
                    className="w-full"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Credential
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!zoomedImage} onOpenChange={() => setZoomedImage(null)}>
        <DialogContent className="max-w-4xl">
          {zoomedImage && (
            <img src={zoomedImage} alt="Certification" className="w-full h-auto" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllCertifications;
