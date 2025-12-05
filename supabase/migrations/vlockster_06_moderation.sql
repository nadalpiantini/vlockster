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
CREATE INDEX IF NOT EXISTS idx_reports_reporter ON public.profiles;
CREATE INDEX IF NOT EXISTS idx_reports_content ON public.profiles;
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.profiles;
CREATE INDEX IF NOT EXISTS idx_reports_reviewed_by ON public.profiles;

-- Indexes for waitlist
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.profiles;
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON public.profiles;
CREATE INDEX IF NOT EXISTS idx_waitlist_interest ON public.profiles;

-- Indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.profiles;
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.profiles;
CREATE INDEX IF NOT EXISTS idx_notifications_created ON public.profiles;

-- Triggers
DROP TRIGGER IF EXISTS update_reports_updated_at ON public.reports;
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

DROP TRIGGER IF EXISTS trigger_mark_report_reviewed ON public.reports;
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
