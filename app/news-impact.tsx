'use client';
import {useEffect,useState} from 'react';
import type {EconomicEvent} from '@/lib/macro-types';
import {brazilDay,filterEvents} from '@/lib/economic-calendar';
export default function NewsImpact({events,banner=false}:{events:EconomicEvent[];banner?:boolean}){
 const [day,setDay]=useState<string|null>(null);
 useEffect(()=>{const tick=()=>setDay(brazilDay(Date.now()));tick();const timer=setInterval(tick,30000);window.addEventListener('focus',tick);return()=>{clearInterval(timer);window.removeEventListener('focus',tick)}},[]);
 const count=day?filterEvents(events,day,'Hoje','Todas',true).length:0;
 if(!count)return null;
 return banner?<div className="news-fire-banner" role="status"><span aria-hidden="true">🔥</span><div><b>{count} {count===1?'evento de alto impacto hoje':'eventos de alto impacto hoje'}</b><p>Confira os horários de Brasília no calendário. O aviso considera os eventos cadastrados, inclusive os já divulgados.</p></div></div>:<span className="news-fire-badge" title={`${count} evento(s) de alto impacto hoje — Brasília`}><span aria-hidden="true">🔥</span><span className="sr-only">{count} evento(s) de alto impacto hoje</span></span>;
}
