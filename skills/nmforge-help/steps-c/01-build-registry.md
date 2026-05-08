# Step 01 — Construir registry em memória

## Discovery (paralelo)

Execute em paralelo numa única mensagem:

```
Glob skills/*/SKILL.md
Glob modules/*/skills/*/SKILL.md   (se show_external_modules)
```

## Parse de cada SKILL.md

Para cada path retornado:

1. `Read` apenas as primeiras ~50 linhas (frontmatter + começo do body).
2. Extraia bloco entre `---` e `---`.
3. Parse YAML mental para coletar:
   - `name`
   - `description` (primeira linha + linha de "Use when:")
   - `phase`
   - `preceded-by` (lista)
   - `followed-by` (lista)
   - `required-artifacts`, `output-artifacts` (lista)

## Estrutura final

```js
const registry = {
  byName: { [name]: skillInfo },
  byPhase: { analysis: [...], planning: [...], ... },
  all: [skillInfo],
};
```

Mantenha em memória para uso pelos próximos steps.
