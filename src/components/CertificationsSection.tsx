import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ExternalLink } from 'lucide-react';

interface Certification {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  image_url: string;
  credential_url: string | null;
}

const CertificationsSection = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [zoomedImage, setZoomedImage] = useState<{ url: string; title: string } | null>(null);
  const [limit, setLimit] = useState(4);

  useEffect(() => {
    fetchSettings();
    fetchCertifications();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase
      .from('site_settings')
      .select('setting_value')
      .eq('setting_key', 'homepage_limits')
      .single();
    
    if (data?.setting_value) {
      setLimit((data.setting_value as { certifications: number }).certifications);
    }
  };

  const fetchCertifications = async () => {
    const { data } = await supabase
      .from('certifications')
      .select('*')
      .order('issue_date', { ascending: false });
    
    if (data) setCertifications(data);
  };

  const displayedCertifications = certifications.slice(0, limit);

  return (
    <section id="certifications" className="py-20 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-primary bg-clip-text text-transparent animate-fade-in">
          Certifications 🏆
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCertifications.map((cert, index) => (
            <Card
              key={cert.id}
              className="group border-primary/20 bg-card/50 backdrop-blur-sm hover:border-primary transition-all duration-300 hover:shadow-elegant animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg cursor-pointer" onClick={() => setZoomedImage({ url: cert.image_url, title: cert.title })}>
                  <img
                    src={cert.image_url}
                    alt={cert.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </div>
                
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {cert.title}
                  </h3>
                  
                  <p className="text-muted-foreground">{cert.issuer}</p>
                  
                  <Badge variant="outline" className="border-primary/30">
                    {new Date(cert.issue_date).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </Badge>
                  
                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
                    >
                      View Credential
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        {certifications.length > limit && (
          <div className="text-center mt-12">
            <Button 
              variant="default" 
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-all"
              asChild
            >
              <a href="/certifications">
                View All Certifications ({certifications.length})
              </a>
            </Button>
          </div>
        )}
      </div>

      {/* Image Zoom Dialog */}
      <Dialog open={!!zoomedImage} onOpenChange={() => setZoomedImage(null)}>
        <DialogContent className="max-w-5xl w-full p-0 bg-transparent border-0">
          <img 
            src={zoomedImage?.url} 
            alt={zoomedImage?.title}
            className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
          />
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default CertificationsSection;