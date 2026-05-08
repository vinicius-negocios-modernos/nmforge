---
name: nmforge-validate
description: |
  Roda o validator (13 regras R-DET-* e R-OP47-*) em uma ou todas as skills e traduz a saída em ações claras.
  Use when: após editar uma skill, antes de commit, ou quando o usuário pede "audit/check/lint" das skills.

allowed-tools: Read, Bash, Glob
effort: low
token_budget: 1200
phase: meta
persona-mode: minimal
language: pt-br
customize-keys:
  - default_strict
  - rules_to_skip
subagent-pattern: none
---

# nmforge-validate

Wrapper amigável de `nmforge validate`. A diferença para chamar o CLI direto: esta skill **interpreta** a saída — agrupa violações por causa raiz, sugere fix, e separa o que é dívida aceitável (warn) do que bloqueia release (fail).

## Quando usar

- Usuário acabou de editar `SKILL.md` e quer feedback imediato.
- Pré-commit ou pré-PR — confirmar que nada quebra.
- Investigar por que CI falhou no passo `pnpm validate`.

## Modos

- **Create** (`steps-c/`): roda do zero, reporta primeiro snapshot.
- **Edit** (`steps-e/`): após mudança específica, valida só a skill afetada.
- **Validate** (`steps-v/`): meta — checa que esta skill em si segue as regras.

## Invocação

Default (todas as skills):

```bash
node packages/cli/bin/nmforge.js validate
```

Filtrar por skill:

```bash
node packages/cli/bin/nmforge.js validate --skill <name>
```

Modo CI (warns viram fail):

```bash
node packages/cli/bin/nmforge.js validate --strict
```

JSON para parsing programático:

```bash
node packages/cli/bin/nmforge.js validate --json
```

## Como interpretar a saída

| Símbolo | Severity | Ação |
|---------|----------|------|
| `[✓]` | OK | Nada a fazer |
| `[!]` | warn | Triagem: corrigir agora ou registrar como dívida |
| `[✗]` | fail | Bloqueia release. Corrija antes de prosseguir |

## Padrões comuns de erro e fix

- **R-DET-01** (`name` não casa com dir) → renomear pasta OU ajustar frontmatter
- **R-DET-02** (sem "Use when:") → adicionar trigger no `description`
- **R-DET-10** (sem `checklist.md`) → criar arquivo com 1+ critério
- **R-OP47-02** (>200 linhas) → mover detalhes para `steps-*/` e `resources/`
- **R-OP47-05** (string proibida) → reescrever sem padrões BMAD-style
- **R-OP47-06** (excede token_budget) → encolher body OU aumentar budget se justificado

Detalhes por regra: ver [resources/rules-cheatsheet.md](resources/rules-cheatsheet.md).

## Customização

[customize.toml](customize.toml):

- `default_strict`: `true` para sempre rodar com `--strict` localmente
- `rules_to_skip`: lista de IDs de regra para suprimir (raríssimo, exige justificativa)

## Steps

- [steps-c/01-run.md](steps-c/01-run.md) — execução básica
- [steps-c/02-interpret.md](steps-c/02-interpret.md) — leitura da saída
- [steps-e/01-fix-iterate.md](steps-e/01-fix-iterate.md) — loop fix-validate
- [steps-v/01-evaluate.md](steps-v/01-evaluate.md) — checklist desta skill

## Critérios de sucesso

Ver [checklist.md](checklist.md).

## Referências

- DESIGN.md §4 — regras do validator
- packages/validator/src/rules/ — implementação de cada regra
- CONSTITUTION.md P5 — test-first
