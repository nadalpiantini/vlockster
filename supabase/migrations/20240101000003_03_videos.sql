-- VLOCKSTER Videos & Metrics
-- Sistema de videos con Cloudflare Stream y analytics

-- Videos table
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
CREATE INDEX IF NOT EXISTS idx_videos_uploader ON public.videos(uploader_id);
CREATE INDEX IF NOT EXISTS idx_videos_visibility ON public.videos(visibility);
CREATE INDEX IF NOT EXISTS idx_videos_tags ON public.videos USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_videos_featured ON public.videos(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_videos_published ON public.videos(published_at DESC NULLS LAST);

-- Indexes for metrics
CREATE INDEX IF NOT EXISTS idx_video_metrics_video ON public.video_metrics(video_id);
CREATE INDEX IF NOT EXISTS idx_video_metrics_viewer ON public.video_metrics(viewer_id);
CREATE INDEX IF NOT EXISTS idx_video_metrics_completed ON public.video_metrics(completed) WHERE completed = TRUE;

-- Triggers
DROP TRIGGER IF EXISTS update_videos_updated_at ON public.videos;
CREATE TRIGGER update_videos_updated_at
  BEFORE UPDATE ON public.videos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_video_metrics_updated_at ON public.video_metrics;
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

DROP TRIGGER IF EXISTS trigger_update_video_stats ON public.video_metrics;
CREATE TRIGGER trigger_update_video_stats
  AFTER INSERT OR UPDATE ON public.video_metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_video_stats();

-- Comments
COMMENT ON TABLE public.videos IS 'Videos alojados en Cloudflare Stream';
COMMENT ON TABLE public.video_metrics IS 'Métricas de visualización y engagement por video';
COMMENT ON COLUMN public.videos.stream_id IS 'ID único del video en Cloudflare Stream';
COMMENT ON COLUMN public.videos.visibility IS 'Control de acceso: public, members, backers';
