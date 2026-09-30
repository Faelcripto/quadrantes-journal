'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
type Mode = 'login' | 'signup' | 'reset' | 'password';
export default function AuthForm() {
  const query = useSearchParams();
  const [mode, setMode] = useState<Mode>(query.get('mode') === 'password' ? 'password' : 'login');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(query.has('error') ? 'Este link expirou ou já foi utilizado. Solicite um novo link.' : '');
  const titles = { login: 'Bem-vindo de volta', signup: 'Crie seu diário', reset: 'Recuperar acesso', password: 'Defina sua nova senha' };
  function change(next: Mode) { setMode(next); setMessage(''); setError(''); }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage(''); setError('');
    const fields = new FormData(event.currentTarget);
    const email = String(fields.get('email') || '').trim();
    const password = String(fields.get('password') || '');
    try {
      const supabase = createClient();
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) { setError('Não foi possível entrar. Confira seu e-mail, sua senha e a confirmação da conta.'); return; }
        window.location.assign('/');
      } else if (mode === 'signup') {
        const { error, data } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/auth/callback` } });
        if (error) { setError('Não foi possível criar a conta agora. Tente novamente em alguns minutos.'); return; }
        if (data.session) window.location.assign('/');
        else setMessage('Confira seu e-mail para confirmar o cadastro. Se você já possui uma conta, entre ou recupere sua senha.');
      } else if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth/callback?next=password` });
        if (error) { setError('Não foi possível enviar o link agora. Tente novamente em alguns minutos.'); return; }
        setMessage('Se este e-mail estiver cadastrado, você receberá um link para redefinir a senha.');
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setError('Sua sessão expirou. Solicite um novo link de recuperação.'); return; }
        const { error } = await supabase.auth.updateUser({ password });
        if (error) { setError('Não foi possível atualizar a senha. Use uma senha diferente, com pelo menos 8 caracteres.'); return; }
        window.location.assign('/');
      }
    } catch { setError('Falha de conexão. Tente novamente.'); }
    finally { setBusy(false); }
  }
  return <div className="auth-form"><p className="auth-eyebrow">SEU WORKSPACE PESSOAL</p><h2>{titles[mode]}</h2><p className="auth-subtitle">Suas operações e seu gerenciamento em um só lugar.</p><form onSubmit={submit} key={mode}>
    {mode !== 'password' && <label>E-mail<input name="email" type="email" autoComplete="email" placeholder="voce@exemplo.com" required maxLength={254} /></label>}
    {mode !== 'reset' && <label>Senha<input name="password" type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={mode === 'login' ? 1 : 8} required maxLength={128} placeholder={mode === 'login' ? 'Sua senha' : 'Pelo menos 8 caracteres'} /></label>}
    {error && <p className="auth-error" role="alert">{error}</p>}{message && <p className="auth-message" role="status">{message}</p>}
    <button className="auth-submit" disabled={busy}>{busy ? 'Aguarde…' : mode === 'login' ? 'Entrar no Journal →' : mode === 'signup' ? 'Criar minha conta →' : mode === 'reset' ? 'Enviar link de recuperação' : 'Salvar nova senha'}</button>
  </form><div className="auth-links">{mode === 'login' ? <><button disabled={busy} onClick={() => change('reset')}>Esqueci minha senha</button><p>Ainda não tem conta? <button disabled={busy} onClick={() => change('signup')}>Criar conta</button></p></> : <button disabled={busy} onClick={() => change('login')}>Voltar para entrar</button>}</div><p className="auth-private">Seu diário é individual. Outros usuários não têm acesso aos seus registros.</p></div>;
}
