# Step 01 — Executar validator

## Decisão

Antes de rodar, confirme escopo:

- Sem argumento → todas as skills
- Com `<name>` específico → `--skill <name>`
- Em CI / pré-release → `--strict`

## Comando

```bash
node packages/cli/bin/nmforge.js validate [--skill <name>] [--strict]
```

Capture exit code:

- `0` → nada bloqueia (warns podem existir)
- `1` → ao menos um fail OU warn em strict

## Próximo passo

Vá para [02-interpret.md](02-interpret.md) com a saída em mãos.
