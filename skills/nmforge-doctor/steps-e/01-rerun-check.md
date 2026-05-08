# Step 01 — Re-rodar check específico

## Quando

Usuário aplicou fix e quer confirmar que aquele item específico foi resolvido. Não vale re-rodar audit completo.

## Procedimento

1. Identifique qual check (legacy / orphan / anti-pattern).
2. Re-rode apenas o subagent correspondente do Step `steps-c/02-deep-checks.md`.
3. Compare antes/depois.
4. Se passou, atualize relatório local; se ainda não, sugira investigação.
