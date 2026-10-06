import { Suspense } from 'react';
import AuthForm from './auth-form';
import './auth.css';
export default function Login() {
  return <main className="auth-page"><section className="auth-story"><div className="auth-brand"><img className="auth-logo" src="/quadrantes-logo.png" alt="Logotipo Método dos Quadrantes: montanhas e raio dourado" width={1280} height={1280}/><div>quadrantes<span>DIÁRIO DE TRADER</span></div></div><div><p className="auth-eyebrow">MÉTODO DOS QUADRANTES</p><h1>Seu processo.<br />Sua evolução.</h1><p>Registre suas operações, entenda suas decisões e acompanhe sua consistência.</p></div><p className="auth-motto">⚡ Paciência é o macete do game.</p></section><section className="auth-panel"><Suspense fallback={<p>Carregando…</p>}><AuthForm /></Suspense></section></main>;
}
