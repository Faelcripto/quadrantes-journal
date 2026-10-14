import {z} from 'zod';
const date=z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v=>{const d=new Date(v+'T12:00:00Z');return Number.isFinite(d.getTime())&&d.toISOString().slice(0,10)===v},'Data inválida');
export const diaryEntrySchema=z.object({id:z.string().uuid(),entry_date:date,title:z.string().trim().max(120),body:z.string().trim().min(1).max(10000),emotion:z.enum(['Calmo','Impulsivo','Frustrado'])}).strict();
export const diaryEditSchema=diaryEntrySchema.extend({revision:z.number().int().positive().max(2147483646)});
export const diaryDeleteSchema=z.object({id:z.string().uuid(),revision:z.number().int().positive()}).strict();
export type DiaryEntry=z.infer<typeof diaryEditSchema>&{created_at:string;updated_at:string};
