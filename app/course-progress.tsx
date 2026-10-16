'use client';
import {createContext,useCallback,useContext,useEffect,useMemo,useRef,useState,type ReactNode} from 'react';
import {GraduationCap,ArrowRight,Check} from 'lucide-react';
import type {SiteContent} from '@/lib/site-content';
import {courseProgress,normalizeCourse} from '@/lib/course-progress';
import './course-progress.css';
type State={course:SiteContent['course'];completed:string[];loading:boolean;saving:string|null;error:string;refresh:()=>Promise<void>;mark:(id:string,done:boolean)=>Promise<void>};
const Context=createContext<State|null>(null);
export function useCourseProgress(){const value=useContext(Context);if(!value)throw Error('Progresso indisponível');return {...value,...courseProgress(value.course,value.completed)}}
export function CourseProgressProvider({initialCourse,user,children}:{initialCourse:SiteContent['course'];user:string|null;children:ReactNode}){
 const [course,setCourse]=useState(()=>normalizeCourse(initialCourse)),[completed,setCompleted]=useState<string[]>([]),[loading,setLoading]=useState(true),[saving,setSaving]=useState<string|null>(null),[error,setError]=useState('');
 const generation=useRef(0),mutating=useRef(false);
 const refresh=useCallback(async()=>{if(!user){setLoading(false);return;}if(mutating.current)return;const current=++generation.current;
  try{const r=await fetch('/api/course-progress',{cache:'no-store'});const j=await r.json();if(!r.ok)throw Error(j.error);if(current!==generation.current)return;setCourse(normalizeCourse(j.course));setCompleted(j.completed);setError('')}
  catch(e){if(current===generation.current)setError((e as Error).message||'Não foi possível carregar seu progresso.')}
  finally{if(current===generation.current)setLoading(false)}
 },[user]);
 useEffect(()=>{void refresh();const timer=setInterval(()=>{if(document.visibilityState==='visible')void refresh()},60000);const focus=()=>void refresh();window.addEventListener('focus',focus);return()=>{generation.current++;clearInterval(timer);window.removeEventListener('focus',focus)}},[refresh]);
 async function mark(id:string,done:boolean){if(mutating.current||!user||loading)return;mutating.current=true;generation.current++;setSaving(id);setError('');
  try{const r=await fetch('/api/course-progress',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({lessonId:id,completed:done})});const j=await r.json();if(!r.ok)throw Error(j.error);setCompleted(old=>done?[...new Set([...old,id])]:old.filter(v=>v!==id));mutating.current=false;await refresh()}
  catch(e){setError((e as Error).message||'Não foi possível salvar seu progresso.')}
  finally{mutating.current=false;setSaving(null)}
 }
 return <Context.Provider value={{course,completed,loading,saving,error,refresh,mark}}>{children}</Context.Provider>;
}
export function LessonCompletion({id}:{id:string}){const p=useCourseProgress();const done=p.completed.includes(id);return <button type="button" className={'lesson-completion '+(done?'is-complete':'')} aria-pressed={done} disabled={p.loading||!!p.saving} onClick={()=>void p.mark(id,!done)}>{p.saving===id?'Salvando…':done?<><Check size={14}/> Assistida · desfazer</>:'Marcar como assistida'}</button>}
export function CourseProgressCard({onContinue}:{onContinue:(id?:string)=>void}){
 const p=useCourseProgress();return <section className="panel process learning-process"><div className="panel-head"><h2>Consistência no processo</h2><GraduationCap size={19}/></div><div className="score-ring" style={{background:`conic-gradient(#f6a25d ${p.percent*3.6}deg,#2b2d32 0)`}}><div><strong>{p.loading||!p.total?'—':p.percent}{!p.loading&&p.total>0&&<span>%</span>}</strong><small>evolução no curso</small></div></div><p>{p.loading?'Carregando suas aulas…':p.total?`${p.count} de ${p.total} aulas publicadas concluídas`:'As aulas estão em preparação.'}<br/><b>Seu aprendizado constrói seu processo.</b></p>{p.error&&<p className="learning-error" role="alert">{p.error} <button onClick={()=>void p.refresh()}>Tentar novamente</button></p>}<div className="learning-next"><small>{p.next?'SUA PRÓXIMA AULA':p.total?'VOCÊ ESTÁ EM DIA':'SUA TRILHA'}</small><h3>{p.next?.title||(p.total?'Todas as aulas publicadas concluídas':'Conheça os módulos do curso')}</h3><p>{p.next?.moduleTitle||(p.total?'Novas aulas aparecerão aqui quando forem publicadas.':'Assim que uma aula for publicada, ela aparecerá aqui.')}</p><button className="primary" disabled={p.loading} onClick={()=>onContinue(p.next?.id)}>{p.next?'Continuar aprendizado':'Abrir curso'}<ArrowRight size={16}/></button></div><small className="learning-note">O percentual considera aulas marcadas como assistidas. Novas aulas publicadas entram no total.</small></section>;
}
