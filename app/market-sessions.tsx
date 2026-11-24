'use client';
import {createContext,useContext,useEffect,useMemo,useState,type ReactNode} from 'react';
import {Clock3,Globe2,ArrowRight} from 'lucide-react';
import {sessions,sessionSchedule} from '@/lib/market-sessions';
import './market-sessions.css';
import './economic-wire.css';
const clock=(at:number)=>new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Sao_Paulo',hour:'2-digit',minute:'2-digit'}).format(at);
const dated=(at:number)=>new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Sao_Paulo',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}).format(at);
type MarketClock={now:number|null;state:ReturnType<typeof sessionSchedule>|null};
const MarketContext=createContext<MarketClock>({now:null,state:null});
export function MarketSessionProvider({children}:{children:ReactNode}){
 const [now,setNow]=useState<number|null>(null);
 useEffect(()=>{const tick=()=>setNow(Date.now());tick();const timer=setInterval(tick,30000);window.addEventListener('focus',tick);document.addEventListener('visibilitychange',tick);return()=>{clearInterval(timer);window.removeEventListener('focus',tick);document.removeEventListener('visibilitychange',tick)}},[]);
 const state=useMemo(()=>now===null?null:sessionSchedule(now),[now]);
 return <MarketContext.Provider value={{now,state}}>{children}</MarketContext.Provider>;
}
export function FocusPairs({featured=false}:{featured?:boolean}={}){
 const {state}=useContext(MarketContext);
 if(featured)return <section className="panel" style={{padding:'20px 24px',marginBottom:18,borderColor:'#276747'}}><small className="eyebrow">{state?.active.map(w=>w.session.name).join(' + ')||'SESSÕES FOREX'}</small><h2 style={{fontSize:22,margin:'6px 0 12px'}}>Ativos para acompanhar agora</h2>{state?.assets.length?<><div style={{display:'flex',flexWrap:'wrap',gap:8}}>{state.assets.slice(0,3).map(a=><strong key={a} style={{color:'#82ffb6',background:'#10291e',border:'1px solid #32794d',borderRadius:6,padding:'6px 12px',fontSize:20}}>{a}</strong>)}</div><p>Pares em destaque pelo horário da sessão. Não é um sinal de entrada.</p></>:<p>{!state?'Consultando o horário…':!state.marketOpen?'Forex fechado. Os pares voltam na abertura.':'Aguardando a próxima sessão.'}</p>}</section>;
 return <div className="header-focus" aria-label="Pares em foco por sessão"><div className="header-focus-assets">{state?.assets.length?state.assets.map(asset=><span className="header-focus-pair" key={asset}>{asset}</span>):<span className="header-focus-empty">{!state?'Atualizando…':!state.marketOpen?'Forex · pausa de fim de semana':'Transição entre sessões'}</span>}</div></div>;
}
export default function MarketSessions(){
 const {state}=useContext(MarketContext);
 const regions=state?.active.map(w=>w.session.id).sort().join(',')||'';
 const names=state?.active.map(w=>w.session.name).join(' · ');
 type Item={title:string;url:string;source:string;at:number;region:string};
 const [feed,setFeed]=useState<{regions:string;items:Item[];failed:boolean}|null>(null);
 useEffect(()=>{if(!regions)return;let stopped=false;const ctrl=new AbortController();async function refresh(){try{const res=await fetch('/api/session-news?regions='+regions,{signal:ctrl.signal});if(!res.ok)throw Error();const data=await res.json();if(!stopped)setFeed({regions,items:data.items,failed:data.failed})}catch{if(!stopped)setFeed({regions,items:[],failed:true})}}void refresh();const timer=setInterval(refresh,300000);return()=>{stopped=true;ctrl.abort();clearInterval(timer)}},[regions]);
 const current=feed?.regions===regions?feed:null;
 return <section className="panel economic-wire"><header><span aria-hidden="true">◉</span><h2>Notícias econômicas</h2>{names&&<b>{names}</b>}</header>{current?.items.length&&regions?<div>{current.items.slice(0,3).map(n=><a key={n.url} href={n.url} target="_blank" rel="noopener noreferrer"><strong>{n.title}</strong><span>{n.region} · {n.source} · {dated(n.at)} (Brasília)</span></a>)}</div>:<p>{!state?'Carregando sessão…':!regions?'Sem sessão ativa.':!current?'Buscando manchetes…':current.failed?'Noticiário temporariamente indisponível.':'Nenhuma manchete econômica recente para esta sessão.'}</p>}</section>
}
export function ActiveSessionNames(){const {state}=useContext(MarketContext);if(!state?.active.length)return null;return <div aria-label="Sessões ativas" style={{marginTop:3,color:'#83c5ff',fontSize:14,fontWeight:650}}>{state.active.map(w=>w.session.name).join(' · ')}</div>}

const referencePips:Record<string,number>={'EUR/USD':0.1,'AUD/USD':0.1,'USD/JPY':0.1,'USD/CAD':0.2,'GBP/USD':0.3,'EUR/GBP':0.4,'EUR/JPY':0.5,'AUD/JPY':0.9,'GBP/JPY':1};
export function SessionSpreadStrip(){
 const {state}=useContext(MarketContext);
 if(!state?.marketOpen||!state.active.length)return null;
 const pairs=[...new Set(state.active.flatMap(w=>[...w.session.assets]))].filter(p=>Number.isFinite(referencePips[p])).sort((a,b)=>referencePips[a]-referencePips[b]||a.localeCompare(b)).slice(0,3);
 if(!pairs.length)return null;
 return <div style={{gridColumn:'1 / -1',minWidth:0,textAlign:'center',paddingBottom:8}}>
 <div style={{display:'flex',justifyContent:'center',flexWrap:'wrap',gap:'4px 16px'}}>{pairs.map(p=><span key={p} style={{color:'#8dd5ff',fontSize:14,fontWeight:750,textShadow:'0 0 8px #389fff88'}}>{p}</span>)}</div>
</div>
}
