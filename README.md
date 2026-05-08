# NMforge

> Framework Node-nativo de orquestração de agentes para Claude Code 2.1.x, otimizado para Opus 4.7.

**Status:** v0.1 (draft pré-release). MVP em construção.

**Tagline (PT):** *Forge para Negócios Modernos.*
**Tagline (EN):** *Forge for modern business AI.*

---

## O que é

NMforge é um framework opinativo para construir, validar e distribuir **skills** (capacidades reutilizáveis para agentes de IA) específicas para Claude Code 2.1.x. Combina:

- **Skills auto-contidas** (frontmatter padronizado + validator determinístico).
- **Customização sem fork** (overrides TOML em 3 camadas, resolução em Node).
- **Módulos externos via npm** (extension pack como `@nmforge/analysis`, `@nmforge/test`, etc.).
- **Hooks nativos** que consomem env vars do Claude Code (`$CLAUDE_EFFORT`, `$CLAUDE_TOOL_NAME`, etc.).
- **Features 2.1.x ativadas por default**: prompt cache 1h, deferred tools, Plan/Explore subagents, `worktree.baseRef`.

**Não somos cérebro, somos cinto de utilidade.** Engenharia de prompt estruturada que roda dentro do LLM, não orquestrador externo.

---

## Por que existe

Os frameworks dominantes (BMAD-METHOD, AIOX) foram construídos antes do Claude Code 2.1.x e do Opus 4.7. Carregam dívida arquitetural mensurável: prompts inflados (BMAD: 297 ocorrências de `CRITICAL:` em `src/`), workflows de 1.500+ linhas que competem com o thinking nativo, persona-overhead obrigatório, zero uso de prompt cache 1h ou deferred tools.

NMforge nasce **Claude Code 2.1.x-native** desde o primeiro commit, com:

- Validator que rejeita anti-patterns de Opus 4.7 hygiene automaticamente.
- `token_budget` declarado por skill.
- `effort` no frontmatter (low/medium/high) reagindo a `$CLAUDE_EFFORT`.
- PT-BR primary, EN secondary.
- Persona opt-in (default minimal).

Para o racional completo, ver [DESIGN.md](DESIGN.md) e [CONSTITUTION.md](CONSTITUTION.md).

---

## Status atual (v0.1 pré-release)

⚠️ **Em construção.** Ainda não publicado no npm. Acompanhe o progresso pelos commits.

**Roadmap MVP (v0.1):**

| Fase | Conteúdo | Status |
|---|---|---|
| A — Setup | Repo + DESIGN + CONSTITUTION + LICENSE | ✅ feito |
| B — Spikes | Validator + hook PreSkill + customize-resolver | ⏳ próximo |
| C — Skills core | nmforge-help, nmforge-doctor, nmforge-customize, nmforge-skill-create, nmforge-validate | ⏳ |
| D — Docs | Tutorial PT + reference + how-tos | ⏳ |
| E — Validation | CI verde + cobertura ≥85% + dev externo testa | ⏳ |
| F — Release | Publicar `@nmforge/core@0.1.0` no npm | ⏳ |

**Estimativa MVP:** 6-8 semanas calendário.

---

## Documentos fundadores

- [`DESIGN.md`](DESIGN.md) — Design doc completo (1.486 linhas): manifesto, arquitetura, ADRs, MVP scope, roadmap, riscos.
- [`CONSTITUTION.md`](CONSTITUTION.md) — 8 princípios não-negociáveis.
- `CHANGELOG.md` — em breve.
- `CONTRIBUTING.md` — em breve.

---

## Diferenciação rápida

| | NMforge | BMAD v6.6 | AIOX 5.1 |
|---|---|---|---|
| Modelo hardcoded | **nunca** | nunca | claude-3-5-sonnet |
| Persona obrigatória | **não** (opt-in) | sim | sim |
| Skill-validator | **sim** + Opus 4.7 hygiene | sim (19 regras) | não |
| Prompt cache 1h documentado | **default ON** | não | não |
| Hooks usam `$CLAUDE_*` env vars | **todos** | não | parcial |
| `effort` no frontmatter | **sim** (hooks reagem) | não | não |
| `token_budget` no frontmatter | **sim** (validator quebra) | não | não |
| Subprocess Python obrigatório | **nunca** | sim (toda ativação) | não |
| Test-first como gate | **sim** | parcial | parcial |
| i18n docs | **PT primary, EN secondary** | EN primary | mistura |

Tabela completa em DESIGN.md, Apêndice A.

---

## License

[MIT](LICENSE) © 2026 Vinicius Caetano

Distribuído pela [Negócios Modernos](https://negociosmodernos.com.br) *(em breve)*.

---

## Autor

**Vinicius Caetano** — Consultor em IA aplicada a negócios.
- Consultoria: Vinicius Caetano
- Canal: [Negócios Modernos](https://negociosmodernos.com.br)
- Loja: XP Vendas

---

*Em construção. Star o repo se quer acompanhar o lançamento.*
