# Step 01 — Coletar e validar nome

## Input esperado

Usuário fornece (ou você infere do contexto):

- `name`: identificador kebab-case da skill (ex.: `nmforge-create-prd`)
- `module` (opcional): módulo de destino (ex.: `analysis`)

## Validações

1. **Formato**: regex `^[a-z][a-z0-9-]+[a-z0-9]$`. Sem espaços, sem maiúsculas, sem underscore.
2. **Prefixo**: convenção `<modulo>-<verbo>` (ex.: `nmforge-help`, `wds-extract`).
3. **Conflito**: rode `Glob skills/<name>/SKILL.md` e `Glob modules/*/skills/<name>/SKILL.md` em paralelo. Se algum match, pare e oriente edição.

## Output

Variáveis confirmadas: `name`, `module` (ou null), `target_dir`.

```
target_dir = module
  ? "modules/<module>/skills/<name>"
  : "<skills_root>/<name>"
```

`skills_root` vem do customize.toml (default: `skills`).
