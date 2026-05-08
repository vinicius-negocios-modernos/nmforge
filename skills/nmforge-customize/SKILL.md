---
name: nmforge-customize
description: |
  Guia interativo para configurar `customize.toml` em 3 camadas (team / user / local) sem fork.
  Use when: usuário quer alterar comportamento padrão de uma skill ou módulo, ou está confuso sobre qual camada editar.

allowed-tools: Read, Write, Edit, Bash, Glob, AskUserQuestion
effort: medium
token_budget: 1800
phase: meta
persona-mode: minimal
language: pt-br
customize-keys:
  - editor_command
  - confirm_writes
subagent-pattern: none
---

# nmforge-customize

Skill que ensina o modelo de override TOML do NMforge (P7 — customização sem fork) e ajuda o usuário a editar a camada certa.

## Modelo de 3 camadas (+ defaults)

```
framework defaults  (declarados em cada SKILL.md, chave customize-keys)
        ↓
team       <repo>/.nmforge/customize.toml         (commitado)
        ↓
user       ~/.config/nmforge/customize.toml       (não-commitado)
        ↓
local      ./customize.local.toml                 (gitignored)
```

Resolução via `@nmforge/customize-resolver` (deep merge imutável). Camadas posteriores sobrescrevem anteriores.

## Quando usar

1. **Mudar default de uma skill**: ex. `nmforge-skill-create.default_phase = "planning"`.
2. **Setar preferência pessoal**: ex. editor preferido em workflows interativos.
3. **Override pontual em CI**: usar a camada `local` no runner.

## Decisão: qual camada editar?

| Caso | Camada |
|------|--------|
| Convenção da equipe (todos compartilham) | `team` |
| Preferência individual | `user` |
| Hack temporário ou CI | `local` |
| Default oficial do framework | NÃO editar — abrir PR no SKILL.md |

Se ambíguo, use `AskUserQuestion` antes de escrever.

## Modos

- **Create** (`steps-c/`): primeira customização — cria o arquivo da camada.
- **Edit** (`steps-e/`): adiciona/altera chave em arquivo existente.
- **Validate** (`steps-v/`): mostra resolução final mesclando as 3 camadas.

## Comandos úteis

```bash
# Ver chaves customizáveis declaradas em uma skill
grep -A 5 "^customize-keys:" skills/<name>/SKILL.md

# Listar arquivos de cada camada
ls .nmforge/customize.toml ~/.config/nmforge/customize.toml ./customize.local.toml 2>/dev/null

# Resolver mesclagem (via package)
node -e "import('@nmforge/customize-resolver').then(({resolveCustomize})=>resolveCustomize({layers:['.nmforge/customize.toml','~/.config/nmforge/customize.toml','./customize.local.toml']}).then(r=>console.log(JSON.stringify(r,null,2))))"
```

## Sintaxe TOML básica

```toml
# Nested via dotted keys ou tabelas
[nmforge-skill-create.defaults]
default_module = "analysis"
skills_root = "skills"

# Listas
rules_to_skip = ["R-OP47-08"]

# Strings com aspas duplas
editor_command = "code -w"
```

## Anti-patterns

- **Não copie** SKILL.md para customizar — é fork. Override no TOML.
- **Não colide chaves** entre camadas sem intenção — `local` vence sempre, surpresas viram bugs.
- **Não commite** `customize.local.toml` — confira `.gitignore`.

## Customização desta skill

[customize.toml](customize.toml):

- `editor_command`: comando para abrir o TOML em editor externo (default: vazio)
- `confirm_writes`: se `true`, sempre pedir confirmação antes de escrever (default: `true`)

## Steps

- [steps-c/01-pick-layer.md](steps-c/01-pick-layer.md) — escolher camada
- [steps-c/02-write.md](steps-c/02-write.md) — gravar arquivo
- [steps-e/01-edit-key.md](steps-e/01-edit-key.md) — alterar chave existente
- [steps-v/01-show-resolution.md](steps-v/01-show-resolution.md) — mostrar merge final

## Critérios de sucesso

Ver [checklist.md](checklist.md).

## Referências

- DESIGN.md §9 — module system + customize
- packages/customize-resolver/src/resolve.ts — implementação do merge
- CONSTITUTION.md P7 — customização sem fork
