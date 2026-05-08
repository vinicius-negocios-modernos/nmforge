# NMforge — contexto para Claude Code

> Carregado automaticamente em toda sessão Claude aberta neste diretório.

## O que é

NMforge é um framework Node-nativo de orquestração de skills para Claude Code 2.1.x, otimizado para Opus 4.7. Ainda em construção (v0.1, não publicado).

## Como retomar trabalho

1. Leia `STATUS.md` — estado atual + próximas ações concretas
2. `git log --oneline` — timeline (4 commits esperados)
3. `pnpm test` — esperado: 96/96 verde

## Documentos canônicos

- `STATUS.md` — fonte da verdade do estado operacional (atualize ao final de cada sessão não-trivial)
- `CONSTITUTION.md` — 8 princípios não-negociáveis (referência ao tomar decisões)
- `DESIGN.md` — design completo, 1.486 linhas. Seção 15 tem roadmap por fase.

## Stack

- pnpm workspaces (4 packages: `validator`, `customize-resolver`, `hooks`, `cli`)
- TypeScript strict + ESM puro, Node 20+
- Vitest para testes, tsup para build, ESLint v9 flat + Prettier

## Princípios que afetam código (resumo da CONSTITUTION)

- **P1 Native-first:** prefira features nativas do Claude Code 2.1.x (Skill tool, Plan/Explore, deferred tools, hooks env vars). Não recriar via prompt narrativo.
- **P2 Model-agnostic:** nunca hardcoda nome de modelo. Use env var.
- **P3 Token budget:** SKILL.md ≤ 200 linhas. Persona-overhead default off.
- **P4 Persona opt-in:** `persona-mode: minimal` é o default.
- **P5 Test-first:** toda skill exige `checklist.md`. Sem isso, validator falha.
- **P7 Sem Python:** hooks e resolvers em Node. Subprocess Python é proibido em código core.
- **P8 Honestidade:** somos cinto de utilidade, não cérebro. Sem promessas de "agentes autônomos".

## Convenções

- Idioma: docs em PT-BR, código/prompts em EN.
- Commits: Conventional Commits (`feat(b+):`, `chore:`, `docs:`).
- Co-author Claude em commits seus: `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>`
- Branch único: `main`. Sem GitHub público ainda.

## O que NÃO fazer

- Não criar `agent-handoff-tmpl.yaml` ou similar (cerimônia AIOX viola P3/P8 — handoff é STATUS.md + git + memory).
- Não adicionar dependência Python.
- Não escrever `STAY IN CHARACTER`, `NO LYING`, `DO NOT skip steps` em SKILL.md (validator falha — R-OP47-05).
- Não exceder 5 ocorrências de `CRITICAL:` ou `MUST` em um SKILL.md (warns).

## Memory adicional

`~/.claude/projects/-Users-viniciuscaetano-dev-nmforge/memory/` carrega automaticamente. Para contexto cross-project (migração AIOX pendente, brands do usuário, etc.), consultar memory de `~/`.
