# Reference — Regras do validator

*16 regras: 5 R-DET-* (determinísticas), 3 R-AS-* (padrão aberto Agent Skills) e 8 R-OP47-* (hygiene).*

## Perfis

`--profile` escolhe o conjunto de regras (padrão `nmforge`):

| Perfil | Para quê | Diferença |
|---|---|---|
| `nmforge` | skills do framework | exige "Use when:" na description (R-DET-02), `allowed-tools` (R-DET-03) e `checklist.md` (R-DET-10) |
| `agentskills` | qualquer skill no padrão aberto ([agentskills.io](https://agentskills.io)): Claude Code, claude.ai, Agent SDK | troca R-DET-02/03/10 por R-AS-01/02/03: só `name` e `description` são obrigatórios |

As demais regras rodam nos dois perfis. Uma regra pedida com `--rule` roda em qualquer perfil.

---

## Sumário

| ID | Categoria | Severity | Implementado |
|----|-----------|----------|--------------|
| R-DET-01 | det | fail | ✅ |
| R-DET-02 | det | fail | ✅ |
| R-DET-03 | det | fail | ✅ |
| R-DET-10 | det | fail | ✅ |
| R-DET-12 | det | fail | ✅ |
| R-AS-01 | agentskills | fail | ✅ |
| R-AS-02 | agentskills | fail | ✅ |
| R-AS-03 | agentskills | warn | ✅ |
| R-OP47-01 | hyg | warn | ✅ |
| R-OP47-02 | hyg | warn | ✅ |
| R-OP47-03 | hyg | warn | ✅ |
| R-OP47-04 | hyg | fail | ✅ |
| R-OP47-05 | hyg | fail | ✅ |
| R-OP47-06 | hyg | fail | ✅ |
| R-OP47-07 | hyg | warn | ✅ |
| R-OP47-08 | hyg | warn | ✅ |

R-DET-04..09 e R-INF-* estão no roadmap.

## R-AS-01 — `name` no formato do padrão aberto (perfil `agentskills`)

1–64 caracteres, só minúsculas, dígitos e hífens simples, sem hífen no início ou no fim, e sem as palavras reservadas `claude` e `anthropic` (recusadas no upload do claude.ai).

## R-AS-02 — `description` (perfil `agentskills`)

Obrigatória, 10–1024 caracteres, sem tags XML. Deve dizer o que a skill faz e quando usar, em qualquer redação; a frase literal "Use when:" não é exigida.

## R-AS-03 — `allowed-tools` opcional (perfil `agentskills`)

Ausente é válido. Presente, aceita lista YAML ou string separada por espaço ou vírgula, padrões com argumentos (`Bash(git:*)`) e ferramentas MCP (`mcp__*`). Nome desconhecido gera `warn`, porque cada agente tem o próprio conjunto de ferramentas.

---

## R-DET-01 — `name` casa com basename do dir

**Severity:** fail.

**Checa:** valor de `name` no frontmatter é igual ao nome da pasta da skill.

**Violação:**

```
skills/myskill/SKILL.md
---
name: my-skill   # <- diff
```

**Fix:** renomeie a pasta OU corrija o frontmatter. Use o que combinar com kebab-case.

---

## R-DET-02 — `description` contém "Use when:"

**Severity:** fail.

**Checa:** `description` é não-vazio e contém substring literal `Use when:`.

**Violação:**

```yaml
description: "Generates a PRD"
```

**Fix:**

```yaml
description: |
  Generates a PRD from a brief.
  Use when: user has a brief and needs a PRD.
```

**Por quê:** sem trigger explícito, modelo não sabe quando invocar via Skill tool.

---

## R-DET-03 — `allowed-tools` válidas

**Severity:** fail.

**Checa:** `allowed-tools` está presente, é array ou CSV, e cada item está na lista de tools nativas.

**Violação:**

```yaml
allowed-tools: ReadFile, FileSystem.Write
```

**Fix:** use nomes canônicos de [`reference/frontmatter.md`](frontmatter.md#allowed-tools-obrigatório).

---

## R-DET-10 — `checklist.md` presente

**Severity:** fail.

**Checa:** existe arquivo `checklist.md` na raiz da pasta da skill.

**Violação:**

```
skills/myskill/
├── SKILL.md
└── steps-c/
    (sem checklist.md)
```

**Fix:** crie `checklist.md` com pelo menos 1 critério verificável.

**Por quê:** P5 — test-first como gate de release.

---

## R-DET-12 — Frontmatter YAML parseável

**Severity:** fail.

**Checa:** o bloco entre `---` ... `---` no topo é YAML válido.

**Violação:**

```yaml
---
name: foo
description: |
   Two indents       # <- indentação inconsistente
  Use when: ...
---
```

**Fix:** use indentação consistente (2 espaços). Teste com `node -e "import('yaml').then(...)"` se em dúvida.

---

## R-OP47-01 — Limite de `CRITICAL:` ou `<critical>`

**Severity:** warn.

**Checa:** ≤ 5 ocorrências no body.

**Por quê:** estilo BMAD inflava prompts (297 ocorrências em src/). Opus 4.7 não responde melhor a CAPS LOCK.

---

## R-OP47-02 — SKILL.md ≤ 200 linhas

**Severity:** warn.

**Checa:** total de linhas (incluindo frontmatter).

**Fix se exceder:** mover detalhe para `steps-*/`, `resources/`, ou splitar em sub-skills.

---

## R-OP47-03 — Reads sequenciais sem paralelismo

**Severity:** warn.

**Checa:** lista numerada com 4+ Read calls consecutivos sem dica de paralelismo.

**Violação:**

```markdown
1. Read X
2. Read Y
3. Read Z
4. Read W
```

**Fix:** adicione menção a paralelismo ou splitte:

```markdown
Em paralelo, leia X, Y, Z, W (uma única mensagem com 4 Read tools).
```

---

## R-OP47-04 — `allowed-tools` declarado (ênfase)

**Severity:** fail.

Idêntico a R-DET-03 — mantido para reforço. Princípio do menor privilégio (ADR-012).

---

## R-OP47-05 — Strings proibidas

**Severity:** fail.

**Banidas:**

- `STAY IN CHARACTER`
- `NO LYING`
- `NO CHEATING`
- `DO NOT skip steps`

**Por quê:** padrões BMAD/AIOX que assumem persona obrigatória ou desconfiança do modelo. Contraria P4 (persona opt-in) e P8 (honestidade).

**Fix:** reescreva sem coerção. Opus 4.7 segue instruções claras sem precisar de retórica defensiva.

---

## R-OP47-06 — Body ≤ token_budget × 1.2

**Severity:** fail.

**Checa:** se `token_budget` declarado, body em tokens (aproximação `chars/4`) ≤ `budget × 1.2`.

**Tolerância 20%:** absorve variabilidade de tokenização (tiktoken vs aproximação).

**Fix:** encolha body OU justifique aumento do `token_budget`. NÃO suba budget só pra silenciar regra.

---

## R-OP47-07 — `MUST` ≤ 5 ocorrências

**Severity:** warn.

**Por quê:** BMAD usa `MUST` 185 vezes em src/. Repetição excessiva diminui sinal.

**Fix:** mantenha `MUST` para invariantes reais. Use prosa imperativa ("Crie", "Rode") para passos.

---

## R-OP47-08 — Ritual de ativação ≤ 30 linhas

**Severity:** warn.

**Checa:** primeiras 30 linhas do body.

**Por quê:** estilo BMAD tinha ~57 linhas de ritual antes de qualquer passo útil. Opus 4.7 não precisa.

**Fix:** vá direto ao ponto. Frontmatter já estabelece contexto.

---

## Como executar

```bash
# Todas as regras, todas as skills
node packages/cli/bin/nmforge.js validate

# Strict (warns viram fails)
node packages/cli/bin/nmforge.js validate --strict

# Uma skill só
node packages/cli/bin/nmforge.js validate --skill nmforge-help

# Uma regra só
node packages/cli/bin/nmforge.js validate --rule R-OP47-05

# JSON para CI
node packages/cli/bin/nmforge.js validate --json
```

## Ver também

- [Reference: frontmatter](frontmatter.md)
- [Reference: CLI](cli.md)
- [DESIGN.md §4](../../DESIGN.md) — racional de cada regra.
