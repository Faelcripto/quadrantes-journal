import { z } from 'zod';
import macro from '@/data/macro-weekly.json';
import { quadrantesStrategies } from './strategies';
const text = z.string().trim().max(12000);
const title = z.string().trim().min(1).max(180);
const link = z.string().url().max(2000).refine(s => s.startsWith('https://'), 'Use um link HTTPS.');
const optionalLink = z.union([z.literal(''), link]);
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(s => !isNaN(Date.parse(s)) && new Date(s).toISOString().slice(0,10) === s, 'Data inválida.');
const instant = z.string().datetime({offset:true});
const source = z.object({label:title,url:link});
const currency = z.enum(['USD','EUR']);
export const contentSchemas = {
 appearance: z.object({name:title,tagline:title,headline:title,description:text,background:z.enum(['black','graphite']),accent:z.enum(['orange','gold','mint'])}),
 strategies: z.object({items:z.array(z.object({name:z.enum(['Correção','Reversão','Continuação']),rules:text})).length(3).refine(items => new Set(items.map(i=>i.name)).size===3,'Mantenha as três estratégias.') }),
 course:z.object({title,description:text,status:title,about:text,modules:z.array(z.object({title,description:text,lessons:z.array(z.object({title,videoUrl:optionalLink,materialUrl:optionalLink})).max(50)})).max(30)}),
 macro:z.object({updatedAt:instant,weekStart:date,weekEnd:date,heading:title,summary:text,comparison:text,news:z.array(z.object({id:title,date,tag:title,title,summary:text,watch:text,source})).max(50),scenarios:z.array(z.object({currency,rate:title,rateLabel:title,asOf:date,facts:text,interpretation:text,sources:z.array(source).min(1).max(10)})).length(2).refine(s=>new Set(s.map(x=>x.currency)).size===2,'Inclua dólar e euro.'),events:z.array(z.object({id:title,title,currency,date,at:instant.nullable(),source,why:text})).max(100),notes:z.array(text).max(20)}).refine(m=>m.weekEnd>=m.weekStart,'O fim da edição deve ser posterior ao início.')
};
export type ContentKey=keyof typeof contentSchemas;
export type SiteContent={ [K in ContentKey]:z.infer<(typeof contentSchemas)[K]> };
export const defaultContent:SiteContent={
 appearance:{name:'Diário de Trader',tagline:'MÉTODO DOS QUADRANTES',headline:'Seu processo. Sua evolução.',description:'Registre suas operações, entenda suas decisões e acompanhe sua consistência.',background:'black',accent:'orange'},
 strategies:contentSchemas.strategies.parse({items:quadrantesStrategies}),
 course:{title:'Aprenda a ler o mercado.',description:'Gerenciamento, disciplina e técnica na aplicação do Método dos Quadrantes.',status:'Em preparação',about:'Esta área reunirá as aulas do Método dos Quadrantes. Os vídeos e materiais ainda estão em preparação.',modules:([
 {title:'Fundamentos e leitura de mercado',description:'Uma base para compreender o contexto antes de pensar na entrada.',lessons:['Estrutura de mercado e Teoria de Dow','Topos, fundos e tendências']},
 {title:'Construindo os quadrantes',description:'Organização das regiões de preço usadas no método.',lessons:['Marcação do quadrante: topo, fundo e equilíbrio','Níveis de 25%, 50% e 75% e projeções']},
 {title:'Contexto, liquidez e zonas de impacto',description:'Leitura do cenário e das regiões que merecem atenção.',lessons:['Acumulação e distribuição','Liquidez e confluências nas zonas de impacto']},
 {title:'Da análise à execução',description:'Planejamento da operação e critérios de confirmação.',lessons:['Rompimento, reteste e pullback','Candles de força e padrões de confirmação']},
 {title:'Gerenciamento e disciplina',description:'Regras para cuidar do capital e revisar suas decisões.',lessons:['Risco, stop e alvo antes da entrada','Emoções e aderência ao plano']},
 {title:'Prática e diário do trader',description:'Registro e revisão para acompanhar a evolução do processo.',lessons:['Estudo de operações no gráfico','Revisão das operações no Quadrantes Journal']},
]).map(m=>({...m,lessons:m.lessons.map(title=>({title,videoUrl:"",materialUrl:""}))}))},
 macro:macro as SiteContent['macro']
};
export const contentKeys=Object.keys(contentSchemas) as ContentKey[];
