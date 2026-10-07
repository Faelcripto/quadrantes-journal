import {createClient} from '@/lib/supabase/server';
import {isSiteAdmin} from '@/lib/site-content-server';
import {contentSchemas,contentKeys,type ContentKey} from '@/lib/site-content';
export const dynamic='force-dynamic';
const reply=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'private, no-store'}});
export async function PUT(req:Request){
 if(req.headers.get('origin')!==new URL(req.url).origin)return reply({error:'Origem inválida.'},403);
 try{
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user)return reply({error:'Entre novamente para publicar.'},401);
  if(!await isSiteAdmin(supabase,user.id))return reply({error:'Acesso restrito ao administrador.'},403);
  const raw=await req.text();if(raw.length>500000)return reply({error:'Conteúdo muito grande.'},413);
  const body=JSON.parse(raw);
  if(!contentKeys.includes(body.key)||!Number.isInteger(body.revision)||body.revision<0)return reply({error:'Seção ou versão inválida.'},400);
  const key=body.key as ContentKey,parsed=contentSchemas[key].safeParse(body.payload);
  if(!parsed.success)return reply({error:parsed.error.issues.map(i=>i.path.join(' → ')+': '+i.message).join('\n')},400);
  const record={key,payload:parsed.data,revision:body.revision+1,updated_at:new Date().toISOString()};
  const result=body.revision===0?await supabase.from('site_content').insert(record).select('revision').single():await supabase.from('site_content').update(record).eq('key',key).eq('revision',body.revision).select('revision').maybeSingle();
  if(result.error?.code==='23505'||(!result.error&&!result.data))return reply({error:'Esta seção foi alterada em outra aba. Recarregue antes de editar novamente.'},409);
  if(result.error)throw result.error;
  return reply({revision:result.data!.revision});
 }catch(e){return reply({error:e instanceof SyntaxError?'Dados inválidos.':'Não foi possível publicar. Suas alterações continuam no formulário.'},e instanceof SyntaxError?400:503);}
}
