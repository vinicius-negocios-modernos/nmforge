---
name: nmforge-help
description: |
  Router meta-cognitivo do NMforge: lê o registry de skills, infere fase atual do trabalho, sugere próximo passo.
  Use when: usuário pergunta "o que faço agora?", "qual skill uso para X?", ou está perdido entre opções.

allowed-tools: Read, Bash, Glob, Grep, AskUserQuestion
effort: medium
token_budget: 1800
phase: meta
persona-mode: minimal
language: pt-br
customize-keys:
  - default_phase_filter
  - show_external_modules
subagent-pattern: none
---

# nmforge-help

Skill que ajuda o usuário a navegar o catálogo de skills sem ter que lê-las todas. Lê o registry derivado do filesystem (`skills/*/SKILL.md`, `modules/*/skills/*/SKILL.md`) e responde 3 tipos de pergunta:

1. **"Que skills existem?"** — lista organizada por fase.
2. **"Qual skill faz X?"** — match por descrição.
3. **"O que faço agora?"** — sugere próximo passo via grafo `preceded-by`/`followed-by`.

## Quando usar

Sempre que o usuário precisar de orientação sobre o que invocar. Esta é a "porta de entrada" recomendada para sessões novas.

## Algoritmo de discovery

1. `Glob skills/*/SKILL.md` + `Glob modules/*/skills/*/SKILL.md`.
2. Para cada match, `Read` o frontmatter (linhas até segundo `---`).
3. Construa registry em memória:
   ```
   { name, description, phase, preceded_by, followed_by, output_artifacts }
   ```
4. Indexe por `phase` e por palavras-chave do `description`.

## Modo "lista"

Output agrupado por fase:

```
== analysis ==
- nmforge-product-brief    — captura visão inicial

== planning ==
- nmforge-create-prd       — gera PRD a partir de brief

== meta ==
- nmforge-help             — você está aqui
- nmforge-validate         — audit das skills
- nmforge-customize        — configurar overrides
- nmforge-doctor           — health check
- nmforge-skill-create     — scaffold de skill nova
```

## Modo "match por descrição"

Usuário diz: "preciso documentar requisitos do projeto X".

1. Tokenize: `["documentar", "requisitos", "projeto"]`.
2. Score cada skill: contagem de tokens encontrados em `name` + `description`.
3. Top 3 são apresentados via `AskUserQuestion`.

## Modo "próximo passo"

Heurística baseada em artefatos:

1. Liste arquivos do projeto (`Glob docs/**/*.md`).
2. Para cada skill no registry, compare `required-artifacts` contra arquivos existentes.
3. Skills com 100% dos required presentes são "elegíveis".
4. Entre elegíveis, prefira aquelas cujo `output-artifacts` ainda não existe.
5. Se múltiplas elegíveis, agrupe por phase e sugira a mais "à esquerda" (analysis < planning < solutioning < implementation < meta).

## Customização

[customize.toml](customize.toml):

- `default_phase_filter`: lista de phases a mostrar (default: todas).
- `show_external_modules`: incluir `modules/*/skills/` no registry (default: true).

## Steps

- [steps-c/01-build-registry.md](steps-c/01-build-registry.md) — montar registry em memória
- [steps-c/02-route.md](steps-c/02-route.md) — escolher modo (lista / match / próximo)
- [steps-c/03-respond.md](steps-c/03-respond.md) — formatar resposta
- [steps-e/01-update-state.md](steps-e/01-update-state.md) — atualizar após skill executada
- [steps-v/01-evaluate.md](steps-v/01-evaluate.md) — checklist desta skill

## Critérios de sucesso

Ver [checklist.md](checklist.md).

## Referências

- DESIGN.md §3.1 — frontmatter com `preceded-by`/`followed-by`
- packages/validator/src/registry.ts — scaffolding do registry
- ADR-015 (DESIGN.md §2.3) — phase como eixo de organização
