import {createClient} from '@/lib/supabase/server';
import {diaryEntrySchema,diaryEditSchema,diaryDeleteSchema} from '@/lib/emotional-diary';
import {z} from 'zod';
export const dynamic='force-dynamic';
const columns='id,entry_date,title,body,emotion,revision,created_at,updated_at';
const reply=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'private, no-store'}});
export async function GET(req:Request){
 try{
  const db=await createClient();const {data:{user}}=await db.auth.getUser();
  if(!user)return reply({error:'Entre com sua conta para acessar seu diário.'},401);
  const offset=Number(new URL(req.url).searchParams.get('offset')||0);
  if(!Number.isInteger(offset)||offset<0||offset>100000)return reply({error:'Página inválida.'},400);
  const {data,error}=await db.from('emotional_entries').select(columns).eq('user_id',user.id).order('entry_date',{ascending:false}).order('created_at',{ascending:false}).order('id',{ascending:false}).range(offset,offset+50);
  if(error)throw error;
  return reply({entries:(data||[]).slice(0,50),hasMore:(data||[]).length>50});
 }catch{return reply({error:'Não foi possível carregar suas anotações. Tente novamente.'},503)}
}
async function mutate(req:Request,method:'POST'|'PATCH'|'DELETE'){
 if(req.headers.get('origin')!==new URL(req.url).origin)return reply({error:'Origem inválida.'},403);
 try{
  const db=await createClient();const {data:{user}}=await db.auth.getUser();
  if(!user)return reply({error:'Entre com sua conta para salvar.'},401);
  const text=await req.text();if(text.length>20000)return reply({error:'Texto muito longo.'},413);
  const raw=JSON.parse(text);
  if(method==='POST'){
   const input=diaryEntrySchema.parse(raw);
   const {data,error}=await db.from('emotional_entries').insert({...input,user_id:user.id}).select(columns).single();
   if(error?.code==='23505'){
    const {data:existing}=await db.from('emotional_entries').select(columns).eq('id',input.id).eq('user_id',user.id).maybeSingle();
    if(existing&&existing.body===input.body&&existing.title===input.title&&existing.entry_date===input.entry_date&&existing.emotion===input.emotion)return reply({entry:existing});
    return reply({error:'Esta anotação já foi alterada. Atualize o histórico antes de tentar novamente.'},409);
   }
   if(error)throw error;return reply({entry:data},201);
  }
  if(method==='PATCH'){
   const {id,revision,...input}=diaryEditSchema.parse(raw);
   const {data,error}=await db.from('emotional_entries').update({...input,revision:revision+1,updated_at:new Date().toISOString()}).eq('id',id).eq('user_id',user.id).eq('revision',revision).select(columns).maybeSingle();
   if(error)throw error;if(!data)return reply({error:'A anotação mudou em outra aba ou não está disponível. Seu texto foi mantido; atualize o histórico.'},409);
   return reply({entry:data});
  }
  const {id,revision}=diaryDeleteSchema.parse(raw);
  const {data,error}=await db.from('emotional_entries').delete().eq('id',id).eq('user_id',user.id).eq('revision',revision).select('id').maybeSingle();
  if(error)throw error;if(!data)return reply({error:'A anotação mudou ou já foi excluída. Atualize o histórico.'},409);
  return reply({ok:true});
 }catch(error){return reply({error:error instanceof z.ZodError||error instanceof SyntaxError?'Confira a data, a emoção e o texto (até 10.000 caracteres).':'Não foi possível salvar. Seu texto foi mantido para tentar novamente.'},error instanceof z.ZodError||error instanceof SyntaxError?400:503)}
}
export const POST=(req:Request)=>mutate(req,'POST');
export const PATCH=(req:Request)=>mutate(req,'PATCH');
export const DELETE=(req:Request)=>mutate(req,'DELETE');
