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
  EXECUTE FUNCTION public.profiles;

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

DROP TRIGGER IF EXISTS trigger_notify_project_backed ON public.backings;
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

DROP TRIGGER IF EXISTS trigger_notify_project_funded ON public.projects;
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

DROP TRIGGER IF EXISTS trigger_notify_creator_approved ON public.creator_requests;
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

DROP TRIGGER IF EXISTS trigger_notify_post_comment ON public.comments;
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

DROP TRIGGER IF EXISTS trigger_auto_join_own_community ON public.communities;
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

DROP TRIGGER IF EXISTS trigger_prevent_self_backing ON public.backings;
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

DROP TRIGGER IF EXISTS trigger_generate_profile_slug ON public.profiles;
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

COMMENT ON FUNCTION public.profiles;
COMMENT ON FUNCTION notify_project_backed() IS 'Notifica al creator cuando su proyecto recibe un backing';
COMMENT ON FUNCTION notify_project_funded() IS 'Notifica al creator cuando su proyecto alcanza la meta';
COMMENT ON FUNCTION notify_creator_approved() IS 'Notifica al usuario cuando su solicitud de creator es aprobada';
COMMENT ON FUNCTION prevent_self_backing() IS 'Previene que un creator respalde su propio proyecto';
COMMENT ON FUNCTION generate_profile_slug() IS 'Genera slug único para perfiles públicos';
COMMENT ON FUNCTION close_expired_projects() IS 'Cierra proyectos expirados automáticamente';
