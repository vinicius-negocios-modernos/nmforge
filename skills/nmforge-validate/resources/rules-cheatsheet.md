# Cheatsheet das 13 regras

## Determinísticas (R-DET-*) — fail bloqueia release

| ID | O que checa | Fix típico |
|----|-------------|-----------|
| R-DET-01 | `name` casa com basename do dir | Renomear pasta OU corrigir frontmatter |
| R-DET-02 | `description` contém "Use when:" | Adicionar linha de trigger |
| R-DET-03 | `allowed-tools` é lista válida | Conferir nomes em DESIGN.md §3.2 |
| R-DET-10 | `checklist.md` existe na pasta | Criar com 1+ critério |
| R-DET-12 | YAML do frontmatter parseia | Validar indentação |

## Opus 4.7 hygiene (R-OP47-*) — mistura warn/fail

| ID | Severity | O que checa |
|----|----------|-------------|
| R-OP47-01 | warn | ≤ 5 ocorrências de `CRITICAL:` ou `<critical>` |
| R-OP47-02 | warn | SKILL.md ≤ 200 linhas |
| R-OP47-03 | warn | ≤ 3 Read calls sequenciais sem paralelismo |
| R-OP47-04 | fail | `allowed-tools` declarado (ênfase) |
| R-OP47-05 | fail | Sem strings proibidas (BMAD-style) |
| R-OP47-06 | fail | Body ≤ token_budget × 1.2 |
| R-OP47-07 | warn | `MUST` ≤ 5 ocorrências |
| R-OP47-08 | warn | Ritual de ativação ≤ 30 linhas |

## Estratégia para warns

- 1 warn isolado → corrigir.
- 3+ skills com mesmo warn → revisar padrão sistêmico antes de mexer caso a caso.
- Warn que persiste após reduzir → registrar como dívida no `checklist.md` da skill com motivo.
