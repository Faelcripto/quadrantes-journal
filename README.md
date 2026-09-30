# Quadrantes Journal

Diário individual do Método dos Quadrantes, com Next.js 16 e Supabase Auth/Postgres.

## Desenvolvimento

1. Node.js 22 e `npm ci`.
2. Copie `.env.example` para `.env.local` e configure a chave **publishable** do Supabase.
3. Execute `npm run dev`. Validação: `npm run typecheck` e `npm run build`.

Nunca use `service_role` ou chave secreta em variáveis `NEXT_PUBLIC_`.

## Publicação na Vercel

Importe este repositório como Next.js. Adicione `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` aos ambientes desejados antes do build.

No Supabase, configure Site URL com a URL HTTPS definitiva da Vercel. Autorize as URLs exatas `/auth/callback` e `/auth/callback?next=password` em Redirect URLs. Para desenvolvimento local, adicione as equivalentes com `http://localhost:3000`.

Mantenha Email e Confirm email ativados. Configure SMTP próprio antes de abrir o cadastro ao público: o serviço de e-mail padrão do Supabase é limitado. Os templates padrão usam o callback PKCE (abra o link no mesmo navegador em que iniciou o cadastro). Como alternativa para confirmação entre dispositivos, os templates podem apontar para `/auth/confirm?token_hash={{ .TokenHash }}&type=signup` e, na recuperação, `type=recovery`, usando `{{ .SiteURL }}` como origem.

## Banco e privacidade

O projeto Supabase configurado é `zeekojiiihogonuhcnbe`. A tabela `public.journals` já foi criada. `docs/schema.sql` registra a estrutura inicial para referência; não execute novamente sobre a tabela existente. RLS limita SELECT, INSERT e UPDATE ao UUID autenticado. A API determina a identidade pelo Supabase; não aceita um identificador de proprietário enviado pelo cliente. Respostas pessoais não são cacheadas.

Antes de liberar usuários: validar cadastro, confirmação, login, gravação/leitura, recuperação, logout e isolamento entre duas contas no domínio publicado.

## Continuidade com o site anterior

Esta versão preserva operações, emoções, gerenciamento, curso, filtros anuais, estratégias Correção/Reversão/Continuação e notícias/COT. Não há galeria nem upload de fotos.

Os registros do site anterior **não foram migrados**: a identidade ChatGPT é diferente do UUID Supabase. O site original e seus dados continuam intactos. Uma importação exige verificar a titularidade da nova conta. Metadados históricos de fotos continuam aceitos no payload, mas os arquivos continuam no armazenamento anterior.

O COT consulta a CFTC e usa um snapshot identificado quando a API está indisponível. Notícias editoriais estão em `data/macro-weekly.json`. A automação de sexta-feira ainda aponta para o site anterior e precisa ser ajustada após esta publicação ser validada. Não existe cron editorial implementado nesta versão.
