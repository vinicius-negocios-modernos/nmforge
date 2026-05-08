---
name: nmforge-skill-create
description: |
  Cria scaffold completo de uma nova skill NMforge (SKILL.md + checklist.md + steps-c/e/v + customize.toml).
  Use when: usuário quer adicionar uma nova skill ao projeto e precisa do esqueleto canônico que passa o validator de cara.

allowed-tools: Read, Write, Edit, Bash, Glob
effort: low
token_budget: 1500
phase: meta
persona-mode: minimal
language: pt-br
customize-keys:
  - default_module
  - skills_root
  - default_phase
subagent-pattern: none
---

# nmforge-skill-create

Skill espelho do comando CLI `nmforge skill create <name>`. Existe para que usuários possam disparar o scaffold via `Skill` tool sem mudar para o terminal.

## Quando usar

O usuário descreveu uma capacidade nova que merece virar skill (não apenas um snippet). Antes de invocar, confira em paralelo:

1. **Já existe?** Rode `Glob skills/<name>/SKILL.md` — se achar, oriente edição em vez de criação.
2. **Nome em kebab-case?** R-DET-01 falha se não casar com basename do dir.
3. **Prefixo de módulo apropriado?** Convenção: `nmforge-*` para skills core; `<modulo>-*` para extensions.

## Modos

- **Create** (`steps-c/`): scaffold do zero. Default.
- **Edit** (`steps-e/`): atualizar frontmatter ou steps de skill já existente.
- **Validate** (`steps-v/`): rodar validator na skill recém-criada e reportar.

## Output esperado

Pasta `skills/<name>/` (ou `modules/<module>/skills/<name>/` se `--module` informado) contendo:

```
<name>/
├── SKILL.md              # frontmatter mínimo + body TODO
├── checklist.md          # 1 critério inicial, usuário expande
├── customize.toml        # vazio com cabeçalho
├── steps-c/01-todo.md
├── steps-e/01-assess.md
├── steps-v/01-evaluate.md
└── resources/            # vazia, opt-in
```

Após scaffold, sempre executar [validate](#validacao-imediata) abaixo para confirmar que passa as 13 regras.

## Validação imediata

Depois de gerar a pasta:

```bash
node packages/cli/bin/nmforge.js validate --skill <name>
```

Esperar exit code 0. Se warns aparecerem, registrar no `checklist.md` da skill como dívida técnica conhecida.

## Customização

Chaves disponíveis em [customize.toml](customize.toml):

- `default_module`: se setado, novas skills vão para `modules/<default_module>/skills/`.
- `skills_root`: override do path base (default `skills/`).
- `default_phase`: phase padrão para o frontmatter (default `meta`).

Resolução em 3 camadas (P7): defaults → team → user → local.

## Steps

- [steps-c/01-collect-name.md](steps-c/01-collect-name.md) — coleta e valida nome
- [steps-c/02-decide-module.md](steps-c/02-decide-module.md) — escolhe destino (skills/ ou modules/)
- [steps-c/03-scaffold.md](steps-c/03-scaffold.md) — cria árvore de arquivos
- [steps-e/01-update-frontmatter.md](steps-e/01-update-frontmatter.md) — modo Edit
- [steps-v/01-evaluate.md](steps-v/01-evaluate.md) — modo Validate

## Critérios de sucesso

Ver [checklist.md](checklist.md). Em resumo:

1. Pasta criada nos paths corretos.
2. Frontmatter passa R-DET-01..03, 10, 12.
3. `nmforge validate --skill <name>` retorna exit 0.
4. Usuário consegue rodar a skill após edição mínima.

## Referências

- DESIGN.md §3.3 — estrutura de pasta canônica
- packages/cli/src/commands/skill.ts — implementação Node de paridade
- CONSTITUTION.md P3 — limite de 200 linhas
