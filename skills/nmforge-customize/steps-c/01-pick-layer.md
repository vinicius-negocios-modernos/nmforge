# Step 01 — Escolher camada

## Decisão

Use `AskUserQuestion` com 3 opções:

- **team** — `<repo>/.nmforge/customize.toml` (commit, todos veem)
- **user** — `~/.config/nmforge/customize.toml` (preferência pessoal)
- **local** — `./customize.local.toml` (temporário, gitignored)

## Heurística

Se o usuário descreve a mudança como "padrão da equipe" / "todo mundo precisa" → sugerir **team** (Recomendado).

Se descreve como "no meu setup" / "para mim" → **user**.

Se "só pra esse experimento" / "no CI" → **local**.

## Output

Variável `target_path` resolvida.
