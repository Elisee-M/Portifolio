-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Only admins can insert roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  demo_link TEXT,
  demo_username TEXT,
  demo_password TEXT,
  tech TEXT[] NOT NULL DEFAULT '{}',
  github_link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- RLS policies for projects
CREATE POLICY "Projects are viewable by everyone"
  ON public.projects FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert projects"
  ON public.projects FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update projects"
  ON public.projects FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete projects"
  ON public.projects FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Create certifications table
CREATE TABLE public.certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date DATE NOT NULL,
  image_url TEXT NOT NULL,
  credential_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for certifications
CREATE POLICY "Certifications are viewable by everyone"
  ON public.certifications FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert certifications"
  ON public.certifications FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update certifications"
  ON public.certifications FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete certifications"
  ON public.certifications FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Create storage buckets for images
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('project-images', 'project-images', true),
  ('certificates', 'certificates', true);

-- Storage policies for project images
CREATE POLICY "Project images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-images');

CREATE POLICY "Admins can upload project images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'project-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete project images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'project-images' AND public.has_role(auth.uid(), 'admin'));

-- Storage policies for certificates
CREATE POLICY "Certificates are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'certificates');

CREATE POLICY "Admins can upload certificates"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'certificates' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete certificates"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'certificates' AND public.has_role(auth.uid(), 'admin'));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_certifications_updated_at
  BEFORE UPDATE ON public.certifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();