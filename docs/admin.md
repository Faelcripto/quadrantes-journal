# Administração do site

Acesse `/admin` com uma conta listada em `public.site_admins`. A página e a API usam `auth.getUser()` e consultam a tabela de administradores; o banco também aplica RLS. Os clientes não podem inserir, alterar ou remover administradores. A concessão inicial foi feita por uma consulta administrativa para a conta confirmada indicada pelo proprietário.

## Conteúdo

`public.site_content` contém `key`, `payload` JSON, `revision` e `updated_at`. As seções são `appearance`, `course`, `strategies` e `macro`. Os valores do código são usados enquanto uma seção não foi publicada no banco. Publicar uma seção substitui apenas essa seção. Edições concorrentes são recusadas com HTTP 409.

- Aparência: nome, assinatura, título/descrição do login e paletas predefinidas.
- Curso: módulos, aulas e links HTTPS de vídeos e materiais. Os arquivos ficam no serviço externo escolhido pelo administrador.
- Estratégias: regras dos três setups; os nomes não mudam para preservar os registros.
- Macro: textos, fontes, datas e eventos. Horários digitados em Brasília são convertidos para UTC. As datas de verificação não são alteradas automaticamente. COT segue separado e não é editável aqui.

Aparência é legível sem login. As outras seções exigem autenticação. Somente administradores podem gravar. Nenhuma política de `journals` foi modificada e administradores não ganham acesso aos diários de terceiros.

Os rascunhos ficam apenas na memória da aba; o navegador avisa antes de sair com alterações pendentes. Novas visitas ou atualização da página exibem o conteúdo publicado.

## Automação editorial

Após `macro` ser publicada no banco, ela tem prioridade sobre `data/macro-weekly.json`. Uma automação futura para esta implantação deverá atualizar a mesma fonte com verificação de revisão, em vez de apenas editar o JSON. A automação antiga do projeto Sites continua sendo um fluxo separado.

## Verificação

TypeScript e build Next.js. Testes de banco em transação com rollback: administrador grava, conta comum não grava nem se promove, acesso anônimo somente à aparência, privacidade dos diários mantida. Nenhum usuário de teste ou conteúdo temporário é persistido.
