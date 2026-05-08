# NMforge — Constitution v0.1

*Documento fundador, não-negociável.*
*Versão: 0.1 (ratificada em 2026-05-08).*
*Autor: Vinicius Caetano.*

---

## Por que esta Constituição existe

Frameworks de orquestração de agentes de IA tendem a inflar com o tempo: prompts viram litania de avisos, "agentes" duplicam-se em quatro pastas, persona-overhead vira pedágio obrigatório, customizações exigem fork. NMforge é uma reação informada a esse padrão. A Constitution é o contrato — curto, executável, testável — que impede a degeneração.

Cada princípio é uma frase + um parágrafo de contexto + um critério de violação que pode ser detectado pelo validator (ou por revisor humano). Não é aspiração; é portão.

---

## P1 — Native-first, custom-only-when-needed

Features do Claude Code (Skill tool, Plan/Explore subagents, deferred tools, prompt cache 1h, hooks com env vars) são default. Implementação custom só onde provadamente agrega valor não oferecido pelo harness.

**Violação:** recriar Plan via prompt narrativo quando `Task(subagent_type="general-purpose")` já resolve.

---

## P2 — Opus 4.7-aware, model-agnostic

O framework é otimizado para Claude Opus 4.7 (prompts curtos, thinking nativo respeitado, deferred tools), mas **nunca hardcoda modelo**. Modelo é decisão do usuário via env var.

**Violação:** qualquer string `claude-opus-4-7` ou similar em código de produção fora de docs.

---

## P3 — Token budget é cidadão de primeira classe

Cada SKILL declara `token_budget` no frontmatter; o validator quebra build se body exceder budget × 1.2. Lista numerada de Read calls > 3 vira warn. Persona-overhead default off.

**Violação:** SKILL.md com mais de 200 linhas sem split em sub-skills.

---

## P4 — Persona é opt-in, não obrigatório

Default `persona-mode: minimal` (sem greeting, sem icon prefix, sem "do not break character"). Persona nomeada existe para quem quer (`persona-mode: named` ou `full`), mas o usuário técnico não paga pedágio.

**Violação:** skill que assume persona ativa para funcionar.

---

## P5 — Test-first como gate de release

Cada SKILL nasce com `checklist.md` (critérios de aceitação) + `steps-v/` (validação). Sem isso, validator falha. CI não merge. Cobertura mínima por camada documentada no DESIGN.md (Seção 7).

**Violação:** skill sem checklist.md no PR.

---

## P6 — Diataxis-driven docs, em PT primeiro

Docs estruturadas em tutorials / how-to / reference / explanation (modelo Diataxis). Português é a língua primária; inglês é tradução secundária garantida apenas para reference (mínimo). Style guide automatizado via markdown lint.

**Violação:** nova feature merge sem doc Diataxis correspondente.

---

## P7 — Customização sem fork

Override em camadas TOML — `framework defaults` → `team` → `user` → `local` (3 camadas explícitas + 1 implícita via env vars). Resolução em **Node, via hook nativo**, sem subprocess Python.

**Violação:** skill que codifica behavior de projeto-específico em vez de delegar pra customize.toml.

---

## P8 — Honestidade sobre o que somos

Não somos cérebro, somos cinto de utilidade. Não somos metodologia, somos infraestrutura. Não somos orquestrador externo, somos engenharia de prompt estruturada que roda dentro do LLM.

**Violação:** marketing que prometa "AI agents that work autonomously" sem caveats.

---

## Como esta Constituição evolui

- **Adicionar princípio:** PR com discussão prévia em GitHub Discussions, mínimo 14 dias de debate, aprovação do mantenedor (Vinicius Caetano enquanto único). Após v1.0, requer maioria simples de mantenedores ativos.
- **Modificar princípio existente:** apenas para esclarecimento ou ajuste de critério de violação. Mudança semântica → novo princípio + deprecação do antigo.
- **Remover princípio:** apenas se substituído por outro mais forte. Decisão registrada no CHANGELOG.
- **Regras do validator** (`R-OP47-*` em DESIGN.md Seção 4.2) são a expressão executável destes princípios. Adicionar/relaxar regra exige justificativa por princípio violado/protegido.

---

*Esta Constituição é curta de propósito. Comparativo: AIOX tem ~30 NON-NEGOTIABLE/MUST/SHOULD em 6 artigos; BMAD não tem constitution explícita. Nosso ponto: enxuta, executável, testável — cada princípio cabe num grep e num review humano.*
