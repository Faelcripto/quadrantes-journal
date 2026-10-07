import 'server-only';
import { createClient } from './supabase/server';
import {contentKeys,contentSchemas,defaultContent,type SiteContent} from './site-content';
export async function isSiteAdmin(supabase:Awaited<ReturnType<typeof createClient>>,id:string){
 const {data,error}=await supabase.from('site_admins').select('user_id').eq('user_id',id).maybeSingle();
 if(error) throw error;
 return !!data;
}
export async function readSiteContent(supabase:Awaited<ReturnType<typeof createClient>>,appearanceOnly=false){
 let query=supabase.from('site_content').select('key,payload,revision');
 if(appearanceOnly) query=query.eq('key','appearance');
 const {data,error}=await query;
 if(error) throw error;
 const content=structuredClone(defaultContent),revisions:Record<string,number>={};
 for(const row of data||[]){
  if(!contentKeys.includes(row.key))continue;
  const key=row.key as keyof SiteContent;
  const parsed=contentSchemas[key].safeParse(row.payload);
  if(!parsed.success) throw Error('Conteúdo inválido: '+key);
  Object.assign(content,{[key]:parsed.data});revisions[key]=row.revision;
 }
 return {content,revisions};
}
