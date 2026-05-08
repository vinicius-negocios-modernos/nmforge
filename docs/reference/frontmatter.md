# Reference — Frontmatter de SKILL.md

*Spec canônica do frontmatter. Cada campo é checado por uma ou mais regras do validator.*

---

## Forma geral

```yaml
---
# Identidade
name: nmforge-create-prd
description: |
  Generates a Product Requirements Document from a brief.
  Use when: user has a project brief and needs structured PRD before architecture.

# Capacidades
allowed-tools: Read, Write, Edit, Glob, Grep
effort: medium
token_budget: 2500
phase: planning

# Workflow graph
preceded-by: [nmforge-product-brief]
followed-by: [nmforge-create-architecture]
required-artifacts: [docs/brief.md]
output-artifacts: [docs/prd.md]

# Persona
persona-mode: minimal
# persona-name: John
# persona-icon: "📋"

# i18n
language: auto

# Customization
customize-keys:
  - target_audience
  - prd_format

# Subagent strategy
subagent-pattern: none
---
```

## Campos

### `name` *(obrigatório)*

- **Tipo:** string kebab-case.
- **Casa com:** basename do diretório da skill.
- **Validador:** R-DET-01 (fail).
- **Exemplo válido:** `nmforge-create-prd`, `wds-extract-data`.
- **Exemplo inválido:** `My Skill`, `myskill`, `nmforge_create_prd`.

### `description` *(obrigatório)*

- **Tipo:** string YAML, multilinha (`|`) recomendado.
- **Requisito:** contém substring literal `Use when:` indicando trigger.
- **Validador:** R-DET-02 (fail).
- **Por quê:** o modelo decide invocar a skill com base nesse campo via Skill tool.

### `allowed-tools` *(obrigatório)*

- **Tipo:** array de strings OU string CSV.
- **Valores aceitos:** `Read`, `Write`, `Edit`, `Bash`, `Glob`, `Grep`, `Skill`, `Task`, `TodoWrite`, `NotebookEdit`, `WebFetch`, `WebSearch`, `AskUserQuestion`, `ExitPlanMode`, `BashOutput`.
- **Validador:** R-DET-03 (fail) + R-OP47-04 (fail, ênfase).
- **Princípio:** menor privilégio (ADR-012). Hook PreSkill aplica como `permissions.allow`.

### `effort`

- **Tipo:** string enum.
- **Valores:** `low` | `medium` | `high`.
- **Por quê:** hooks ajustam injection de contexto.
- **Validador:** R-DET-04 (planejado), R-INF-01 (info — sugere baseado em tamanho).

### `token_budget`

- **Tipo:** número (tokens estimados).
- **Validador:** R-OP47-06 (fail) — body em tokens (chars/4) deve ser ≤ `budget × 1.2`.
- **Por quê:** disciplina de tamanho. CI quebra se body inflar.

### `phase`

- **Tipo:** string enum.
- **Valores:** `analysis` | `planning` | `solutioning` | `implementation` | `meta`.
- **Por quê:** `nmforge-help` agrupa por phase.
- **Validador:** R-DET-05 (planejado).

### `preceded-by` / `followed-by`

- **Tipo:** array de strings (nomes de skills).
- **Por quê:** `nmforge-help` constrói grafo de workflow.
- **Validador:** R-INF-02 (warn) — referências apontam para skills existentes.

### `required-artifacts` / `output-artifacts`

- **Tipo:** array de paths (glob aceito).
- **Por quê:** help router avisa "você precisa criar X primeiro".
- **Validador:** R-INF-03 (info).

### `persona-mode`

- **Tipo:** string enum.
- **Valores:** `minimal` | `named` | `full`.
- **Default:** `minimal` (P4 — opt-in).
- **Validador:** R-DET-06 (planejado), R-INF-04 (warn se `full` + Haiku).

### `language`

- **Tipo:** string enum.
- **Valores:** `en` | `pt-br` | `auto`.
- **Validador:** R-DET-07 (planejado), R-INF-06 (warn — mistura PT/EN no body).

### `customize-keys`

- **Tipo:** array de strings.
- **Por quê:** declara contrato público de overrides via `customize.toml`.
- **Validador:** R-DET-08 (planejado).

### `subagent-pattern`

- **Tipo:** string enum.
- **Valores:** `none` | `parallel` | `fan-out`.
- **Por quê:** documenta intent de paralelismo (ADR-007).
- **Validador:** R-DET-09 (planejado).

## Regras determinísticas implementadas (v0.1)

A partir de v0.1.0, estas falham build:

- R-DET-01: name casa com dirname
- R-DET-02: description tem `Use when:`
- R-DET-03: allowed-tools válidas
- R-DET-10: checklist.md presente
- R-DET-12: frontmatter parseável

R-DET-04..09 estão no DESIGN mas implementação é incremental — chegam em v0.2.

## Ver também

- [Reference: validator-rules](validator-rules.md) — todas as 13 regras.
- [DESIGN.md §3.1](../../DESIGN.md) — spec original.
- [Skill template em CLI](../../packages/cli/src/commands/skill.ts) — referência de scaffold.
