import {createClient} from '@/lib/supabase/server';
import {readSiteContent} from '@/lib/site-content-server';
import { Suspense } from 'react';
import AuthForm from './auth-form';
import './auth.css';
export const dynamic="force-dynamic";
export default async function Login() {
  const {content:{appearance}}=await readSiteContent(await createClient(),true);
  return <main className="auth-page"><section className="auth-story"><div className="auth-brand"><div>{appearance.name}<span>{appearance.tagline}</span></div></div><div><p className="auth-eyebrow">MÉTODO DOS QUADRANTES</p><h1>{appearance.headline}</h1><p>{appearance.description}</p></div><p className="auth-motto">⚡ Paciência é o macete do game.</p></section><section className="auth-panel"><Suspense fallback={<p>Carregando…</p>}><AuthForm /></Suspense></section></main>;
}
