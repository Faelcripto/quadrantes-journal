import type {EconomicEvent} from './macro-types';
export const calendarZone='America/Sao_Paulo';
export function brazilDay(now:number){return new Intl.DateTimeFormat('en-CA',{timeZone:calendarZone,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(now));}
export function calendarRange(today:string,period:string){
 const d=new Date(today+'T12:00:00Z');
 if(period==='Hoje')return [today,today];
 if(period==='Esta semana'){
  d.setUTCDate(d.getUTCDate()-((d.getUTCDay()+6)%7));const start=d.toISOString().slice(0,10);d.setUTCDate(d.getUTCDate()+6);return [start,d.toISOString().slice(0,10)];
 }
 d.setUTCDate(d.getUTCDate()+13);return [today,d.toISOString().slice(0,10)];
}
export function filterEvents(events:EconomicEvent[],today:string,period:string,currency:string,highOnly:boolean){
 const [start,end]=calendarRange(today,period);
 return events.filter(e=>(period==='Todos'||(e.date>=start&&e.date<=end))&&(currency==='Todas'||currency===e.currency)&&(!highOnly||e.impact==='Alto')).sort((a,b)=>a.date.localeCompare(b.date)||(a.at||'z').localeCompare(b.at||'z'));
}
export function eventStatus(e:EconomicEvent,now:number){
 if(e.actual)return 'Resultado informado';
 if(!e.at)return e.date<brazilDay(now)?'Resultado não verificado':'Horário a confirmar';
 return Date.parse(e.at)<=now?'Resultado não verificado':'Agendado';
}
