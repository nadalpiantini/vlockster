-- VLOCKSTER Performance Indexes
-- Optimización de queries frecuentes basada en auditoría

-- Índices para queries de videos
CREATE INDEX IF NOT EXISTS idx_videos_uploader ON public.videos(uploader_id);
CREATE INDEX IF NOT EXISTS idx_videos_visibility_created ON public.videos(visibility, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_genre_created ON public.videos(genre, created_at DESC) WHERE genre IS NOT NULL;

-- Índices para queries de proyectos
CREATE INDEX IF NOT EXISTS idx_projects_creator ON public.projects(creator_id);
CREATE INDEX IF NOT EXISTS idx_projects_status_created ON public.projects(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_deadline ON public.projects(deadline) WHERE status = 'active';

-- Índices para queries de backings
CREATE INDEX IF NOT EXISTS idx_backings_project ON public.backings(project_id);
CREATE INDEX IF NOT EXISTS idx_backings_user ON public.backings(user_id);
CREATE INDEX IF NOT EXISTS idx_backings_status_created ON public.backings(payment_status, created_at DESC);

-- Índices para queries de posts
CREATE INDEX IF NOT EXISTS idx_posts_community_created ON public.posts(community_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_author ON public.posts(author_id);

-- Índices para queries de comentarios
CREATE INDEX IF NOT EXISTS idx_comments_post ON public.comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON public.comments(parent_comment_id) WHERE parent_comment_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_comments_created ON public.comments(created_at DESC);

-- Índices para queries de métricas
CREATE INDEX IF NOT EXISTS idx_video_metrics_video ON public.video_metrics(video_id);
CREATE INDEX IF NOT EXISTS idx_video_metrics_viewer ON public.video_metrics(viewer_id);
CREATE INDEX IF NOT EXISTS idx_video_metrics_created ON public.video_metrics(created_at DESC);

-- Índices compuestos para queries complejas
CREATE INDEX IF NOT EXISTS idx_projects_active_funding ON public.projects(status, current_amount, goal_amount) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_videos_public_popular ON public.videos(visibility, view_count DESC) WHERE visibility = 'public';

-- Comentarios
COMMENT ON INDEX idx_videos_uploader IS 'Optimiza queries de videos por creador';
COMMENT ON INDEX idx_projects_creator IS 'Optimiza queries de proyectos por creador';
COMMENT ON INDEX idx_backings_project IS 'Optimiza queries de backings por proyecto';
COMMENT ON INDEX idx_posts_community_created IS 'Optimiza listado de posts por comunidad ordenado por fecha';

