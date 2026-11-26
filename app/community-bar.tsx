'use client';
import {useEffect,useState} from 'react';
import {useRouter} from 'next/navigation';
import {Layers,Target,Newspaper,Radio,Calculator,ExternalLink} from 'lucide-react';
import type {SiteContent} from '@/lib/site-content';
import ForexCalculator from './forex-calculator';
import NewsImpact from './news-impact';
import './community-bar.css';
import LiveChat, { youtubeEmbed } from './live-chat';
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
 return <nav style={{padding:"16px 10px",borderBottom:"1px solid #303835"}} aria-label="Conteúdo e ferramentas"><div className="community-caption"><small>Central do mercado</small></div><div className="community-tabs" style={{display:"grid",gridTemplateColumns:"1fr",marginTop:8}}>{([['Radar do dia',Target],['Live',Radio],['Estratégias',Layers]] as const).map(([name,Icon])=><button key={name} className={(view===name?'selected ':'')+(name==='Live'&&active?'is-live':'')} aria-current={view===name?'page':undefined} onClick={()=>onSelect(name)}><Icon size={18}/><span>{name==='Radar do dia'?'Radar do Dia':name}</span>{name==='Estratégias'&&<b className="nav-badge">{content.strategies.items.length}</b>}{name==='Radar do dia'&&ready&&version!==seen&&!!version&&<b className="community-badge">Novo</b>}{name==='Live'&&active&&<b className="community-badge live-badge">AO VIVO</b>}</button>)}</div></nav>
}
export function LiveRoom({content,isAdmin}:{content:SiteContent['live'];isAdmin:boolean}){
 const [now,setNow]=useState(0);
 useEffect(()=>{setNow(Date.now());const t=setInterval(()=>setNow(Date.now()),15000);return()=>clearInterval(t)},[]);
 const active=now>0&&liveNow(content,now),embed=active?youtubeEmbed(content.url):null;
 return <section className="ql-studio">
  <header className="ql-heading"><span className={'live-state '+(active?'on':'')}>{active?'AO VIVO':'OFFLINE'}</span><h2>{content.title}</h2></header>
  <div className={'ql-broadcast'+(active?' is-active':'')}>
   <div className="ql-video">
    {embed&&<iframe title="Transmissão ao vivo" src={embed} allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen/>}
    {!active&&<p>A próxima transmissão será sinalizada aqui quando começar.</p>}
    {content.description&&<p>{content.description}</p>}
    <div className="ql-links">{active&&<a href={content.url} target="_blank" rel="noopener noreferrer">{embed?'Abrir no YouTube':'Assistir à transmissão'} <ExternalLink size={15}/></a>}{isAdmin&&<a href="/admin">Gerenciar transmissão</a>}</div>
   </div>
   {active&&<div className="ql-chat-glass"><div className="ql-sky-effects" aria-hidden="true"><i className="ql-flight">🚀</i><i className="ql-flash">ϟ</i><i className="ql-meteor"/></div><LiveChat key={content.endsAt} room={content.endsAt}/></div>}
  </div>
 </section>
}
export function LotRoom({capital,riskPercent}:{capital:number;riskPercent:number}){const [amount,setAmount]=useState(capital),[risk,setRisk]=useState(riskPercent);return <div><section className="panel lot-inputs"><label>Capital da simulação (USD)<input type="number" min="1" step="any" value={amount} onChange={e=>setAmount(Number(e.target.value))}/></label><label>Risco por operação (%)<input type="number" min="0.01" max="100" step="any" value={risk} onChange={e=>setRisk(Number(e.target.value))}/></label><small>Valores iniciais do seu plano pessoal. Alterar esta simulação não modifica o plano.</small></section><ForexCalculator capital={amount} riskPercent={risk}/></div>}
