export const sessions=[
 {id:'sydney',name:'Sydney',region:'Oceania',zone:'Australia/Sydney',open:8,close:17,assets:['AUD/USD','NZD/USD','AUD/JPY']},
 {id:'tokyo',name:'Tóquio',region:'Ásia',zone:'Asia/Tokyo',open:9,close:18,assets:['USD/JPY','AUD/JPY','EUR/JPY','AUD/USD']},
 {id:'london',name:'Londres',region:'Europa',zone:'Europe/London',open:8,close:17,assets:['EUR/USD','GBP/USD','EUR/GBP','GBP/JPY']},
 {id:'newyork',name:'Nova York',region:'América',zone:'America/New_York',open:8,close:17,assets:['EUR/USD','USD/JPY','USD/CAD','GBP/USD']},
] as const;
type Session=typeof sessions[number];
const formatters=new Map<string,Intl.DateTimeFormat>();
function parts(at:number,zone:string){
 let formatter=formatters.get(zone);
 if(!formatter){formatter=new Intl.DateTimeFormat('en-GB',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});formatters.set(zone,formatter)}
 const p=Object.fromEntries(formatter.formatToParts(at).map(p=>[p.type,p.value]));
 return {year:+p.year,month:+p.month,day:+p.day,hour:+p.hour,minute:+p.minute,second:+p.second};
}
// Convert a local wall-clock time to UTC using the offset at that date, including DST.
export function localUtc(year:number,month:number,day:number,hour:number,zone:string){
 const target=Date.UTC(year,month-1,day,hour);let utc=target;
 for(let i=0;i<4;i++){const p=parts(utc,zone);const difference=target-Date.UTC(p.year,p.month-1,p.day,p.hour,p.minute,p.second);utc+=difference;if(!difference)break}
 return utc;
}
function dateOffset(at:number,zone:string,days:number){const p=parts(at,zone);return new Date(Date.UTC(p.year,p.month-1,p.day+days,12))}
function atHour(d:Date,hour:number,zone:string){return localUtc(d.getUTCFullYear(),d.getUTCMonth()+1,d.getUTCDate(),hour,zone)}
export type SessionWindow={session:Session;start:number;end:number};
export function sessionSchedule(now:number){
 const ny='America/New_York';const nyDate=dateOffset(now,ny,0);
 const marketWeeks=Array.from({length:3},(_,i)=>{
  const sun=dateOffset(now,ny,-nyDate.getUTCDay()+(i-1)*7);const fri=new Date(sun);fri.setUTCDate(sun.getUTCDate()+5);
  return {start:atHour(sun,17,ny),end:atHour(fri,17,ny)};
 });
 const windows:SessionWindow[]=[];
 for(const session of sessions)for(let offset=-1;offset<=8;offset++){
  const day=dateOffset(now,session.zone,offset);if(day.getUTCDay()===0||day.getUTCDay()===6)continue;
  const start=atHour(day,session.open,session.zone),end=atHour(day,session.close,session.zone);
  for(const week of marketWeeks){const clippedStart=Math.max(start,week.start),clippedEnd=Math.min(end,week.end);if(clippedStart<clippedEnd)windows.push({session,start:clippedStart,end:clippedEnd})}
 }
 windows.sort((a,b)=>a.start-b.start);
 const active=windows.filter(w=>w.start<=now&&now<w.end);
 const marketOpen=marketWeeks.some(w=>w.start<=now&&now<w.end);
 const changes=windows.flatMap(w=>[{at:w.start,label:`${w.session.name} abre`},{at:w.end,label:`${w.session.name} encerra`}]).filter(c=>c.at>now).sort((a,b)=>a.at-b.at);
 const nextAt=changes[0]?.at;
 const next=nextAt?{at:nextAt,label:changes.filter(c=>c.at===nextAt).map(c=>c.label).join(' · ')}:null;
 const assets=[...new Set(active.flatMap(w=>[...w.session.assets]))].slice(0,6);
 return {active,windows,marketOpen,next,assets};
}
