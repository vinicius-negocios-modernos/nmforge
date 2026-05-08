# Step 03 — Scaffold da árvore de arquivos

## Implementação preferida

Use o CLI nativo (paridade garantida com a skill):

```bash
node packages/cli/bin/nmforge.js skill create <name> [--module <modulo>]
```

Se o CLI não estiver disponível no contexto, faça o scaffold manualmente:

## Manual (fallback)

Crie em paralelo (uma chamada `Bash` por mkdir, ou um único `mkdir -p` aninhado):

```bash
mkdir -p <target_dir>/steps-c
mkdir -p <target_dir>/steps-e
mkdir -p <target_dir>/steps-v
mkdir -p <target_dir>/resources
```

Depois escreva os arquivos via `Write` em paralelo:

- `<target_dir>/SKILL.md` — template em `packages/cli/src/commands/skill.ts:15`
- `<target_dir>/checklist.md` — template em `packages/cli/src/commands/skill.ts:41`
- `<target_dir>/customize.toml` — header `# Customization for <name>`
- `<target_dir>/steps-c/01-todo.md`
- `<target_dir>/steps-e/01-assess.md`
- `<target_dir>/steps-v/01-evaluate.md`

## Pós-condição

Rode imediatamente `node packages/cli/bin/nmforge.js validate --skill <name>` e reporte ao usuário.
