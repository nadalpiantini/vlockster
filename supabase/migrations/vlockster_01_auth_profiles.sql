-- VLOCKSTER Auth & Profiles
-- Tabla de perfiles de usuario con roles avanzados

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  bio TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('viewer', 'creator', 'moderator', 'admin')),
  role_scope JSONB DEFAULT NULL, -- Para granularidad por comunidad
  is_premium_creator BOOLEAN DEFAULT FALSE,
  public_profile_slug TEXT UNIQUE,
  preferred_lang TEXT DEFAULT 'es' CHECK (preferred_lang IN ('es', 'en', 'pt', 'fr')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_slug ON public.profiles(public_profile_slug);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE public.profiles IS 'Perfiles de usuario con sistema de roles avanzado';
COMMENT ON COLUMN public.profiles.role_scope IS 'JSONB para roles granulares por comunidad o proyecto';
COMMENT ON COLUMN public.profiles.public_profile_slug IS 'Slug único para perfil público (/c/[slug])';
