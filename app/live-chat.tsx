'use client';
import {useEffect,useRef,useState,type FormEvent} from 'react';
import {createClient} from '@/lib/supabase/client';
import './live-chat.css';

export function youtubeEmbed(link:string){
 try { const u=new URL(link), host=u.hostname.replace(/^www\./,'');
 const id=host==='youtu.be'?u.pathname.slice(1):(host==='youtube.com'||host==='m.youtube.com')?(u.pathname==='/watch'?u.searchParams.get('v'):u.pathname.match(/^\/(?:live|embed)\/([^/]+)/)?.[1]):null;
 return id&&/^[\w-]{11}$/.test(id)?'https://www.youtube-nocookie.com/embed/'+id:null;
 }catch{return null}
}
const reactions={money:['💸','Dinheiro voando'],rocket:['🚀','Mercado em alta'],bolt:['⚡','Raio']} as const;
type Reaction=keyof typeof reactions;
type Item={id:string;nickname:string;kind:'text'|Reaction;body:string;created_at:string};
const clock=new Intl.DateTimeFormat('pt-BR',{hour:'2-digit',minute:'2-digit',timeZone:'America/Sao_Paulo'});
const merge=(a:Item[],b:Item[])=>Array.from(new Map([...a,...b].map(m=>[m.id,m])).values()).sort((x,y)=>x.created_at.localeCompare(y.created_at)).slice(-60);
export default function LiveChat({room}:{room:string}){
 const [db]=useState(createClient),[name,setName]=useState(''),[draft,setDraft]=useState(''),[body,setBody]=useState('');
 const [edit,setEdit]=useState(false),[ready,setReady]=useState(false),[online,setOnline]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState(''),[retry,setRetry]=useState(0);
 const [items,setItems]=useState<Item[]>([]),[effects,setEffects]=useState<Item[]>([]);
 const log=useRef<HTMLDivElement>(null),follow=useRef(true);
 useEffect(()=>{let alive=true;setReady(false);setOnline(false);setError('');
 const timers=new Set<ReturnType<typeof setTimeout>>();let channel:ReturnType<typeof db.channel>|undefined;
 async function start(){
 const {data,error:authError}=await db.auth.getUser();if(!alive)return;
 if(authError||!data.user){setError('Entre na sua conta para participar.');return}
 const profile=await db.from('live_chat_names').select('nickname').eq('member',data.user.id).maybeSingle();if(!alive)return;
 if(profile.error){setError('Não foi possível carregar seu apelido.');return}
 const n=profile.data?.nickname||'';setName(n);setDraft(n);setEdit(!n);setReady(true);
 channel=db.channel('live-chat:'+room).on('postgres_changes',{event:'INSERT',schema:'public',table:'live_chat_events',filter:'room=eq.'+room},({new:row})=>{
 if(!alive)return;const m=row as Item;if(m.kind==='text'){setItems(a=>merge(a,[m]));return}
 if(!Object.prototype.hasOwnProperty.call(reactions,m.kind))return;
 setEffects(a=>[...a.slice(-5),m]);const t=setTimeout(()=>{timers.delete(t);setEffects(a=>a.filter(x=>x.id!==m.id))},2100);timers.add(t);
 }).subscribe(async status=>{if(!alive)return;setOnline(status==='SUBSCRIBED');if(status!=='SUBSCRIBED')return;
 const res=await db.from('live_chat_events').select('id,nickname,kind,body,created_at').eq('room',room).eq('kind','text').order('created_at',{ascending:false}).limit(60);
 if(alive){if(res.error)setError('Não foi possível carregar as mensagens anteriores.');else setItems(a=>merge(a,res.data as Item[]))}
 });
 }
 void start().catch(()=>{if(alive)setError('Não foi possível conectar ao chat.')});
 return()=>{alive=false;if(channel)void db.removeChannel(channel);for(const t of timers)clearTimeout(t)};
 },[db,room,retry]);
 useEffect(()=>{if(follow.current&&log.current)log.current.scrollTop=log.current.scrollHeight},[items]);
 async function save(e:FormEvent){e.preventDefault();const value=draft.trim();if(busy||!value)return;setBusy(true);setError('');
 try{const res=name?await db.from('live_chat_names').update({nickname:value}).eq('nickname',name):await db.from('live_chat_names').insert({nickname:value});
 if(res.error){setError(res.error.code==='23505'?'Esse apelido já está em uso. Escolha outro.':'Use de 2 a 24 caracteres: letras, números, espaços, ponto, traço ou sublinhado.');return}
 setName(value);setDraft(value);setEdit(false)}catch{setError('Não foi possível salvar o apelido.')}finally{setBusy(false)}}
 async function send(kind:Item['kind']){if(busy||!name||!online)return;const msg=kind==='text'?body.trim():'';if(kind==='text'&&!msg)return;setBusy(true);setError('');
 try{const res=await db.from('live_chat_events').insert({room,kind,body:msg});if(res.error){setError(res.error.message.includes('Aguarde')?'Aguarde dois segundos antes de enviar novamente.':'Envio não confirmado. Verifique se a live está ativa.');return}
 if(kind==='text'){setBody('');follow.current=true}}catch{setError('Envio não confirmado.')}finally{setBusy(false)}}
 return <section className="ql-chat" aria-label="Chat da live"><header><strong>Chat da live</strong><small>{online?'Conectado':'Desconectado'}</small></header>
 <div className="ql-stage"><div role="log" aria-label="Mensagens da live" ref={log} className="ql-log" onScroll={e=>{const el=e.currentTarget;follow.current=el.scrollHeight-el.scrollTop-el.clientHeight<50}}>
 {items.length===0&&<span className="ql-empty">Mande a primeira pergunta da live.</span>}
 {items.map(m=><div key={m.id}><b>{m.nickname}</b> <time dateTime={m.created_at}>{clock.format(new Date(m.created_at))}</time><div>{m.body}</div></div>)}</div>
 <div aria-hidden="true" className="ql-fx">{effects.map(m=><span key={m.id} className={'ql-'+m.kind} style={{left:(12+(parseInt(m.id.slice(0,2),16)%73))+'%'}}>{m.kind!=='text'&&reactions[m.kind][0]}</span>)}</div></div>
 {ready&&(edit?<form onSubmit={save}><label>Seu nome no chat<input autoComplete="nickname" value={draft} onChange={e=>setDraft(e.target.value)} required minLength={2} maxLength={24} placeholder="Escolha um apelido"/></label><button disabled={busy}>Salvar apelido</button>{name&&<button type="button" onClick={()=>setEdit(false)}>Cancelar</button>}</form>:<><div className="ql-tools"><button onClick={()=>{setDraft(name);setEdit(true)}}>{name} · Editar</button><div>{(Object.keys(reactions) as Reaction[]).map(k=><button key={k} disabled={!online||busy} type="button" title={reactions[k][1]} aria-label={reactions[k][1]} onClick={()=>void send(k)}>{reactions[k][0]}</button>)}</div></div>
 <form onSubmit={e=>{e.preventDefault();void send('text')}}><input aria-label="Mensagem" placeholder="Mande sua pergunta…" maxLength={400} value={body} onChange={e=>setBody(e.target.value)}/><button disabled={!online||busy||!body.trim()}>Enviar</button></form></>)}
 {error&&<div role="alert">{error}</div>}{!online&&<button type="button" onClick={()=>setRetry(i=>i+1)}>Reconectar</button>}</section>
}
