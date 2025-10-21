import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { 
  Mail, 
  Phone, 
  Github, 
  Linkedin, 
  Instagram,
  Send,
  MapPin
} from 'lucide-react';

const ContactSection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const contactInfo = [
    {
      icon: Phone,
      label: 'Phone',
      value: '+250798809812',
      link: 'tel:+250798809812',
      color: 'text-neon-green'
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'mugiranezaelisee0@gmail.com',
      link: 'mailto:mugiranezaelisee0@gmail.com',
      color: 'text-neon-cyan'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Kigali, Rwanda',
      link: '#',
      color: 'text-neon-purple'
    }
  ];

  const socialLinks = [
    {
      icon: Github,
      label: 'GitHub',
      link: 'https://github.com/Elisee-M',
      color: 'hover:text-neon-cyan'
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      link: 'https://www.linkedin.com/in/elisee-mugiraneza-b66625362/',
      color: 'hover:text-neon-blue'
    },
    {
      icon: Instagram,
      label: 'Instagram',
      link: 'https://www.instagram.com/_elisee__0/',
      color: 'hover:text-neon-pink'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });

      if (error) throw error;

      toast({
        title: "Message Sent! 🎉",
        description: "Thank you for reaching out. I'll get back to you soon!",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="neon-text">Let's Connect</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-6">
            Ready to build something amazing together? 🚀
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="gradient-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary">
                  Get In Touch 📱
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((info, index) => (
                  <a
                    key={info.label}
                    href={info.link}
                    className="flex items-center gap-4 p-4 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors group"
                  >
                    <div className={`p-3 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 ${info.color} group-hover:scale-110 transition-transform`}>
                      <info.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{info.label}</p>
                      <p className="text-muted-foreground">{info.value}</p>
                    </div>
                  </a>
                ))}
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="gradient-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-secondary">
                  Follow Me 🌐
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center gap-6">
                  {socialLinks.map((social, index) => (
                    <a
                      key={social.label}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-4 rounded-full bg-gradient-to-r from-muted/20 to-muted/40 text-muted-foreground ${social.color} hover:scale-110 transition-all glow-hover floating-icons`}
                      style={{ animationDelay: `${index * 200}ms` }}
                    >
                      <social.icon className="w-6 h-6" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="gradient-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-accent">
                Send a Message ✉️
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Name
                    </label>
                    <Input 
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-input/50 border-border focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <Input 
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-input/50 border-border focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Subject
                  </label>
                  <Input 
                    placeholder="Project Collaboration"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="bg-input/50 border-border focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <Textarea 
                    placeholder="Let's discuss your project ideas..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="bg-input/50 border-border focus:border-primary focus:ring-primary resize-none"
                    required
                  />
                </div>
                
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:scale-105 transition-transform neon-glow-cyan"
                  size="lg"
                >
                  <Send className="w-5 h-5 mr-2" />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-border">
          <p className="text-muted-foreground">
            Made with ❤️ and lots of ☕ by{' '}
            <span className="text-primary font-semibold">Elisee MUGIRANEZA</span>
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            © 2024 All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;