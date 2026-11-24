'use client';
import {useEffect,useState} from 'react';
import {useRouter} from 'next/navigation';
import {Target,ArrowUpRight} from 'lucide-react';
import type {SiteContent} from '@/lib/site-content';
import './radar-day.css';
import {radarDay as day,nextRadarMidnight} from '@/lib/radar-clock';
const postTime=new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Sao_Paulo',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
function Chart({url,asset}:{url:string;asset:string}){const [failed,setFailed]=useState(false);return failed?<p className="radar-image-error">Imagem indisponível.</p>:<a href={url} target="_blank" rel="noopener noreferrer" aria-label={'Ampliar gráfico de '+asset}><img src={url} alt={'Análise do gráfico de '+asset} decoding="async" referrerPolicy="no-referrer" onError={()=>setFailed(true)}/><span>Ampliar gráfico <ArrowUpRight size={14}/></span></a>}
export default function RadarDay({content,isAdmin}:{content:SiteContent['radar'];isAdmin:boolean}){
 const router=useRouter(),[today,setToday]=useState(day);
 useEffect(()=>{const refresh=()=>{setToday(day());router.refresh()};let boundary:ReturnType<typeof setTimeout>;const arm=()=>{boundary=setTimeout(()=>{refresh();arm()},Math.max(1,nextRadarMidnight()-Date.now()))};arm();const resume=()=>{if(document.visibilityState==='visible')refresh()};document.addEventListener('visibilitychange',resume);const timer=setInterval(()=>{if(document.visibilityState==='visible')refresh()},60000);window.addEventListener('focus',refresh);return()=>{clearTimeout(boundary);document.removeEventListener('visibilitychange',resume);clearInterval(timer);window.removeEventListener('focus',refresh)}},[router]);
 const cards=content.cards.filter(c=>c.date===today).sort((a,b)=>b.date.localeCompare(a.date)||(b.publishedAt||b.lastEdited||'').localeCompare(a.publishedAt||a.lastEdited||''));
 function post(c:typeof cards[number],featured=false){const stamp=c.publishedAt;return <article key={c.id} className={'panel mural-post'+(featured?' mural-lead':'')}><header>{featured&&<small className="mural-tag">Última publicação</small>}<div className="radar-post-heading"><h2>{c.asset} <span>· {c.timeframe}</span></h2>{stamp&&<time dateTime={stamp} title="Horário da publicação · Brasília">{postTime.format(new Date(stamp))}</time>}</div><p>Cenário possível: <strong>{c.setup==='Continuação'?'Continuidade':c.setup}</strong></p></header>{c.imageUrl&&<div className="radar-chart"><Chart key={c.imageUrl} url={c.imageUrl} asset={c.asset}/></div>}<footer>{stamp?'Publicado em '+new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Sao_Paulo',day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date(stamp))+' · Brasília':'Cenário de '+c.date.split('-').reverse().join('/')}</footer></article>}
 return <section aria-label="Mural de cenários">{cards.length?<div className="daily-banners">{cards.map(c=>post(c))}</div>:<div className="panel radar-empty"><Target size={30}/><h2>Ainda não há cenários publicados hoje</h2></div>}{isAdmin&&<p className="mural-admin"><a href="/admin">Gerenciar publicações</a></p>}</section>
}
