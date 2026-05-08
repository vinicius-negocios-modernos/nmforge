# Step 02 — Interpretar saída

## Estrutura do output (modo humano)

```
[✓] skill-foo               OK
[!] skill-bar               2 warns
    R-OP47-02  warn: SKILL.md is 234 lines (limit: 200).
[✗] skill-baz               1 fail
    R-DET-10   fail: checklist.md missing.
```

## Algoritmo de interpretação

1. Conte fails: se > 0, prioridade absoluta — corrija antes de qualquer warn.
2. Para cada fail, mostre ao usuário:
   - ID da regra
   - Linha (se houver)
   - Sugestão de fix da tabela em SKILL.md §"Padrões comuns"
3. Para warns, agrupe por regra. Se a mesma regra aparece em 3+ skills, sinalize padrão sistêmico.

## Quando reportar exit 0 mas com warns

Diga: "Validação passou (X warns toleradas)." Liste warns como dívida técnica e pergunte se usuário quer abrir issue/task.
