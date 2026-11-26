import { Suspense } from 'react';
import AuthForm from './auth-form';
import './auth.css';
export const dynamic="force-dynamic";
export default async function Login() {
  return <main className="auth-page"><div className="auth-meteors" aria-hidden="true"><i/><i/><i/><i/></div><div className="auth-shell">
    <section className="auth-story">
      <h1>Paciência é o macete do game <em aria-hidden="true">⚡</em></h1>
      <div className="auth-trace" aria-hidden="true"/>
    </section>
    <section className="auth-panel" aria-label="Acesso ao dashboard"><Suspense fallback={<p>Carregando…</p>}><AuthForm /></Suspense></section>
  </div></main>;
}
