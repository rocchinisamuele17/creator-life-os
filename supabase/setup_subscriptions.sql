-- ═══════════════════════════════════════════════════════
-- PRODIGI.LIVE — Paywall AI + Trial 7 giorni
-- Esegui in Supabase SQL Editor (in ordine)
-- ═══════════════════════════════════════════════════════

-- ─── 1. ENUM PER I PIANI ────────────────────────────────
CREATE TYPE subscription_plan AS ENUM ('free', 'pro');
CREATE TYPE subscription_status AS ENUM ('active', 'trialing', 'canceled', 'past_due');

-- ─── 2. TABELLA PROFILES ────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,

  -- Piano e subscription
  plan subscription_plan DEFAULT 'free' NOT NULL,
  subscription_status subscription_status DEFAULT 'trialing' NOT NULL,

  -- Trial
  trial_start TIMESTAMPTZ DEFAULT now(),
  trial_end TIMESTAMPTZ DEFAULT (now() + INTERVAL '7 days'),

  -- Stripe
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,

  -- Limiti usage AI
  ai_calls_today INT DEFAULT 0,
  ai_calls_reset_at DATE DEFAULT CURRENT_DATE,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 3. RLS POLICIES ───────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own profile" ON public.profiles;
CREATE POLICY "Users read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ─── 4. TRIGGER: CREA PROFILO AUTOMATICAMENTE ──────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, plan, subscription_status, trial_start, trial_end)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'free',
    'trialing',
    now(),
    now() + INTERVAL '7 days'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ─── 5. FUNZIONE: L'UTENTE HA ACCESSO PRO? ─────────────
CREATE OR REPLACE FUNCTION public.is_pro(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_plan subscription_plan;
  user_status subscription_status;
  user_trial_end TIMESTAMPTZ;
BEGIN
  SELECT plan, subscription_status, trial_end
  INTO user_plan, user_status, user_trial_end
  FROM public.profiles
  WHERE id = user_id;

  IF user_plan = 'pro' AND user_status = 'active' THEN
    RETURN true;
  END IF;

  IF user_status = 'trialing' AND user_trial_end > now() THEN
    RETURN true;
  END IF;

  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── 6. FUNZIONE RPC: CONTROLLA SUBSCRIPTION ──────────
CREATE OR REPLACE FUNCTION public.get_subscription_info()
RETURNS JSON AS $$
DECLARE
  user_profile public.profiles%ROWTYPE;
BEGIN
  SELECT * INTO user_profile
  FROM public.profiles
  WHERE id = auth.uid();

  IF NOT FOUND THEN
    RETURN json_build_object('error', 'profile_not_found');
  END IF;

  IF user_profile.subscription_status = 'trialing'
     AND user_profile.trial_end <= now() THEN
    UPDATE public.profiles
    SET subscription_status = 'active', plan = 'free'
    WHERE id = auth.uid();
    user_profile.subscription_status := 'active';
    user_profile.plan := 'free';
  END IF;

  RETURN json_build_object(
    'plan', user_profile.plan,
    'status', user_profile.subscription_status,
    'is_pro', public.is_pro(auth.uid()),
    'trial_end', user_profile.trial_end,
    'trial_days_left', GREATEST(0, EXTRACT(DAY FROM user_profile.trial_end - now())::int),
    'stripe_customer_id', user_profile.stripe_customer_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
