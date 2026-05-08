---
name: nmforge-doctor
description: |
  Audita projeto NMforge: detecta anti-patterns Opus 4.7, modelos legados em código, refs órfãs, hooks ausentes.
  Use when: usuário relata "está estranho", antes de release, ou pede health-check do projeto inteiro.

allowed-tools: Read, Bash, Glob, Grep, Task
effort: medium
token_budget: 2000
phase: meta
persona-mode: minimal
language: pt-br
customize-keys:
  - check_legacy_models
  - check_anti_patterns
  - check_orphan_refs
  - severity_threshold
subagent-pattern: parallel
---

# nmforge-doctor

Skill complementar ao CLI `nmforge doctor`. O CLI faz checks rápidos (presença de `_nmforge/`, `.claude/settings.json`, etc.). Esta skill faz auditoria mais profunda — anti-patterns Opus 4.7, modelos legados hardcoded, refs órfãs entre skills.

## Quando usar

- Onboarding de projeto desconhecido — entender estado.
- Antes de bumpar versão — gate de release informal.
- Bug "do nada" — ver se algo estrutural quebrou.

## O que checa (vs CLI)

| Check | CLI doctor | Skill doctor |
|-------|-----------|--------------|
| Presença de `_nmforge/`, `.claude/` | ✓ | — (delega) |
| `ENABLE_PROMPT_CACHING_1H` em settings | ✓ | — (delega) |
| Skills descobertas (count) | ✓ | — (delega) |
| Modelos legados em código (`claude-3-5-*`, `claude-sonnet-3-*`) | — | ✓ |
| Anti-patterns 4.7 (subprocess Python em hooks, persona obrigatória) | — | ✓ |
| Refs órfãs entre skills (`preceded-by`/`followed-by`) | — | ✓ |
| `customize-keys` declarados mas nunca usados em customize.toml | — | ✓ |
| Skills sem ao menos 1 step file | — | ✓ |

Roda CLI primeiro, depois adiciona checks profundos.

## Estratégia: subagents paralelos

Para projetos grandes (>20 skills), use `Task(subagent_type="Explore")` em paralelo:

1. Subagent A: grep modelos legados em todo `packages/` e `skills/`
2. Subagent B: cross-reference de refs `preceded-by`/`followed-by` vs skills existentes
3. Subagent C: check hooks Python (`subprocess|child_process.*python`)

Spawn 3 em uma única mensagem, espere todos, agregue.

## Modos

- **Create** (`steps-c/`): rodar audit completo, gerar relatório fresco.
- **Edit** (`steps-e/`): rodar check específico após fix.
- **Validate** (`steps-v/`): meta-check desta skill.

## Output

Relatório estruturado:

```
NMforge doctor — auditoria de <cwd>

[CLI checks]
[✓] _nmforge/                 present
[!] ENABLE_PROMPT_CACHING_1H  not set
...

[Deep checks]
[✓] No legacy model strings
[✗] 2 orphan refs found:
    - skill-foo references unknown `bar-baz` in preceded-by
[!] 3 customize-keys declared but unused
    - skill-foo: target_audience, prd_format
```

Severidade configurável (`severity_threshold` no customize.toml).

## Customização

[customize.toml](customize.toml):

- `check_legacy_models`: incluir busca por modelos antigos (default: true)
- `check_anti_patterns`: incluir busca por anti-patterns (default: true)
- `check_orphan_refs`: incluir cross-reference de skills (default: true)
- `severity_threshold`: `info` | `warn` | `fail` — só reporta acima desse nível

## Steps

- [steps-c/01-run-cli.md](steps-c/01-run-cli.md) — delega ao CLI
- [steps-c/02-deep-checks.md](steps-c/02-deep-checks.md) — checks adicionais em paralelo
- [steps-c/03-aggregate.md](steps-c/03-aggregate.md) — consolida relatório
- [steps-e/01-rerun-check.md](steps-e/01-rerun-check.md) — re-roda check específico
- [steps-v/01-evaluate.md](steps-v/01-evaluate.md) — checklist desta skill

## Critérios de sucesso

Ver [checklist.md](checklist.md).

## Referências

- DESIGN.md §11 — CLI doctor
- packages/cli/src/commands/doctor.ts — implementação base
- CONSTITUTION.md P1, P2 — native-first, model-agnostic
