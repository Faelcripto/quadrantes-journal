'use client';
import {useEffect,useState} from 'react';
import {Clock3} from 'lucide-react';
const clock=new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Sao_Paulo',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
export default function BrasiliaClock(){
 const [time,setTime]=useState('');
 useEffect(()=>{const tick=()=>setTime(clock.format(Date.now()));tick();const timer=window.setInterval(tick,1000);document.addEventListener('visibilitychange',tick);return()=>{clearInterval(timer);document.removeEventListener('visibilitychange',tick)}},[]);
 return <time title="Horário de Brasília" aria-label={'Horário de Brasília: '+time} style={{display:'inline-flex',alignItems:'center',gap:6,fontVariantNumeric:'tabular-nums',whiteSpace:'nowrap',color:'#e7edf5',fontSize:'1rem'}}><Clock3 size={16} aria-hidden="true"/>{time||'--:--:--'}</time>
}
