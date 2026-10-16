import {createClient} from '@/lib/supabase/server';
import {readSiteContent} from '@/lib/site-content-server';
import {courseProgress} from '@/lib/course-progress';
import {z} from 'zod';
export const dynamic='force-dynamic';
const reply=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'private, no-store'}});
const schema=z.object({lessonId:z.string().min(1).max(100),completed:z.boolean()}).strict();
export async function GET(){try{
 const db=await createClient();const {data:{user}}=await db.auth.getUser();if(!user)return reply({error:'Entre para acompanhar suas aulas.'},401);
 const [{content},result]=await Promise.all([readSiteContent(db),db.from('course_progress').select('lesson_id').eq('user_id',user.id).order('lesson_id').range(0,999)]);
 if(result.error)throw result.error;let rows=result.data||[];
 if(rows.length===1000){const more=await db.from('course_progress').select('lesson_id').eq('user_id',user.id).order('lesson_id').range(1000,1999);if(more.error)throw more.error;rows=rows.concat(more.data||[])}
 return reply({course:content.course,completed:rows.map(r=>r.lesson_id)});
}catch{return reply({error:'Não foi possível carregar seu progresso.'},503)}}
export async function PUT(req:Request){
 if(req.headers.get('origin')!==new URL(req.url).origin)return reply({error:'Origem inválida.'},403);
 try{const db=await createClient();const {data:{user}}=await db.auth.getUser();if(!user)return reply({error:'Entre para salvar seu progresso.'},401);
 const raw=await req.text();if(raw.length>2000)return reply({error:'Dados inválidos.'},413);
 const input=schema.parse(JSON.parse(raw));const {content}=await readSiteContent(db);
 if(!courseProgress(content.course,[]).lessons.some(l=>l.id===input.lessonId))return reply({error:'Esta aula não está publicada. Atualize o curso.'},409);
 const result=input.completed?await db.from('course_progress').upsert({user_id:user.id,lesson_id:input.lessonId},{onConflict:'user_id,lesson_id'}):await db.from('course_progress').delete().eq('user_id',user.id).eq('lesson_id',input.lessonId);
 if(result.error)throw result.error;return reply({ok:true});
 }catch(e){return reply({error:e instanceof z.ZodError||e instanceof SyntaxError?'Dados inválidos.':'Não foi possível salvar a conclusão. Tente novamente.'},e instanceof z.ZodError||e instanceof SyntaxError?400:503)}
}
