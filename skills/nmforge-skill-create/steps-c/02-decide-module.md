# Step 02 — Decidir destino (skills/ vs modules/)

## Heurística

- Se o nome começa com `nmforge-` → `skills/` (core).
- Se começa com prefixo de módulo conhecido (`wds-`, `xpv-`, etc.) → `modules/<modulo>/skills/`.
- Caso ambíguo → pergunte ao usuário com `AskUserQuestion`:
  - Opção A: `skills/<name>/` (core do projeto)
  - Opção B: `modules/<modulo>/skills/<name>/` (extensão modular)

## Pré-condição

Diretório alvo NÃO deve existir. Verifique com `Bash test -d <target_dir>`.

## Output

`target_dir` absoluto, pronto para Step 03.
