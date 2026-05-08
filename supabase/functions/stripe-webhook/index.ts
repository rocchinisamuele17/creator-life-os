import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', { apiVersion: '2023-10-16' });
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature || '', webhookSecret || '');
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') || '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  );

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const uid = session.subscription
        ? (await stripe.subscriptions.retrieve(session.subscription as string))
            .metadata.supabase_uid
        : null;

      if (uid) {
        await supabase.from('profiles').update({
          plan: 'pro',
          subscription_status: 'active',
          stripe_subscription_id: session.subscription,
        }).eq('id', uid);
      }
      break;
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      const uid = sub.metadata.supabase_uid;
      if (uid) {
        await supabase.from('profiles').update({
          plan: 'free',
          subscription_status: 'canceled',
          stripe_subscription_id: null,
        }).eq('id', uid);
      }
      break;
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
});
