-- VLOCKSTER Creator Requests
-- Sistema de solicitudes para convertirse en creator

CREATE TABLE IF NOT EXISTS public.creator_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pitch_title TEXT NOT NULL,
  pitch_text TEXT NOT NULL,
  portfolio_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_creator_requests_user ON public.creator_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_creator_requests_status ON public.creator_requests(status);
CREATE INDEX IF NOT EXISTS idx_creator_requests_reviewed_by ON public.creator_requests(reviewed_by);

-- Partial unique index: un usuario solo puede tener una solicitud pending
CREATE UNIQUE INDEX IF NOT EXISTS idx_creator_requests_one_pending_per_user 
  ON public.creator_requests(user_id) 
  WHERE status = 'pending';

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_creator_requests_updated_at ON public.creator_requests;
CREATE TRIGGER update_creator_requests_updated_at
  BEFORE UPDATE ON public.creator_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE public.creator_requests IS 'Solicitudes de usuarios para convertirse en creators';
COMMENT ON INDEX idx_creator_requests_one_pending_per_user
  IS 'Un usuario solo puede tener una solicitud pending a la vez';
