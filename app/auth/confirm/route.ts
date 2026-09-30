import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
export async function GET(request: Request) {
  const url = new URL(request.url);
  const token_hash = url.searchParams.get('token_hash');
  const type = url.searchParams.get('type');
  if (token_hash && (type === 'signup' || type === 'recovery' || type === 'email')) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (!error) return NextResponse.redirect(new URL(type === 'recovery' ? '/login?mode=password' : '/', url.origin));
  }
  return NextResponse.redirect(new URL('/login?error=link', url.origin));
}
