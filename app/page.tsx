import {readSiteContent,isSiteAdmin} from '@/lib/site-content-server';
import Journal from './journal';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
export const dynamic = 'force-dynamic';
export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const [{content},admin]=await Promise.all([readSiteContent(supabase),isSiteAdmin(supabase,user.id)]);
  return <Journal user={user.email || 'Trader'} content={content} isAdmin={admin} />;
}
