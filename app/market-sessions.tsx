'use client';
import {createContext,useContext,useEffect,useMemo,useState,type ReactNode} from 'react';
import {Clock3,Globe2,ArrowRight} from 'lucide-react';
import {sessions,sessionSchedule} from '@/lib/market-sessions';
import './market-sessions.css';
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
export function FocusPairs(){
 const {state}=useContext(MarketContext);
 return <div className="header-focus" aria-label="Pares em foco por sessão"><span className="header-focus-label">PARES EM FOCO<small>Por sessão</small></span><div className="header-focus-assets">{state?.assets.length?state.assets.map(asset=><span className="header-focus-pair" key={asset}>{asset}</span>):<span className="header-focus-empty">{!state?'Atualizando…':!state.marketOpen?'Forex · pausa de fim de semana':'Transição entre sessões'}</span>}</div></div>;
}
export default function MarketSessions({onNews}:{onNews:()=>void}){
 const {now,state}=useContext(MarketContext);
 return <section className="market-session-panel" aria-label="Sessões e ativos para acompanhar"><div className="session-heading"><div><span className="eyebrow"><Globe2 size={14}/> SESSÕES DO MERCADO</span><h2>{!state?'Preparando seu radar…':!state.marketOpen?'Forex · pausa de fim de semana':state.active.length?state.active.map(w=>w.session.region).join(' + '):'Transição entre sessões'}</h2><p>{!state?'Consultando o relógio local.':state.active.length>1?'Sessões simultâneas. Compare os pares antes de escolher seu setup.':state.marketOpen?'Ativos para acompanhar nesta faixa de horário.':'Use a pausa para revisar suas operações e preparar a semana.'}</p></div><span className="session-clock"><Clock3 size={15}/>{now===null?'—':clock(now)} · Brasília</span></div>
 <div className="session-strips">{sessions.map(s=>{const active=state?.active.find(w=>w.session.id===s.id);const upcoming=state?.windows.find(w=>w.session.id===s.id&&w.start>(now||0));return <div className={'session-strip '+(active?'is-active':'')} key={s.id}><div><b>{s.name}</b><span>{active?'Em sessão':state?'Fora da sessão':'—'}</span></div><small>{active?`Até ${clock(active.end)}`:upcoming?`Abre ${dated(upcoming.start)}`:'Calculando horários…'}</small></div>})}</div>
 {state&&<><div className="session-next"><span>{state.next?<><b>Próxima mudança</b> {state.next.label} · {dated(state.next.at)} <small>(em {Math.ceil((state.next.at-now!)/60000)} min)</small></>:'Aguardando próxima sessão'}</span><button onClick={onNews}>Ver notícias <ArrowRight size={15}/></button></div></>}
 <details className="session-method"><summary>Como funciona este radar?</summary><p>Horários habituais de Forex, atualizados a cada 30 segundos e ao voltar à página. O horário de verão de cada região é considerado. A semana de referência vai de domingo às 17h a sexta às 17h em Nova York.</p><p>Janelas locais: Sydney 08h–17h, Tóquio 09h–18h, Londres 08h–17h e Nova York 08h–17h. São convenções de sessões Forex, não horários das bolsas de ações. Feriados, pausas e exceções da corretora não são verificados neste radar.</p><p>Os pares são sugestões de acompanhamento por região, não um ranking de oportunidades ou indicação de compra/venda. Confira spread, notícias e confirmação do seu plano.</p><a href="https://www.oanda.com/us-en/skills-and-insights/education/trading-asset-classes/forex/when-is-the-best-time-for-forex-trading/" target="_blank" rel="noopener noreferrer">Referência sobre sessões ↗</a></details><p className="session-footnote">Horários habituais · feriados e exceções da corretora podem alterar a atividade.</p></section>;
}
