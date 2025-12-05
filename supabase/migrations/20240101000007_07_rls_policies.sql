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
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can update their own profile (except role)
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    -- Prevent users from changing their own role
    role = (SELECT role FROM public.profiles WHERE id = auth.uid())
  );

-- Admins can update any profile
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
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
DROP POLICY IF EXISTS "Users can view own creator requests" ON public.creator_requests;
CREATE POLICY "Users can view own creator requests"
  ON public.creator_requests FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all requests
DROP POLICY IF EXISTS "Admins can view all creator requests" ON public.creator_requests;
CREATE POLICY "Admins can view all creator requests"
  ON public.creator_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Viewers can create requests
DROP POLICY IF EXISTS "Viewers can create creator requests" ON public.creator_requests;
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
DROP POLICY IF EXISTS "Admins can update creator requests" ON public.creator_requests;
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
DROP POLICY IF EXISTS "Public videos are viewable by everyone" ON public.videos;
CREATE POLICY "Public videos are viewable by everyone"
  ON public.videos FOR SELECT
  USING (visibility = 'public');

-- Members-only videos require authentication
DROP POLICY IF EXISTS "Members can view member videos" ON public.videos;
CREATE POLICY "Members can view member videos"
  ON public.videos FOR SELECT
  USING (
    visibility = 'members' AND
    auth.uid() IS NOT NULL
  );

-- Backers-only videos require backing
DROP POLICY IF EXISTS "Backers can view backer videos" ON public.videos;
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
DROP POLICY IF EXISTS "Creators can manage own videos" ON public.videos;
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
DROP POLICY IF EXISTS "Users can view own video metrics" ON public.video_metrics;
CREATE POLICY "Users can view own video metrics"
  ON public.video_metrics FOR SELECT
  USING (auth.uid() = viewer_id);

-- Users can insert/update their own metrics
DROP POLICY IF EXISTS "Users can track their own viewing" ON public.video_metrics;
CREATE POLICY "Users can track their own viewing"
  ON public.video_metrics FOR ALL
  USING (auth.uid() = viewer_id)
  WITH CHECK (auth.uid() = viewer_id);

-- Creators can view metrics of their videos
DROP POLICY IF EXISTS "Creators can view metrics of their videos" ON public.video_metrics;
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
DROP POLICY IF EXISTS "Active projects are viewable by everyone" ON public.projects;
CREATE POLICY "Active projects are viewable by everyone"
  ON public.projects FOR SELECT
  USING (status IN ('active', 'funded', 'completed'));

-- Creators can view their own drafts
DROP POLICY IF EXISTS "Creators can view own draft projects" ON public.projects;
CREATE POLICY "Creators can view own draft projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = creator_id);

-- Creators can create projects
DROP POLICY IF EXISTS "Creators can create projects" ON public.projects;
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
DROP POLICY IF EXISTS "Creators can update own projects" ON public.projects;
CREATE POLICY "Creators can update own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

-- Creators and admins can delete projects
DROP POLICY IF EXISTS "Creators can delete own projects" ON public.projects;
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
DROP POLICY IF EXISTS "Everyone can view rewards" ON public.rewards;
CREATE POLICY "Everyone can view rewards"
  ON public.rewards FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = rewards.project_id AND status IN ('active', 'funded', 'completed')
    )
  );

-- Creators can manage rewards of their projects
DROP POLICY IF EXISTS "Creators can manage own project rewards" ON public.rewards;
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
DROP POLICY IF EXISTS "Users can view own backings" ON public.backings;
CREATE POLICY "Users can view own backings"
  ON public.backings FOR SELECT
  USING (auth.uid() = user_id);

-- Creators can view backings of their projects
DROP POLICY IF EXISTS "Creators can view backings of their projects" ON public.backings;
CREATE POLICY "Creators can view backings of their projects"
  ON public.backings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = backings.project_id AND creator_id = auth.uid()
    )
  );

-- Authenticated users can create backings
DROP POLICY IF EXISTS "Authenticated users can create backings" ON public.backings;
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
DROP POLICY IF EXISTS "Public communities are viewable by everyone" ON public.communities;
CREATE POLICY "Public communities are viewable by everyone"
  ON public.communities FOR SELECT
  USING (is_private = FALSE);

-- Members can view private communities
DROP POLICY IF EXISTS "Members can view private communities" ON public.communities;
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
DROP POLICY IF EXISTS "Creators can create communities" ON public.communities;
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
DROP POLICY IF EXISTS "Owners can update communities" ON public.communities;
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
DROP POLICY IF EXISTS "Members can view community memberships" ON public.community_memberships;
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
DROP POLICY IF EXISTS "Users can join public communities" ON public.community_memberships;
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
DROP POLICY IF EXISTS "Users can leave communities" ON public.community_memberships;
CREATE POLICY "Users can leave communities"
  ON public.community_memberships FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- POSTS & COMMENTS POLICIES
-- ============================================

-- Anyone can view posts in public communities
DROP POLICY IF EXISTS "Posts in public communities are viewable" ON public.posts;
CREATE POLICY "Posts in public communities are viewable"
  ON public.posts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.communities
      WHERE id = posts.community_id AND is_private = FALSE
    )
  );

-- Members can view posts in private communities
DROP POLICY IF EXISTS "Members can view posts in private communities" ON public.posts;
CREATE POLICY "Members can view posts in private communities"
  ON public.posts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.community_memberships
      WHERE community_id = posts.community_id AND user_id = auth.uid()
    )
  );

-- Members can create posts
DROP POLICY IF EXISTS "Members can create posts" ON public.posts;
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
DROP POLICY IF EXISTS "Authors can update own posts" ON public.posts;
CREATE POLICY "Authors can update own posts"
  ON public.posts FOR UPDATE
  USING (auth.uid() = user_id);

-- Authors and moderators can delete posts
DROP POLICY IF EXISTS "Authors and moderators can delete posts" ON public.posts;
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
DROP POLICY IF EXISTS "Comments are viewable with posts" ON public.comments;
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

DROP POLICY IF EXISTS "Members can create comments" ON public.comments;
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

DROP POLICY IF EXISTS "Authors can update own comments" ON public.comments;
CREATE POLICY "Authors can update own comments"
  ON public.comments FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Authors and moderators can delete comments" ON public.comments;
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

DROP POLICY IF EXISTS "Users can manage their own post likes" ON public.post_likes;
CREATE POLICY "Users can manage their own post likes"
  ON public.post_likes FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own comment likes" ON public.comment_likes;
CREATE POLICY "Users can manage their own comment likes"
  ON public.comment_likes FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- REPORTS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Users can view their own reports" ON public.reports;
CREATE POLICY "Users can view their own reports"
  ON public.reports FOR SELECT
  USING (auth.uid() = reporter_id);

DROP POLICY IF EXISTS "Admins can view all reports" ON public.reports;
CREATE POLICY "Admins can view all reports"
  ON public.reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Authenticated users can create reports" ON public.reports;
CREATE POLICY "Authenticated users can create reports"
  ON public.reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

DROP POLICY IF EXISTS "Admins can update reports" ON public.reports;
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

DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
CREATE POLICY "System can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true); -- Controlled by backend

-- ============================================
-- WAITLIST POLICIES (public insert)
-- ============================================

DROP POLICY IF EXISTS "Anyone can join waitlist" ON public.waitlist;
CREATE POLICY "Anyone can join waitlist"
  ON public.waitlist FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view waitlist" ON public.waitlist;
CREATE POLICY "Admins can view waitlist"
  ON public.waitlist FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update waitlist" ON public.waitlist;
CREATE POLICY "Admins can update waitlist"
  ON public.waitlist FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
