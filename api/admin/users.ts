import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  // Get the Authorization header to verify it's the admin
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Missing Authorization header' }), { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');
  
  // Verify the user token
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
    return new Response(JSON.stringify({ error: 'Missing Supabase environment variables. Make sure SUPABASE_SERVICE_ROLE_KEY is set in Vercel.' }), { status: 500 });
  }

  // 1. Verify who is requesting this
  const authClient = createClient(supabaseUrl, supabaseAnonKey);
  const { data: { user }, error: authError } = await authClient.auth.getUser(token);

  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
  }

  // 2. Check if the requester is the admin
  const adminEmails = ['liveprodigi@gmail.com', 'rocchinisamuele17@gmail.com'];
  if (!user.email || !adminEmails.includes(user.email.toLowerCase().trim())) {
    return new Response(JSON.stringify({ error: 'Forbidden: You are not the admin' }), { status: 403 });
  }

  // 3. Admin verified. Fetch all users using the Service Role Key
  const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const { data: usersData, error: usersError } = await adminClient.auth.admin.listUsers();

  if (usersError) {
    return new Response(JSON.stringify({ error: usersError.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ users: usersData.users }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
