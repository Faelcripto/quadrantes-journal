import {cotUrl,validRows} from '@/lib/cot';
import seed from '@/data/cot-snapshot.json';
let cached:{fetchedAt:string;sourceUrl:string;rows:ReturnType<typeof validRows>}|null=null;
export async function GET(){try{if(cached&&Date.now()-Date.parse(cached.fetchedAt)<3600000)return Response.json({...cached,mode:'live'});const res=await fetch(cotUrl,{signal:AbortSignal.timeout(10000)});if(!res.ok)throw Error('CFTC indisponível');const rows=validRows(await res.json());cached={fetchedAt:new Date().toISOString(),sourceUrl:seed.sourceUrl,rows};return Response.json({...cached,mode:'live'},{headers:{'Cache-Control':'private, max-age=3600'}});}catch{return Response.json({...seed,mode:'snapshot',warning:'A consulta à CFTC está indisponível. Exibindo a última edição verificada.'});}}
