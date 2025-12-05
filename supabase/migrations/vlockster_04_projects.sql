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
CREATE INDEX IF NOT EXISTS idx_projects_creator ON public.profiles;
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.profiles;
CREATE INDEX IF NOT EXISTS idx_projects_deadline ON public.profiles;
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.profiles;
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.profiles;

-- Indexes for rewards
CREATE INDEX IF NOT EXISTS idx_rewards_project ON public.profiles;
CREATE INDEX IF NOT EXISTS idx_rewards_position ON public.profiles;

-- Indexes for backings
CREATE INDEX IF NOT EXISTS idx_backings_user ON public.profiles;
CREATE INDEX IF NOT EXISTS idx_backings_project ON public.profiles;
CREATE INDEX IF NOT EXISTS idx_backings_payment_status ON public.profiles;

-- Triggers
DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_rewards_updated_at ON public.rewards;
CREATE TRIGGER update_rewards_updated_at
  BEFORE UPDATE ON public.rewards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_backings_updated_at ON public.backings;
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

DROP TRIGGER IF EXISTS trigger_update_project_stats ON public.backings;
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

DROP TRIGGER IF EXISTS trigger_check_project_funded ON public.projects;
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
