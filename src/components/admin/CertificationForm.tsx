import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';

interface Certification {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  image_url: string;
  credential_url: string | null;
}

interface CertificationFormProps {
  editingCertification: Certification | null;
  onSuccess: () => void;
}

const CertificationForm = ({ editingCertification, onSuccess }: CertificationFormProps) => {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    issue_date: '',
    credential_url: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    if (editingCertification) {
      setFormData({
        title: editingCertification.title,
        issuer: editingCertification.issuer,
        issue_date: editingCertification.issue_date,
        credential_url: editingCertification.credential_url || '',
      });
    }
  }, [editingCertification]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);

    try {
      let imageUrl = editingCertification?.image_url || '';

      // Upload new image if selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('certificates')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('certificates')
          .getPublicUrl(filePath);
        
        imageUrl = publicUrl;
      } else if (!editingCertification) {
        toast({ title: 'Please select a certificate image', variant: 'destructive' });
        setLoading(false);
        return;
      }

      const certData = {
        ...formData,
        image_url: imageUrl,
      };

      if (editingCertification) {
        const { error } = await supabase
          .from('certifications')
          .update(certData)
          .eq('id', editingCertification.id);

        if (error) throw error;
        toast({ title: 'Certification updated successfully!' });
      } else {
        const { error } = await supabase
          .from('certifications')
          .insert(certData);

        if (error) throw error;
        toast({ title: 'Certification added successfully!' });
      }

      setFormData({
        title: '',
        issuer: '',
        issue_date: '',
        credential_url: '',
      });
      setImageFile(null);
      onSuccess();
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
          {editingCertification ? 'Edit Certification' : 'Add New Certification'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cert-title">Certificate Title</Label>
            <Input
              id="cert-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="border-primary/20 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issuer">Issuing Organization</Label>
            <Input
              id="issuer"
              value={formData.issuer}
              onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
              required
              className="border-primary/20 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issue_date">Issue Date</Label>
            <Input
              id="issue_date"
              type="date"
              value={formData.issue_date}
              onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
              required
              className="border-primary/20 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cert-image">Certificate Image {editingCertification && '(leave empty to keep current)'}</Label>
            <Input
              id="cert-image"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              required={!editingCertification}
              className="border-primary/20 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="credential_url">Credential URL (optional)</Label>
            <Input
              id="credential_url"
              type="url"
              value={formData.credential_url}
              onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
              className="border-primary/20 focus:border-primary"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Upload className="mr-2 h-4 w-4" />
            {editingCertification ? 'Update Certification' : 'Add Certification'}
          </Button>
          {editingCertification && (
            <Button type="button" variant="outline" className="w-full" onClick={onSuccess}>
              Cancel
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default CertificationForm;