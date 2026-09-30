# Publicar pelo navegador

1. Extraia `quadrantes-journal.zip` no Mac.
2. Abra https://github.com/Faelcripto/quadrantes-journal e escolha **uploading an existing file** (ou **Add file → Upload files**).
3. Arraste o conteúdo da pasta extraída, incluindo as pastas `app`, `components`, `data`, `docs`, `hooks`, `lib`, `public` e `vendor`. O `package.json` deve ficar na raiz do repositório, sem uma pasta `quadrantes-journal` acima dele. Não envie o ZIP fechado.
4. Clique em **Commit changes**.
5. Na Vercel, atualize a lista de repositórios e importe `quadrantes-journal`. O framework é **Next.js** e o Root Directory é `./`.
6. Antes de clicar em Deploy, adicione as duas variáveis de ambiente:

```
NEXT_PUBLIC_SUPABASE_URL=https://zeekojiiihogonuhcnbe.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_Lap-qWy_9DgrzoWxETvk9A_-i05go2k
```

Essa é a chave pública de acesso; as regras do banco protegem os registros. Não use chaves secretas ou service_role.

7. Clique em Deploy e copie o endereço HTTPS atribuído pela Vercel.
8. No Supabase → Authentication → URL Configuration, substitua o endereço antigo por esse endereço HTTPS em **Site URL**. Em **Redirect URLs**, adicione o endereço seguido de `/auth/callback` e outro seguido de `/auth/callback?next=password`.
9. Configure SMTP e faça os testes de cadastro, confirmação, entrada, operações, recuperação e saída antes de convidar outras pessoas.

## Estado desta entrega

- Compilação de produção e TypeScript aprovados.
- Banco criado e isolamento entre usuários testado com transação revertida, sem deixar contas de teste.
- Verificação visual e fluxo completo de e-mail ainda pendentes: o navegador de testes não iniciou neste ambiente.
- O upload automático para GitHub falhou por ausência de credencial de escrita na sessão. O repositório remoto continua sem este código.
- Não houve publicação na Vercel nem migração dos registros pessoais do site anterior.
