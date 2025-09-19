-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for user types
CREATE TYPE public.user_type AS ENUM ('admin', 'beneficiario');

-- Create profiles table for user information
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT,
    user_type public.user_type NOT NULL DEFAULT 'beneficiario',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create voluntarios table
CREATE TABLE public.voluntarios (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT NOT NULL,
    idade INTEGER NOT NULL,
    endereco TEXT NOT NULL,
    area TEXT NOT NULL,
    experiencia TEXT,
    disponibilidade TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on voluntarios
ALTER TABLE public.voluntarios ENABLE ROW LEVEL SECURITY;

-- Create policies for voluntarios (admins can see all, users can see their own)
CREATE POLICY "Admin can view all voluntarios" 
ON public.voluntarios 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE user_id = auth.uid() AND user_type = 'admin'
    )
);

CREATE POLICY "Users can create voluntario records" 
ON public.voluntarios 
FOR INSERT 
WITH CHECK (true);

-- Create beneficiarios table
CREATE TABLE public.beneficiarios (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
    nome TEXT NOT NULL,
    email TEXT,
    telefone TEXT NOT NULL,
    idade INTEGER NOT NULL,
    endereco TEXT NOT NULL,
    necessidades TEXT[] NOT NULL DEFAULT '{}',
    observacoes TEXT,
    responsavel TEXT,
    confirmou_presenca BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on beneficiarios
ALTER TABLE public.beneficiarios ENABLE ROW LEVEL SECURITY;

-- Create policies for beneficiarios
CREATE POLICY "Admin can view all beneficiarios" 
ON public.beneficiarios 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE user_id = auth.uid() AND user_type = 'admin'
    )
);

CREATE POLICY "Beneficiarios can view their own records" 
ON public.beneficiarios 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create beneficiario records" 
ON public.beneficiarios 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Beneficiarios can update their own records" 
ON public.beneficiarios 
FOR UPDATE 
USING (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_user_type ON public.profiles(user_type);
CREATE INDEX idx_voluntarios_created_at ON public.voluntarios(created_at DESC);
CREATE INDEX idx_beneficiarios_created_at ON public.beneficiarios(created_at DESC);
CREATE INDEX idx_voluntarios_area ON public.voluntarios(area);
CREATE INDEX idx_beneficiarios_presenca ON public.beneficiarios(confirmou_presenca);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at 
BEFORE UPDATE ON public.profiles 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_voluntarios_updated_at 
BEFORE UPDATE ON public.voluntarios 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_beneficiarios_updated_at 
BEFORE UPDATE ON public.beneficiarios 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, nome, email, user_type)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'nome', NEW.raw_user_meta_data ->> 'name', 'Usuário'),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data ->> 'user_type')::public.user_type, 'beneficiario')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();