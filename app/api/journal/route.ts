import { currentStrategies } from '@/lib/strategies';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
export const dynamic = 'force-dynamic';
const trade=z.object({id:z.string().max(80),date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),asset:z.string().min(1).max(30),side:z.enum(['Compra','Venda']),strategy:z.string().min(1).max(80),emotion:z.enum(['Confiante','Calmo','Ansioso','Impulsivo','Frustrado']),pnl:z.number().finite().min(-1e9).max(1e9),fees:z.number().min(0).max(1e9),risk:z.number().positive().max(1e9),followed:z.boolean(),notes:z.string().max(5000),photos:z.array(z.object({id:z.string().uuid(),name:z.string().min(1).max(255)})).max(6).optional()});
const schema=z.object({trades:z.array(trade).max(5000),strategies:z.array(z.object({name:z.string().min(1).max(80),rules:z.string().max(5000)})).max(100),capital:z.number().positive().max(1e12),riskPercent:z.number().positive().max(100),dailyLimit:z.number().positive().max(100)});

const reply = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'private, no-store' } });
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return reply({ error: 'Entre com sua conta para acessar o diário.' }, 401);
    const { data: row, error } = await supabase.from('journals').select('payload').eq('user_id', user.id).maybeSingle();
    if (error) throw error;
    const data = row?.payload || null;
    if (data) data.strategies = currentStrategies(data.strategies);
    return reply({ data });
  } catch { return reply({ error: 'Não foi possível carregar seu diário. Tente novamente.' }, 503); }
}
export async function PUT(req: Request) {
  if (req.headers.get('origin') !== new URL(req.url).origin) return reply({ error: 'Origem inválida.' }, 403);
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return reply({ error: 'Entre com sua conta.' }, 401);
    const body = await req.text();
    if (body.length > 4000000) return reply({ error: 'Diário excedeu o limite.' }, 413);
    const payload = schema.parse(JSON.parse(body));
    payload.strategies = currentStrategies(payload.strategies);
    const { error } = await supabase.from('journals').upsert({ user_id: user.id, payload, updated_at: new Date().toISOString() });
    if (error) throw error;
    return reply({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError || error instanceof SyntaxError) return reply({ error: 'Confira os campos informados.' }, 400);
    return reply({ error: 'Não foi possível salvar. Seus campos foram preservados.' }, 503);
  }
}
