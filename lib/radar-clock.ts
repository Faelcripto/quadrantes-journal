const fmt=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'});
export function radarDay(ms=Date.now()){return fmt.format(ms)}
export function nextRadarMidnight(ms=Date.now()){const today=radarDay(ms);let lo=ms,hi=ms+27*3600000;while(hi-lo>1){const mid=Math.floor((lo+hi)/2);if(radarDay(mid)===today)lo=mid;else hi=mid}return hi}
