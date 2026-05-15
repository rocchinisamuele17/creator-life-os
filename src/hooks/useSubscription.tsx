import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { isAdmin as checkIsAdmin } from '../lib/admin';


/* ────────────────────────────────────────────
   TYPES
   ──────────────────────────────────────────── */
export type SubscriptionPlan = 'free' | 'pro';
export type SubscriptionStatus = 'active' | 'trialing' | 'canceled' | 'past_due';

interface SubscriptionState {
  loading: boolean;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  isPro: boolean;
  isTrialing: boolean;
  trialDaysLeft: number;
  trialEnd: string | null;
  stripeCustomerId: string | null;
}

interface SubscriptionContextType extends SubscriptionState {
  canUse: (feature: string) => boolean;
  refresh: () => Promise<void>;
}

/* ────────────────────────────────────────────
   CONTEXT
   ──────────────────────────────────────────── */
const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const subscription = useSubscriptionInternal();
  return (
    <SubscriptionContext.Provider value={subscription}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription deve essere usato all\'interno di <SubscriptionProvider>');
  return ctx;
}

/* ────────────────────────────────────────────
   INTERNAL HOOK
   ──────────────────────────────────────────── */
function useSubscriptionInternal(): SubscriptionContextType {
  const [user, setUser] = useState<any>(null);
  const [state, setState] = useState<SubscriptionState>({
    loading: true,
    plan: 'free',
    status: 'active',
    isPro: false,
    isTrialing: false,
    trialDaysLeft: 0,
    trialEnd: null,
    stripeCustomerId: null,
  });

  const fetchSubscription = useCallback(async () => {
    try {
      if (!supabase) {
        setState(s => ({ ...s, loading: false }));
        return;
      }
      const { data: { user: u } } = await supabase.auth.getUser();
      setUser(u);
      if (!u) {
        setState(s => ({ ...s, loading: false, isPro: false }));
        return;
      }

      const { data, error } = await supabase.rpc('get_subscription_info');

      if (error) {
        console.error('Errore fetch subscription info:', error);
        setState(s => ({ ...s, loading: false }));
        return;
      }

      setState({
        loading: false,
        plan: data.plan,
        status: data.status,
        isPro: data.is_pro,
        isTrialing: data.status === 'trialing' && data.trial_days_left > 0,
        trialDaysLeft: data.trial_days_left,
        trialEnd: data.trial_end,
        stripeCustomerId: data.stripe_customer_id,
      });
    } catch (err) {
      console.error('Catch errore subscription:', err);
      setState(s => ({ ...s, loading: false }));
    }
  }, []);

  useEffect(() => {
    fetchSubscription();

    if (!supabase) return;

    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange(() => {
      fetchSubscription();
    });

    return () => authSub.unsubscribe();
  }, [fetchSubscription]);

  const canUse = useCallback((feature: string) => {
    const proFeatures = [
      'ai_copilot',
      'ai_proposal',
      'growth_simulator',
      'export_pdf',
      'advanced_analytics',
      'themes',
      'unlimited_habits',
      'unlimited_pipeline',
      'unlimited_deals',
      'full_journal',
    ];

    const isAdmin = checkIsAdmin(user?.email);

    if (isAdmin) return true;

    if (!proFeatures.includes(feature)) return true;
    return state.isPro;
  }, [state.isPro, user?.email]);

  return {
    ...state,
    canUse,
    refresh: fetchSubscription,
  };
}

export default useSubscription;
