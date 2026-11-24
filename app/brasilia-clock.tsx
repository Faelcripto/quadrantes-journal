'use client';
import {useEffect,useState} from 'react';
const clock=new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Sao_Paulo',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
export default function BrasiliaClock(){
 const [time,setTime]=useState('');
 useEffect(()=>{const tick=()=>setTime(clock.format(Date.now()));tick();const timer=window.setInterval(tick,1000);document.addEventListener('visibilitychange',tick);return()=>{clearInterval(timer);document.removeEventListener('visibilitychange',tick)}},[]);
 return <time title="Horário de Brasília" aria-label={'Horário de Brasília: '+time} style={{display:'block',fontFamily:'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',fontVariantNumeric:'tabular-nums',letterSpacing:'.035em',lineHeight:1.1,fontWeight:800,color:'#fff',fontSize:'clamp(1.85rem,3.8vw,2.8rem)'}}>{time||'--:--:--'}</time>
}
