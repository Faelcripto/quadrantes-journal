'use client';
import {useEffect,useState} from 'react';
import {useRouter} from 'next/navigation';
import {Target,Newspaper,Radio,Calculator,ExternalLink} from 'lucide-react';
import type {SiteContent} from '@/lib/site-content';
import ForexCalculator from './forex-calculator';
import NewsImpact from './news-impact';
import './community-bar.css';
const liveNow=(c:SiteContent['live'],now:number)=>c.liveStatus==='Ao vivo'&&!!c.url&&Date.parse(c.endsAt)>now;
export default function CommunityBar({content,view,onSelect,user}:{content:SiteContent;view:string;onSelect:(v:string)=>void;user:string|null}){
 const router=useRouter(),[now,setNow]=useState(0),[seen,setSeen]=useState(''),[ready,setReady]=useState(false);
 const key='quadrantes:radar-seen:'+user;
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(now||Date.now()));
 const version=content.radar.cards.filter(c=>c.date<=today).map(c=>c.lastEdited||c.date).sort().at(-1)||'';
 useEffect(()=>{setReady(false);setSeen('');try{setSeen(localStorage.getItem(key)||'')}catch{}setReady(true)},[key]);
 useEffect(()=>{if(view==='Radar do dia'&&ready){setSeen(version);try{localStorage.setItem(key,version)}catch{}}},[view,version,key,ready]);
 useEffect(()=>{setNow(Date.now());const refresh=()=>{setNow(Date.now());router.refresh()};const timer=setInterval(()=>{if(document.visibilityState==='visible')refresh()},60000);window.addEventListener('focus',refresh);return()=>{clearInterval(timer);window.removeEventListener('focus',refresh)}},[router]);
 const active=liveNow(content.live,now);
 return <nav className="community-bar" aria-label="Conteúdo e ferramentas"><div className="community-caption">MÉTODO DOS QUADRANTES <small>Conteúdo e ferramentas</small></div><div className="community-tabs">{([['Radar do dia',Target],['Notícias',Newspaper],['Live',Radio],['Calculadora de lotes',Calculator]] as const).map(([name,Icon])=><button key={name} className={(view===name?'selected ':'')+(name==='Live'&&active?'is-live':'')} aria-current={view===name?'page':undefined} onClick={()=>onSelect(name)}><Icon size={18}/><span>{name}</span>{name==='Notícias'&&<NewsImpact events={content.macro.events}/>}{name==='Radar do dia'&&ready&&version!==seen&&!!version&&<b className="community-badge">Novo</b>}{name==='Live'&&active&&<b className="community-badge live-badge">AO VIVO</b>}</button>)}</div></nav>
}
export function LiveRoom({content,isAdmin}:{content:SiteContent['live'];isAdmin:boolean}){const [now,setNow]=useState(0);useEffect(()=>{setNow(Date.now());const t=setInterval(()=>setNow(Date.now()),15000);return()=>clearInterval(t)},[]);const active=liveNow(content,now);return <section className="panel live-room"><Radio size={36}/><span className={'live-state '+(active?'on':'')}>{active?'AO VIVO AGORA':'TRANSMISSÃO OFFLINE'}</span><h2>{content.title}</h2><p>{content.description}</p>{active?<a className="primary" href={content.url} target="_blank" rel="noopener noreferrer">Assistir à live <ExternalLink size={16}/></a>:<p>A próxima transmissão será sinalizada aqui quando começar.</p>}{isAdmin&&<a className="text-btn" href="/admin">Gerenciar transmissão no Admin</a>}</section>}
export function LotRoom({capital,riskPercent}:{capital:number;riskPercent:number}){const [amount,setAmount]=useState(capital),[risk,setRisk]=useState(riskPercent);return <div><section className="panel lot-inputs"><label>Capital da simulação (USD)<input type="number" min="1" step="any" value={amount} onChange={e=>setAmount(Number(e.target.value))}/></label><label>Risco por operação (%)<input type="number" min="0.01" max="100" step="any" value={risk} onChange={e=>setRisk(Number(e.target.value))}/></label><small>Valores iniciais do seu plano pessoal. Alterar esta simulação não modifica o plano.</small></section><ForexCalculator capital={amount} riskPercent={risk}/></div>}
