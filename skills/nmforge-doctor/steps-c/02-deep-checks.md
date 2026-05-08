# Step 02 — Deep checks (paralelos)

## Estratégia

Spawn 3 subagents `Task(subagent_type="Explore")` numa única mensagem para paralelismo.

### Subagent A — modelos legados

Prompt: "Procure em `packages/` e `skills/` por strings de modelo legado: `claude-3-5`, `claude-sonnet-3`, `claude-opus-3`, `claude-instant`. Para cada match, retorne path:line e o contexto. Ignore arquivos `.md` em `docs/` (referência histórica é OK)."

### Subagent B — refs órfãs

Prompt: "Para cada SKILL.md em `skills/` e `modules/*/skills/`, extraia frontmatter `preceded-by` e `followed-by`. Construa registry de skills existentes. Reporte cada referência que não casa com nenhuma skill."

### Subagent C — anti-patterns

Prompt: "Procure violações de princípios da Constitution: subprocess Python em hooks (`spawn|exec.*python`); persona-mode obrigatório (`STAY IN CHARACTER`); strings hardcoded de modelo (P2). Path: `packages/hooks/` e `skills/`."

## Aggregation

Após receber resposta dos 3, consolide num único objeto:

```js
{
  legacy_models: [...],
  orphan_refs: [...],
  anti_patterns: [...],
}
```
