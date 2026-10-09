export type PositionInput = {capital:number; riskPercent:number; stopPips:number; quoteToUsd:number; pipSize:number; contract:number; step:number; minimum:number};
export function forexPosition(p:PositionInput){
 if(Object.values(p).some(v=>!Number.isFinite(v)||v<=0)||p.riskPercent>100||p.step>100||p.minimum>100||p.contract>1e9)return null;
 const budget=p.capital*p.riskPercent/100;
 const pipValue=p.contract*p.pipSize*p.quoteToUsd;
 const raw=budget/(p.stopPips*pipValue);
 // Always round down to the broker's volume step, never increase planned risk.
 const lots=Math.floor(raw/p.step)*p.step;
 const risk=lots*p.stopPips*pipValue;
 if(![budget,pipValue,raw,lots,risk].every(Number.isFinite))return null;
 return {budget,pipValue,lots,risk,units:lots*p.contract,belowMinimum:lots<p.minimum};
}
