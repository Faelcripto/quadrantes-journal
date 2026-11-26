import {createClient} from '@/lib/supabase/server';
import {readSiteContent} from '@/lib/site-content-server';
import { Suspense } from 'react';
import AuthForm from './auth-form';
import './auth.css';
export const dynamic="force-dynamic";
export default async function Login() {
  const {content:{appearance}}=await readSiteContent(await createClient(),true);
  return <main className="auth-page"><div className="auth-shell">
    <section className="auth-story">
      <div className="auth-brand"><img src="/mq-cor.webp" alt="" width={144} height={72}/><span>MÉTODO</span><strong>QUADRANTES</strong></div>
      <h1>{appearance.headline==='Seu processo. Sua evolução.'?<>Paciência é o macete do game <em aria-hidden="true">⚡</em></>:appearance.headline}</h1>
      <div className="auth-trace" aria-hidden="true"/>
    </section>
    <section className="auth-panel" aria-label="Acesso ao dashboard"><Suspense fallback={<p>Carregando…</p>}><AuthForm /></Suspense></section>
  </div></main>;
}
