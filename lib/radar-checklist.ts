const templates:Record<string,string[]>={
 'Correção':['O preço voltou à zona marcada do quadrante.','Os candles contra a tendência perderam força nessa região.','Um candle fechou a favor da tendência na zona marcada.'],
 'Reversão':['O preço passou do topo ou fundo marcado.','Um candle fechou de volta dentro do quadrante.','O preço rompeu o último topo ou fundo menor na nova direção.'],
 'Continuação':['Um candle fechou fora do quadrante a favor da tendência.','O preço voltou para testar a região que rompeu.','A região segurou o teste e um candle fechou a favor do rompimento.']
};
export function radarChecklist(setup:string){return (templates[setup]||templates['Correção']).map(text=>({text,done:false}));}
