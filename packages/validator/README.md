# @nmforge/validator

Skill validator para NMforge — regras determinísticas + Opus 4.7 hygiene.

## Status

v0.1 (MVP + B+). **13 regras** ativas: 5 determinísticas + 8 hygiene.

## Uso programático

```ts
import { discoverSkills, loadSkill, runValidation } from '@nmforge/validator';

const roots = await discoverSkills(process.cwd());
for (const root of roots) {
  const ctx = await loadSkill(root);
  const result = runValidation(ctx, { strict: true });
  console.log(result.skill, result.passed ? 'OK' : 'FAIL');
}
```

## Regras determinísticas (severity: fail)

| ID | O que checa |
|---|---|
| **R-DET-01** | `name` no frontmatter casa com basename do dir, kebab-case |
| **R-DET-02** | `description` ≥ 1 frase com substring "Use when:" |
| **R-DET-03** | `allowed-tools` presente e valores válidos (CC 2.1.x) |
| **R-DET-10** | `checklist.md` existe (P5 test-first gate) |
| **R-DET-12** | Frontmatter YAML é parseável |

## Regras Opus 4.7 hygiene

| ID | Severity | O que checa |
|---|---|---|
| **R-OP47-01** | warn | ≤ 5 ocorrências de `CRITICAL:` ou `<critical>` no body |
| **R-OP47-02** | warn | Body ≤ 200 linhas |
| **R-OP47-03** | warn | Listas numeradas de ≥ 4 Read/Load consecutivos pedem hint de paralelismo |
| **R-OP47-04** | fail | `allowed-tools` declarado (alias-emphasis para R-DET-03) |
| **R-OP47-05** | **fail** | Strings proibidas: STAY IN CHARACTER, NO LYING, NO CHEATING, DO NOT skip steps, DO NOT break character |
| **R-OP47-06** | fail | Body não excede `token_budget × 1.2` (aproximação chars/4) |
| **R-OP47-07** | warn | ≤ 5 ocorrências de `MUST` (case-sensitive) no body |
| **R-OP47-08** | warn | Pre-section content (intro/ritual) ≤ 30 linhas antes do primeiro `## ` header |

### Por que essas regras existem

Todas derivam de anti-patterns mensurados em frameworks concorrentes (`bmad-analise.md` D2):

- BMAD-METHOD: 297 `<critical>`, 185 `MUST`, workflows de até 1.512 linhas, activation ritual de 57 linhas idêntico em todos agents.
- AIOX: 150 `<critical>`, 137 `MUST`, 25+ "STAY IN CHARACTER", 4 cópias de cada agent.

Anti-patterns não são opcionais: degradam Opus 4.7 mensuravelmente.

## Como rodar

```bash
nmforge validate                    # roda todas as regras
nmforge validate --strict           # warns viram fails (CI mode)
nmforge validate --skill <name>     # uma skill só
nmforge validate --rule R-OP47-05   # uma regra só
nmforge validate --json             # output JSON para CI parsing
```

## License

MIT © Vinicius Caetano
