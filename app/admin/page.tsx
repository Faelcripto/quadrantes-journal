import {createClient} from '@/lib/supabase/server';
import {isSiteAdmin,readSiteContent} from '@/lib/site-content-server';
import {redirect} from 'next/navigation';
import AdminEditor from './editor';
import './admin.css';
export const dynamic='force-dynamic';
export default async function AdminPage(){
 const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();
 if(!user)redirect('/login');
 if(!await isSiteAdmin(supabase,user.id))redirect('/');
 const {content,revisions}=await readSiteContent(supabase);
 return <AdminEditor initial={content} initialRevisions={revisions}/>;
}
