# How-to — Peer review do tutorial de onboarding

> **Para:** dev externo que vai validar o tutorial antes do release v0.1.
> **Tempo estimado:** 60-90 minutos.
> **Saída esperada:** issue (ou PR) com pontos cegos, fricções e sugestões.

Este protocolo formaliza o item 25 da Fase E do roadmap (DESIGN.md §15): "1 dev externo testa tutorial".

---

## Pré-requisitos

- Você é desenvolvedor familiar com Node + Markdown.
- **Não** trabalhou no NMforge antes (perspectiva fresca é o objetivo).
- Tem acesso a um Mac ou Linux com Node 20+.

## O que estamos validando

NMforge é alpha. Antes de publicar, queremos saber:

1. O onboarding (`docs/tutorials/01-getting-started.md` e `02-sua-primeira-skill.md`) é seguível por quem nunca viu o projeto?
2. Quais passos confundem, falham, ou exigem conhecimento implícito?
3. O que **falta** que você esperava encontrar?
4. O que tem demais (ruído)?

## Setup

```bash
# 1. Clone (substitua pela URL real quando o repo for público)
git clone https://github.com/vinicius-negocios-modernos/nmforge.git ~/peer-review-nmforge
cd ~/peer-review-nmforge

# 2. Crie um branch só para suas anotações
git checkout -b peer-review-<seu-nome>

# 3. Crie o arquivo de notas
touch peer-review-notes.md
```

## Roteiro

### Parte A — Tutorial 01 (5 min na promessa)

Abra [`docs/tutorials/01-getting-started.md`](../tutorials/01-getting-started.md). Siga **exatamente** o que está escrito. Para cada passo:

1. Anote o tempo gasto.
2. Anote qualquer "Hmm, isso não está claro" mesmo se você conseguiu seguir.
3. Anote qualquer comando que falhou.

**Critérios:**

- [ ] Você terminou em ≤ 7 minutos? (Promessa: 5 min)
- [ ] `pnpm test` mostrou 132/132 (ou número atual da promessa)?
- [ ] `nmforge validate` mostrou 5 OK?
- [ ] Algum passo precisou de conhecimento que o tutorial não dá?

### Parte B — Tutorial 02 (10 min na promessa)

Abra [`docs/tutorials/02-sua-primeira-skill.md`](../tutorials/02-sua-primeira-skill.md). Siga até o validator passar.

**Critérios:**

- [ ] Você terminou em ≤ 15 minutos? (Promessa: 10 min)
- [ ] A skill `exemplo-saudacao` passou validator strict?
- [ ] Você entendeu o **propósito** de cada arquivo criado, não só copiou?
- [ ] Algum passo te fez voltar a outra doc (frontmatter, regras, CLI)?

### Parte C — Reference

Sem seguir nada — só **navegue**. Tente responder:

- [ ] Onde está a lista de tools válidas para `allowed-tools`?
- [ ] Qual regra valida que `description` contém "Use when:"?
- [ ] Qual flag do CLI roda em modo CI (warns viram fail)?
- [ ] Como o `PreSkill` hook resolve o `customize.toml`?

Se você não achou em ≤ 30s cada, é sinal de que a navegação precisa melhorar.

### Parte D — Explanation

Leia [`docs/explanation/manifesto.md`](../explanation/manifesto.md) e [`opus-47-aware.md`](../explanation/opus-47-aware.md).

- [ ] Você entendeu **por que** existe NMforge em vez de usar BMAD ou AIOX?
- [ ] Algum princípio da Constitution te pareceu arbitrário ou desnecessário?
- [ ] O que você diria a um colega para descrever NMforge em 1 frase?

## Como reportar

Crie um issue (ou PR contra `peer-review-notes.md`) com:

```markdown
# Peer review NMforge — <seu-nome> — <data>

## Tempo total
- Tutorial 01: X min
- Tutorial 02: Y min

## Bloqueadores
(passos que falharam ou exigiram debug)

## Fricções
(coisas que funcionaram, mas custaram esforço extra)

## Pontos fortes
(o que estava claro / útil / surpreendentemente bom)

## Faltando
(o que você esperava encontrar e não achou)

## Sobrando
(o que tinha demais, ou parecia ruído)

## Frase de resumo
(NMforge é ____, em 1 frase, na sua palavra)
```

## O que esperar de retorno

- Mantenedor (Vinicius Caetano) responde em ≤ 7 dias.
- Issues são triaged como `peer-review-fixable` (corrigir antes de v0.1) ou `peer-review-followup` (para v0.2+).
- Você é citado nos release notes da v0.1.0 (com sua autorização).

## Honestidade esperada

- Reporte mesmo as coisas pequenas. Atrito que parece bobagem é sinal real.
- Diga se você desistiu — em qual passo, por quê.
- Não suavize. "Confuso" é mais útil que "talvez possa ser mais claro".

## Ver também

- [`CONTRIBUTING.md`](../../CONTRIBUTING.md) — guia geral de contribuição.
- [Tutorial 01](../tutorials/01-getting-started.md), [Tutorial 02](../tutorials/02-sua-primeira-skill.md) — alvos do review.
