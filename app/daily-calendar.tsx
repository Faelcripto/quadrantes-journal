'use client';
import {useState,useEffect} from 'react';
import type {SiteContent} from '@/lib/site-content';
import {radarDay,nextRadarMidnight} from '@/lib/radar-clock';
import MarketSessions from './market-sessions';
import './daily-calendar.css';
type Event=Pick<SiteContent['macro']['events'][number],'id'|'at'|'date'|'title'|'currency'|'impact'|'source'>;
function ImpactStars({impact}:{impact:Event['impact']}) {
 const count=impact==='Alto'?3:impact==='Moderado'?2:impact==='Baixo'?1:0;
 const label=count?'Impacto '+impact.toLowerCase()+': '+count+' de 3 estrelas':'Impacto não informado';
 return <span role="img" aria-label={label} title={label} style={{color:'#ffb77a',letterSpacing:'0.08em',whiteSpace:'nowrap'}}>{count?'★'.repeat(count):'—'}</span>;
}
const reference={label:'Calendário econômico do Scotiabank',url:'https://www.scotiabank.com/ca/en/about/economics/economics-publications/post.other-publications.calendar-of-economic-release-dates.calendar-of-economic-release-dates--november-2026-.html'};
const supplement:Event[]=[{id:'case-shiller-26-11',at:'2026-11-24T14:00:00Z',date:'2026-11-24',currency:'USD',title:'Preços de imóveis nos EUA · índice Case-Shiller',impact:'Moderado',source:reference},{id:'confidence-26-11',at:'2026-11-24T15:00:00Z',date:'2026-11-24',currency:'USD',title:'Confiança do consumidor nos EUA · Conference Board',impact:'Moderado',source:reference}];
const time=new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Sao_Paulo',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
export default function DailyCalendar({events}:{events:Event[]}){const [today,setToday]=useState(()=>radarDay());const [open,setOpen]=useState(false);
 useEffect(()=>{let timer:ReturnType<typeof setTimeout>;function sync(){clearTimeout(timer);setToday(radarDay());timer=setTimeout(sync,Math.max(1,nextRadarMidnight()-Date.now()))}sync();document.addEventListener('visibilitychange',sync);return()=>{clearTimeout(timer);document.removeEventListener('visibilitychange',sync)}},[]);
 const inDay=(e:Event)=>(e.at?radarDay(Date.parse(e.at)):e.date)===today;
 const curated=events.filter(inDay);const rows=(curated.length?curated:supplement.filter(inDay)).slice().sort((a,b)=>(a.at?Date.parse(a.at):Infinity)-(b.at?Date.parse(b.at):Infinity));
 return <section className="panel daily-agenda"><header><h2>Calendário econômico</h2><span>{today.split('-').reverse().join('/')} · Brasília</span></header><div className="agenda-scroll"><table><thead><tr>{['Horário','Moeda','Evento','Impacto'].map(s=><th scope="col" key={s}>{s}</th>)}</tr></thead><tbody>{rows.length?rows.map(e=><tr key={e.id}><td>{e.at?time.format(Date.parse(e.at)):'A definir'}</td><td>{e.currency}</td><td><a href={e.source.url} target="_blank" rel="noopener noreferrer">{e.title}</a></td><td><ImpactStars impact={e.impact}/></td></tr>):<tr><td colSpan={4}>Nenhum evento cadastrado para hoje.</td></tr>}</tbody></table></div><details onToggle={e=>setOpen(e.currentTarget.open)}><summary>Notícias da sessão</summary>{open&&<MarketSessions/>}</details></section>}
