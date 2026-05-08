# Step 01 — Editar chave existente

## Quando usar

Arquivo TOML já existe na camada escolhida e o usuário quer alterar/adicionar uma chave.

## Procedimento

1. `Read` o arquivo TOML.
2. Identifique a tabela alvo (`[<skill>.defaults]` ou outra).
3. Se a chave já existe → `Edit` com `old_string` específico.
4. Se a chave não existe → `Edit` adicionando linha logo após o header da tabela.

## Validação

- Sintaxe TOML é parseável: rode `node -e "import('smol-toml').then(({parse})=>parse(require('fs').readFileSync('<path>','utf8')))"`.
- Chave existe na lista `customize-keys` da skill alvo: `grep "^- <key>" skills/<skill>/SKILL.md`.

Se a chave NÃO está em `customize-keys`, alerte o usuário — pode ser typo ou skill que não expõe esse override.
