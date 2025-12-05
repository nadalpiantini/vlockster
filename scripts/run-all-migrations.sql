-- ============================================
-- Archivo: supabase/vlockster_00_schema.sql
-- ============================================
-- VLOCKSTER Database Schema
-- Version: 1.0.0
-- Description: Schema base para VLOCKSTER - Plataforma de streaming + crowdfunding + comunidad

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create schema for better organization
CREATE SCHEMA IF NOT EXISTS vlockster;

-- Set search path
SET search_path TO vlockster, public;

-- Comments
COMMENT ON SCHEMA vlockster IS 'Schema principal de VLOCKSTER - Netflix + Kickstarter + Skool para cine indie';


-- ============================================
-- Archivo: supabase/vlockster_01_auth_profiles.sql
-- ============================================
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
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_slug ON public.profiles(public_profile_slug);
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE public.profiles IS 'Perfiles de usuario con sistema de roles avanzado';
COMMENT ON COLUMN public.profiles.role_scope IS 'JSONB para roles granulares por comunidad o proyecto';
COMMENT ON COLUMN public.profiles.public_profile_slug IS 'Slug único para perfil público (/c/[slug])';


-- ============================================
-- Archivo: supabase/vlockster_02_creator_requests.sql
-- ============================================
-- VLOCKSTER Creator Requests
-- Sistema de solicitudes para convertirse en creator

CREATE TABLE IF NOT EXISTS public.creator_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pitch_title TEXT NOT NULL,
  pitch_text TEXT NOT NULL,
  portfolio_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  CONSTRAINT one_pending_request_per_user UNIQUE (user_id, status)
    WHERE status = 'pending'
);

-- Indexes
CREATE INDEX idx_creator_requests_user ON public.creator_requests(user_id);
CREATE INDEX idx_creator_requests_status ON public.creator_requests(status);
CREATE INDEX idx_creator_requests_reviewed_by ON public.creator_requests(reviewed_by);

-- Trigger for updated_at
CREATE TRIGGER update_creator_requests_updated_at
  BEFORE UPDATE ON public.creator_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE public.creator_requests IS 'Solicitudes de usuarios para convertirse en creators';
COMMENT ON CONSTRAINT one_pending_request_per_user ON public.creator_requests
  IS 'Un usuario solo puede tener una solicitud pending a la vez';


-- ============================================
-- Archivo: supabase/vlockster_03_videos.sql
-- ============================================
-- VLOCKSTER Videos & Metrics
-- Sistema de videos con Cloudflare Stream y analytics

-- Videos table
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  stream_id TEXT NOT NULL UNIQUE, -- Cloudflare Stream ID
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  uploader_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'members', 'backers')),
  tags TEXT[] DEFAULT '{}',
  genre TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Video metrics table (analytics)
CREATE TABLE IF NOT EXISTS public.video_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  watched_seconds INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  liked BOOLEAN DEFAULT FALSE,
  session_id TEXT, -- Para tracking de sesiones
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Un viewer solo puede tener una métrica activa por video
  CONSTRAINT unique_viewer_video UNIQUE (video_id, viewer_id)
);

-- Indexes for videos
CREATE INDEX idx_videos_uploader ON public.videos(uploader_id);
CREATE INDEX idx_videos_visibility ON public.videos(visibility);
CREATE INDEX idx_videos_tags ON public.videos USING GIN(tags);
CREATE INDEX idx_videos_featured ON public.videos(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_videos_published ON public.videos(published_at DESC NULLS LAST);

-- Indexes for metrics
CREATE INDEX idx_video_metrics_video ON public.video_metrics(video_id);
CREATE INDEX idx_video_metrics_viewer ON public.video_metrics(viewer_id);
CREATE INDEX idx_video_metrics_completed ON public.video_metrics(completed) WHERE completed = TRUE;

-- Triggers
CREATE TRIGGER update_videos_updated_at
  BEFORE UPDATE ON public.videos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_video_metrics_updated_at
  BEFORE UPDATE ON public.video_metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to update video stats from metrics
CREATE OR REPLACE FUNCTION update_video_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update view count
  UPDATE public.videos
  SET view_count = (
    SELECT COUNT(DISTINCT viewer_id)
    FROM public.video_metrics
    WHERE video_id = NEW.video_id
  )
  WHERE id = NEW.video_id;

  -- Update like count
  IF NEW.liked = TRUE THEN
    UPDATE public.videos
    SET like_count = (
      SELECT COUNT(*)
      FROM public.video_metrics
      WHERE video_id = NEW.video_id AND liked = TRUE
    )
    WHERE id = NEW.video_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_video_stats
  AFTER INSERT OR UPDATE ON public.video_metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_video_stats();

-- Comments
COMMENT ON TABLE public.videos IS 'Videos alojados en Cloudflare Stream';
COMMENT ON TABLE public.video_metrics IS 'Métricas de visualización y engagement por video';
COMMENT ON COLUMN public.videos.stream_id IS 'ID único del video en Cloudflare Stream';
COMMENT ON COLUMN public.videos.visibility IS 'Control de acceso: public, members, backers';


-- ============================================
-- Archivo: supabase/vlockster_04_projects.sql
-- ============================================
-- VLOCKSTER Projects & Crowdfunding
-- Sistema completo de crowdfunding tipo Kickstarter

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  goal_amount NUMERIC(12, 2) NOT NULL CHECK (goal_amount > 0),
  current_amount NUMERIC(12, 2) DEFAULT 0 CHECK (current_amount >= 0),
  currency TEXT DEFAULT 'USD' CHECK (currency IN ('USD', 'EUR', 'MXN', 'BRL')),
  deadline DATE NOT NULL,
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  video_id UUID REFERENCES public.videos(id) ON DELETE SET NULL,
  category TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'funded', 'completed', 'cancelled')),
  featured BOOLEAN DEFAULT FALSE,
  backers_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  launched_at TIMESTAMP WITH TIME ZONE,
  funded_at TIMESTAMP WITH TIME ZONE,

  -- Constraints
  CONSTRAINT deadline_in_future CHECK (deadline > CURRENT_DATE)
);

-- Rewards table
CREATE TABLE IF NOT EXISTS public.rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  currency TEXT DEFAULT 'USD',
  delivery_date DATE,
  limit_quantity INTEGER CHECK (limit_quantity IS NULL OR limit_quantity > 0),
  backers_count INTEGER DEFAULT 0,
  position INTEGER DEFAULT 0, -- Para ordenar rewards
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  CONSTRAINT check_available_with_limit CHECK (
    (limit_quantity IS NULL) OR
    (backers_count < limit_quantity) OR
    (available = FALSE)
  )
);

-- Backings table
CREATE TABLE IF NOT EXISTS public.backings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  reward_id UUID REFERENCES public.rewards(id) ON DELETE SET NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  payment_id TEXT, -- PayPal transaction ID
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  message TEXT, -- Mensaje opcional del backer
  anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Un usuario no puede backear el mismo proyecto más de una vez
  CONSTRAINT unique_user_project_backing UNIQUE (user_id, project_id)
);

-- Indexes for projects
CREATE INDEX idx_projects_creator ON public.projects(creator_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_deadline ON public.projects(deadline);
CREATE INDEX idx_projects_featured ON public.projects(featured) WHERE featured = TRUE;
CREATE INDEX idx_projects_category ON public.projects(category);

-- Indexes for rewards
CREATE INDEX idx_rewards_project ON public.rewards(project_id);
CREATE INDEX idx_rewards_position ON public.rewards(project_id, position);

-- Indexes for backings
CREATE INDEX idx_backings_user ON public.backings(user_id);
CREATE INDEX idx_backings_project ON public.backings(project_id);
CREATE INDEX idx_backings_payment_status ON public.backings(payment_status);

-- Triggers
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rewards_updated_at
  BEFORE UPDATE ON public.rewards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_backings_updated_at
  BEFORE UPDATE ON public.backings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to update project stats from backings
CREATE OR REPLACE FUNCTION update_project_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update project current_amount and backers_count
  UPDATE public.projects
  SET
    current_amount = (
      SELECT COALESCE(SUM(amount), 0)
      FROM public.backings
      WHERE project_id = NEW.project_id AND payment_status = 'completed'
    ),
    backers_count = (
      SELECT COUNT(DISTINCT user_id)
      FROM public.backings
      WHERE project_id = NEW.project_id AND payment_status = 'completed'
    )
  WHERE id = NEW.project_id;

  -- Update reward backers_count
  IF NEW.reward_id IS NOT NULL THEN
    UPDATE public.rewards
    SET backers_count = (
      SELECT COUNT(*)
      FROM public.backings
      WHERE reward_id = NEW.reward_id AND payment_status = 'completed'
    )
    WHERE id = NEW.reward_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_project_stats
  AFTER INSERT OR UPDATE ON public.backings
  FOR EACH ROW
  EXECUTE FUNCTION update_project_stats();

-- Function to check if project is funded
CREATE OR REPLACE FUNCTION check_project_funded()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.current_amount >= NEW.goal_amount AND OLD.status = 'active' AND NEW.status = 'active' THEN
    NEW.status := 'funded';
    NEW.funded_at := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_project_funded
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION check_project_funded();

-- Comments
COMMENT ON TABLE public.projects IS 'Proyectos de crowdfunding tipo Kickstarter';
COMMENT ON TABLE public.rewards IS 'Recompensas/tiers de proyectos';
COMMENT ON TABLE public.backings IS 'Respaldos de usuarios a proyectos';
COMMENT ON CONSTRAINT unique_user_project_backing ON public.backings
  IS 'Un usuario solo puede backear un proyecto una vez';


-- ============================================
-- Archivo: supabase/vlockster_05_communities.sql
-- ============================================
-- VLOCKSTER Communities & Social
-- Sistema de comunidades tipo Skool con posts, comments y eventos

-- Communities table
CREATE TABLE IF NOT EXISTS public.communities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_private BOOLEAN DEFAULT FALSE,
  member_count INTEGER DEFAULT 0,
  post_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community memberships
CREATE TABLE IF NOT EXISTS public.community_memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Un usuario solo puede tener una membresía por comunidad
  CONSTRAINT unique_user_community UNIQUE (community_id, user_id)
);

-- Posts table
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  pinned BOOLEAN DEFAULT FALSE,
  locked BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Post likes (para evitar duplicados)
CREATE TABLE IF NOT EXISTS public.post_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT unique_post_like UNIQUE (post_id, user_id)
);

-- Comment likes
CREATE TABLE IF NOT EXISTS public.comment_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comment_id UUID NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT unique_comment_like UNIQUE (comment_id, user_id)
);

-- Indexes for communities
CREATE INDEX idx_communities_slug ON public.communities(slug);
CREATE INDEX idx_communities_owner ON public.communities(owner_id);
CREATE INDEX idx_communities_private ON public.communities(is_private);

-- Indexes for memberships
CREATE INDEX idx_memberships_community ON public.community_memberships(community_id);
CREATE INDEX idx_memberships_user ON public.community_memberships(user_id);

-- Indexes for posts
CREATE INDEX idx_posts_community ON public.posts(community_id);
CREATE INDEX idx_posts_user ON public.posts(user_id);
CREATE INDEX idx_posts_pinned ON public.posts(pinned) WHERE pinned = TRUE;
CREATE INDEX idx_posts_created ON public.posts(created_at DESC);

-- Indexes for comments
CREATE INDEX idx_comments_post ON public.comments(post_id);
CREATE INDEX idx_comments_user ON public.comments(user_id);
CREATE INDEX idx_comments_parent ON public.comments(parent_comment_id);

-- Indexes for likes
CREATE INDEX idx_post_likes_post ON public.post_likes(post_id);
CREATE INDEX idx_post_likes_user ON public.post_likes(user_id);
CREATE INDEX idx_comment_likes_comment ON public.comment_likes(comment_id);
CREATE INDEX idx_comment_likes_user ON public.comment_likes(user_id);

-- Triggers
CREATE TRIGGER update_communities_updated_at
  BEFORE UPDATE ON public.communities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to update post stats
CREATE OR REPLACE FUNCTION update_post_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME = 'comments' THEN
    -- Update comment count
    UPDATE public.posts
    SET comment_count = (
      SELECT COUNT(*)
      FROM public.comments
      WHERE post_id = NEW.post_id
    )
    WHERE id = NEW.post_id;
  ELSIF TG_TABLE_NAME = 'post_likes' THEN
    -- Update like count
    UPDATE public.posts
    SET like_count = (
      SELECT COUNT(*)
      FROM public.post_likes
      WHERE post_id = NEW.post_id
    )
    WHERE id = NEW.post_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_post_comment_count
  AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION update_post_stats();

CREATE TRIGGER trigger_update_post_like_count
  AFTER INSERT OR DELETE ON public.post_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_post_stats();

-- Function to update comment like count
CREATE OR REPLACE FUNCTION update_comment_like_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.comments
  SET like_count = (
    SELECT COUNT(*)
    FROM public.comment_likes
    WHERE comment_id = NEW.comment_id
  )
  WHERE id = NEW.comment_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_comment_like_count
  AFTER INSERT OR DELETE ON public.comment_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_comment_like_count();

-- Function to update community stats
CREATE OR REPLACE FUNCTION update_community_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME = 'community_memberships' THEN
    -- Update member count
    UPDATE public.communities
    SET member_count = (
      SELECT COUNT(*)
      FROM public.community_memberships
      WHERE community_id = NEW.community_id
    )
    WHERE id = NEW.community_id;
  ELSIF TG_TABLE_NAME = 'posts' THEN
    -- Update post count
    UPDATE public.communities
    SET post_count = (
      SELECT COUNT(*)
      FROM public.posts
      WHERE community_id = NEW.community_id
    )
    WHERE id = NEW.community_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_community_member_count
  AFTER INSERT OR DELETE ON public.community_memberships
  FOR EACH ROW
  EXECUTE FUNCTION update_community_stats();

CREATE TRIGGER trigger_update_community_post_count
  AFTER INSERT OR DELETE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION update_community_stats();

-- Comments
COMMENT ON TABLE public.communities IS 'Comunidades estilo Skool para discusiones y cursos';
COMMENT ON TABLE public.community_memberships IS 'Membresías de usuarios en comunidades';
COMMENT ON TABLE public.posts IS 'Publicaciones dentro de comunidades';
COMMENT ON TABLE public.comments IS 'Comentarios en posts (con soporte de hilos)';


-- ============================================
-- Archivo: supabase/vlockster_06_moderation.sql
-- ============================================
-- VLOCKSTER Moderation & Reports
-- Sistema de reportes y moderación de contenido

-- Reports table
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('video', 'project', 'post', 'comment', 'profile')),
  content_id UUID NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN (
    'spam',
    'harassment',
    'inappropriate_content',
    'copyright',
    'misinformation',
    'violence',
    'hate_speech',
    'other'
  )),
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'resolved', 'dismissed')),
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT,
  action_taken TEXT CHECK (action_taken IN (
    'none',
    'warning_issued',
    'content_removed',
    'user_suspended',
    'user_banned'
  )),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Un usuario no puede reportar el mismo contenido más de una vez
  CONSTRAINT unique_reporter_content UNIQUE (reporter_id, content_type, content_id)
);

-- Waitlist table (para early access y beta testing)
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  interest TEXT CHECK (interest IN ('creator', 'backer', 'viewer', 'all')),
  referral_source TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'invited', 'joined')),
  invited_at TIMESTAMP WITH TIME ZONE,
  joined_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table (para sistema de notificaciones)
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'project_backed',
    'project_funded',
    'project_update',
    'comment_reply',
    'post_like',
    'comment_like',
    'new_follower',
    'creator_approved',
    'report_resolved',
    'system'
  )),
  title TEXT NOT NULL,
  content TEXT,
  link TEXT, -- URL a donde redirigir
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for reports
CREATE INDEX idx_reports_reporter ON public.reports(reporter_id);
CREATE INDEX idx_reports_content ON public.reports(content_type, content_id);
CREATE INDEX idx_reports_status ON public.reports(status);
CREATE INDEX idx_reports_reviewed_by ON public.reports(reviewed_by);

-- Indexes for waitlist
CREATE INDEX idx_waitlist_email ON public.waitlist(email);
CREATE INDEX idx_waitlist_status ON public.waitlist(status);
CREATE INDEX idx_waitlist_interest ON public.waitlist(interest);

-- Indexes for notifications
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read) WHERE read = FALSE;
CREATE INDEX idx_notifications_created ON public.notifications(created_at DESC);

-- Triggers
CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-mark notification as reviewed
CREATE OR REPLACE FUNCTION mark_report_reviewed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IN ('resolved', 'dismissed') AND OLD.status = 'pending' THEN
    NEW.reviewed_at := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_mark_report_reviewed
  BEFORE UPDATE ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION mark_report_reviewed();

-- Comments
COMMENT ON TABLE public.reports IS 'Sistema de reportes de contenido inapropiado';
COMMENT ON TABLE public.waitlist IS 'Lista de espera para early access y beta testing';
COMMENT ON TABLE public.notifications IS 'Notificaciones en tiempo real para usuarios';
COMMENT ON COLUMN public.reports.content_type IS 'Tipo de contenido reportado';
COMMENT ON COLUMN public.reports.content_id IS 'ID del contenido reportado (referencia genérica)';


-- ============================================
-- Archivo: supabase/vlockster_07_rls_policies.sql
-- ============================================
-- VLOCKSTER Row Level Security Policies
-- Políticas de seguridad para todas las tablas

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================

-- Anyone can view public profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can update their own profile (except role)
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    -- Prevent users from changing their own role
    role = (SELECT role FROM public.profiles WHERE id = auth.uid())
  );

-- Admins can update any profile
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- CREATOR REQUESTS POLICIES
-- ============================================

-- Users can view their own requests
CREATE POLICY "Users can view own creator requests"
  ON public.creator_requests FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all requests
CREATE POLICY "Admins can view all creator requests"
  ON public.creator_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Viewers can create requests
CREATE POLICY "Viewers can create creator requests"
  ON public.creator_requests FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'viewer'
    )
  );

-- Admins can update requests
CREATE POLICY "Admins can update creator requests"
  ON public.creator_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- VIDEOS POLICIES
-- ============================================

-- Public videos are viewable by everyone
CREATE POLICY "Public videos are viewable by everyone"
  ON public.videos FOR SELECT
  USING (visibility = 'public');

-- Members-only videos require authentication
CREATE POLICY "Members can view member videos"
  ON public.videos FOR SELECT
  USING (
    visibility = 'members' AND
    auth.uid() IS NOT NULL
  );

-- Backers-only videos require backing
CREATE POLICY "Backers can view backer videos"
  ON public.videos FOR SELECT
  USING (
    visibility = 'backers' AND
    EXISTS (
      SELECT 1 FROM public.backings
      WHERE user_id = auth.uid() AND payment_status = 'completed'
    )
  );

-- Creators can manage their own videos
CREATE POLICY "Creators can manage own videos"
  ON public.videos FOR ALL
  USING (auth.uid() = uploader_id)
  WITH CHECK (
    auth.uid() = uploader_id AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('creator', 'admin')
    )
  );

-- ============================================
-- VIDEO METRICS POLICIES
-- ============================================

-- Users can view their own metrics
CREATE POLICY "Users can view own video metrics"
  ON public.video_metrics FOR SELECT
  USING (auth.uid() = viewer_id);

-- Users can insert/update their own metrics
CREATE POLICY "Users can track their own viewing"
  ON public.video_metrics FOR ALL
  USING (auth.uid() = viewer_id)
  WITH CHECK (auth.uid() = viewer_id);

-- Creators can view metrics of their videos
CREATE POLICY "Creators can view metrics of their videos"
  ON public.video_metrics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.videos
      WHERE id = video_metrics.video_id AND uploader_id = auth.uid()
    )
  );

-- ============================================
-- PROJECTS POLICIES
-- ============================================

-- Everyone can view active projects
CREATE POLICY "Active projects are viewable by everyone"
  ON public.projects FOR SELECT
  USING (status IN ('active', 'funded', 'completed'));

-- Creators can view their own drafts
CREATE POLICY "Creators can view own draft projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = creator_id);

-- Creators can create projects
CREATE POLICY "Creators can create projects"
  ON public.projects FOR INSERT
  WITH CHECK (
    auth.uid() = creator_id AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('creator', 'admin')
    )
  );

-- Creators can update their own projects
CREATE POLICY "Creators can update own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

-- Creators and admins can delete projects
CREATE POLICY "Creators can delete own projects"
  ON public.projects FOR DELETE
  USING (
    auth.uid() = creator_id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- REWARDS POLICIES
-- ============================================

-- Everyone can view rewards of visible projects
CREATE POLICY "Everyone can view rewards"
  ON public.rewards FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = rewards.project_id AND status IN ('active', 'funded', 'completed')
    )
  );

-- Creators can manage rewards of their projects
CREATE POLICY "Creators can manage own project rewards"
  ON public.rewards FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = rewards.project_id AND creator_id = auth.uid()
    )
  );

-- ============================================
-- BACKINGS POLICIES
-- ============================================

-- Users can view their own backings
CREATE POLICY "Users can view own backings"
  ON public.backings FOR SELECT
  USING (auth.uid() = user_id);

-- Creators can view backings of their projects
CREATE POLICY "Creators can view backings of their projects"
  ON public.backings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = backings.project_id AND creator_id = auth.uid()
    )
  );

-- Authenticated users can create backings
CREATE POLICY "Authenticated users can create backings"
  ON public.backings FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    -- Cannot back your own project
    NOT EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = backings.project_id AND creator_id = auth.uid()
    )
  );

-- ============================================
-- COMMUNITIES POLICIES
-- ============================================

-- Public communities are viewable by everyone
CREATE POLICY "Public communities are viewable by everyone"
  ON public.communities FOR SELECT
  USING (is_private = FALSE);

-- Members can view private communities
CREATE POLICY "Members can view private communities"
  ON public.communities FOR SELECT
  USING (
    is_private = TRUE AND
    EXISTS (
      SELECT 1 FROM public.community_memberships
      WHERE community_id = communities.id AND user_id = auth.uid()
    )
  );

-- Creators and admins can create communities
CREATE POLICY "Creators can create communities"
  ON public.communities FOR INSERT
  WITH CHECK (
    auth.uid() = owner_id AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('creator', 'admin')
    )
  );

-- Owners and admins can update communities
CREATE POLICY "Owners can update communities"
  ON public.communities FOR UPDATE
  USING (
    auth.uid() = owner_id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- COMMUNITY MEMBERSHIPS POLICIES
-- ============================================

-- Members can view memberships of their communities
CREATE POLICY "Members can view community memberships"
  ON public.community_memberships FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.community_memberships cm
      WHERE cm.community_id = community_memberships.community_id
        AND cm.user_id = auth.uid()
    )
  );

-- Users can join public communities
CREATE POLICY "Users can join public communities"
  ON public.community_memberships FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.communities
      WHERE id = community_memberships.community_id AND is_private = FALSE
    )
  );

-- Users can leave communities
CREATE POLICY "Users can leave communities"
  ON public.community_memberships FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- POSTS & COMMENTS POLICIES
-- ============================================

-- Anyone can view posts in public communities
CREATE POLICY "Posts in public communities are viewable"
  ON public.posts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.communities
      WHERE id = posts.community_id AND is_private = FALSE
    )
  );

-- Members can view posts in private communities
CREATE POLICY "Members can view posts in private communities"
  ON public.posts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.community_memberships
      WHERE community_id = posts.community_id AND user_id = auth.uid()
    )
  );

-- Members can create posts
CREATE POLICY "Members can create posts"
  ON public.posts FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.community_memberships
      WHERE community_id = posts.community_id AND user_id = auth.uid()
    )
  );

-- Authors can update their own posts
CREATE POLICY "Authors can update own posts"
  ON public.posts FOR UPDATE
  USING (auth.uid() = user_id);

-- Authors and moderators can delete posts
CREATE POLICY "Authors and moderators can delete posts"
  ON public.posts FOR DELETE
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.community_memberships
      WHERE community_id = posts.community_id
        AND user_id = auth.uid()
        AND role IN ('moderator', 'admin')
    )
  );

-- Similar policies for comments
CREATE POLICY "Comments are viewable with posts"
  ON public.comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.posts p
      JOIN public.communities c ON c.id = p.community_id
      WHERE p.id = comments.post_id
        AND (
          c.is_private = FALSE OR
          EXISTS (
            SELECT 1 FROM public.community_memberships
            WHERE community_id = c.id AND user_id = auth.uid()
          )
        )
    )
  );

CREATE POLICY "Members can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.posts p
      JOIN public.community_memberships cm ON cm.community_id = p.community_id
      WHERE p.id = comments.post_id AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Authors can update own comments"
  ON public.comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Authors and moderators can delete comments"
  ON public.comments FOR DELETE
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.posts p
      JOIN public.community_memberships cm ON cm.community_id = p.community_id
      WHERE p.id = comments.post_id
        AND cm.user_id = auth.uid()
        AND cm.role IN ('moderator', 'admin')
    )
  );

-- ============================================
-- LIKES POLICIES
-- ============================================

CREATE POLICY "Users can manage their own post likes"
  ON public.post_likes FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own comment likes"
  ON public.comment_likes FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- REPORTS POLICIES
-- ============================================

CREATE POLICY "Users can view their own reports"
  ON public.reports FOR SELECT
  USING (auth.uid() = reporter_id);

CREATE POLICY "Admins can view all reports"
  ON public.reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Authenticated users can create reports"
  ON public.reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Admins can update reports"
  ON public.reports FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- NOTIFICATIONS POLICIES
-- ============================================

CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true); -- Controlled by backend

-- ============================================
-- WAITLIST POLICIES (public insert)
-- ============================================

CREATE POLICY "Anyone can join waitlist"
  ON public.waitlist FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view waitlist"
  ON public.waitlist FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update waitlist"
  ON public.waitlist FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );


-- ============================================
-- Archivo: supabase/vlockster_08_triggers.sql
-- ============================================
-- VLOCKSTER Triggers & Automation
-- Triggers adicionales y funciones auxiliares

-- ============================================
-- AUTO-CREATE PROFILE ON USER SIGNUP
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'viewer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- NOTIFICATION TRIGGERS
-- ============================================

-- Notify creator when project is backed
CREATE OR REPLACE FUNCTION notify_project_backed()
RETURNS TRIGGER AS $$
DECLARE
  project_title TEXT;
  creator_id UUID;
BEGIN
  IF NEW.payment_status = 'completed' THEN
    SELECT title, projects.creator_id INTO project_title, creator_id
    FROM public.projects
    WHERE id = NEW.project_id;

    INSERT INTO public.notifications (user_id, type, title, content, link)
    VALUES (
      creator_id,
      'project_backed',
      'Nuevo respaldo en tu proyecto',
      'Recibiste un respaldo de $' || NEW.amount || ' en "' || project_title || '"',
      '/projects/' || NEW.project_id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_project_backed
  AFTER INSERT OR UPDATE ON public.backings
  FOR EACH ROW
  EXECUTE FUNCTION notify_project_backed();

-- Notify creator when project is funded
CREATE OR REPLACE FUNCTION notify_project_funded()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'funded' AND OLD.status = 'active' THEN
    INSERT INTO public.notifications (user_id, type, title, content, link)
    VALUES (
      NEW.creator_id,
      'project_funded',
      '¡Proyecto financiado!',
      'Tu proyecto "' || NEW.title || '" alcanzó su meta de financiamiento',
      '/projects/' || NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_project_funded
  AFTER UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION notify_project_funded();

-- Notify user when creator request is approved
CREATE OR REPLACE FUNCTION notify_creator_approved()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
    -- Update user role to creator
    UPDATE public.profiles
    SET role = 'creator'
    WHERE id = NEW.user_id;

    -- Send notification
    INSERT INTO public.notifications (user_id, type, title, content, link)
    VALUES (
      NEW.user_id,
      'creator_approved',
      '¡Solicitud aprobada!',
      'Tu solicitud para convertirte en creator ha sido aprobada. Ya puedes crear proyectos.',
      '/dashboard'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_creator_approved
  AFTER UPDATE ON public.creator_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_creator_approved();

-- Notify post author when someone comments
CREATE OR REPLACE FUNCTION notify_post_comment()
RETURNS TRIGGER AS $$
DECLARE
  post_author UUID;
  post_title TEXT;
BEGIN
  SELECT user_id, title INTO post_author, post_title
  FROM public.posts
  WHERE id = NEW.post_id;

  -- Only notify if commenter is not the author
  IF post_author != NEW.user_id THEN
    INSERT INTO public.notifications (user_id, type, title, content, link)
    VALUES (
      post_author,
      'comment_reply',
      'Nuevo comentario en tu post',
      'Alguien comentó en "' || post_title || '"',
      '/community/post/' || NEW.post_id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_post_comment
  AFTER INSERT ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION notify_post_comment();

-- ============================================
-- AUTO-JOIN CREATOR TO OWN COMMUNITIES
-- ============================================

CREATE OR REPLACE FUNCTION auto_join_own_community()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.community_memberships (community_id, user_id, role)
  VALUES (NEW.id, NEW.owner_id, 'admin');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_join_own_community
  AFTER INSERT ON public.communities
  FOR EACH ROW
  EXECUTE FUNCTION auto_join_own_community();

-- ============================================
-- PREVENT SELF-BACKING
-- ============================================

CREATE OR REPLACE FUNCTION prevent_self_backing()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.projects
    WHERE id = NEW.project_id AND creator_id = NEW.user_id
  ) THEN
    RAISE EXCEPTION 'No puedes respaldar tu propio proyecto';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_prevent_self_backing
  BEFORE INSERT ON public.backings
  FOR EACH ROW
  EXECUTE FUNCTION prevent_self_backing();

-- ============================================
-- GENERATE UNIQUE SLUG FOR PROFILES
-- ============================================

CREATE OR REPLACE FUNCTION generate_profile_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  IF NEW.public_profile_slug IS NULL AND NEW.name IS NOT NULL THEN
    -- Convert name to slug
    base_slug := lower(regexp_replace(NEW.name, '[^a-zA-Z0-9]+', '-', 'g'));
    base_slug := trim(both '-' from base_slug);
    final_slug := base_slug;

    -- Check for uniqueness and append counter if needed
    WHILE EXISTS (SELECT 1 FROM public.profiles WHERE public_profile_slug = final_slug) LOOP
      counter := counter + 1;
      final_slug := base_slug || '-' || counter;
    END LOOP;

    NEW.public_profile_slug := final_slug;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_profile_slug
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION generate_profile_slug();

-- ============================================
-- CLOSE EXPIRED PROJECTS
-- ============================================

CREATE OR REPLACE FUNCTION close_expired_projects()
RETURNS void AS $$
BEGIN
  UPDATE public.projects
  SET status = 'cancelled'
  WHERE status = 'active'
    AND deadline < CURRENT_DATE
    AND current_amount < goal_amount;
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to run daily (requires pg_cron extension)
-- Note: This needs to be set up separately in Supabase dashboard
-- SELECT cron.schedule('close-expired-projects', '0 0 * * *', 'SELECT close_expired_projects()');

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON FUNCTION public.handle_new_user() IS 'Auto-crea perfil cuando un usuario se registra';
COMMENT ON FUNCTION notify_project_backed() IS 'Notifica al creator cuando su proyecto recibe un backing';
COMMENT ON FUNCTION notify_project_funded() IS 'Notifica al creator cuando su proyecto alcanza la meta';
COMMENT ON FUNCTION notify_creator_approved() IS 'Notifica al usuario cuando su solicitud de creator es aprobada';
COMMENT ON FUNCTION prevent_self_backing() IS 'Previene que un creator respalde su propio proyecto';
COMMENT ON FUNCTION generate_profile_slug() IS 'Genera slug único para perfiles públicos';
COMMENT ON FUNCTION close_expired_projects() IS 'Cierra proyectos expirados automáticamente';


