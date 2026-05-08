# Explanation — Manifesto (TL;DR da Constitution)

> Esta página resume o porquê do NMforge em 5 minutos de leitura. Para o documento canônico, ver [`CONSTITUTION.md`](../../CONSTITUTION.md).

---

## A tese

Frameworks de orquestração de agentes (BMAD-METHOD, AIOX) carregam dívida arquitetural mensurável: prompts inflados, persona obrigatória, customização exige fork, zero uso de features modernas do Claude Code 2.1.x.

NMforge é uma **reação informada**: um framework Claude Code 2.1.x-native desde o primeiro commit, com validador automático de Opus 4.7 hygiene.

## O que mudou no Claude Code 2.1.x

- **Skill tool nativa** — modelo decide quando invocar; não precisa de loader externo.
- **Plan / Explore subagents** — paralelismo via `Task(subagent_type=...)`, não via narrativa.
- **Deferred tools** — schemas carregados sob demanda; reduz prompt inicial.
- **Prompt cache 1h** — economia ~70%+ em sessões skill-heavy.
- **Hooks com env vars** (`$CLAUDE_*`) — integração nativa, sem subprocess.

Frameworks pré-2.1.x não usam nada disso. NMforge é feito em torno disso.

## Os 8 princípios (resumo)

1. **Native-first** — só implemente custom o que o harness não oferece.
2. **Opus 4.7-aware, model-agnostic** — otimizado para 4.7, mas nunca hardcoda modelo.
3. **Token budget é cidadão de primeira classe** — declarado por skill, validator quebra build se inflar.
4. **Persona é opt-in** — default `minimal`. Quem quer pode ativar `named` ou `full`.
5. **Test-first como gate de release** — sem `checklist.md`, validator falha.
6. **Diataxis-driven docs, em PT primeiro** — tutorials/how-to/reference/explanation.
7. **Customização sem fork** — overrides TOML em 3 camadas.
8. **Honestidade sobre o que somos** — não somos cérebro, somos cinto de utilidade.

Detalhes e critérios de violação por princípio: [`CONSTITUTION.md`](../../CONSTITUTION.md).

## O que NMforge não é

- **Não é metodologia.** Você decide o processo. O framework dá ferramentas.
- **Não é orquestrador externo.** Roda dentro do Claude Code, não substitui ele.
- **Não é replacement de BMAD ou AIOX** para quem está feliz com eles. É alternativa para quem sente o atrito.

## O que NMforge é

- **Cinto de utilidade** para construir, validar e distribuir skills opinadas.
- **Validator automático** que rejeita anti-patterns Opus 4.7.
- **Customize-resolver** que evita fork.
- **Hooks Node-only** que consomem env vars do Claude Code.
- **Diataxis em PT primeiro**, EN secondary.

## Honestidade técnica

- v0.1 é alpha local. **Não publicado no npm**, **não tem repo público**.
- Coverage threshold 80% configurada, **mas não medida ainda**.
- 5 R-DET-* implementadas; R-DET-04..09 e R-INF-* são v0.2.
- Site Astro/Starlight planejado, **não construído**.

Para o estado real e ao vivo, ver [STATUS.md](../../STATUS.md).

## Ver também

- [`CONSTITUTION.md`](../../CONSTITUTION.md) — princípios canônicos.
- [Explanation: Opus 4.7-aware](opus-47-aware.md) — por que prompt curto importa.
- [`DESIGN.md`](../../DESIGN.md) — design completo (1.486 linhas).
