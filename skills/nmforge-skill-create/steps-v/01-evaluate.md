# Step 01 — Modo Validate: avaliar checklist

## Procedimento

1. Leia [../checklist.md](../checklist.md).
2. Para cada item desmarcado, verifique se o critério é satisfeito.
3. Marque `[x]` se verdadeiro, `[!]` com motivo se falso.

## Comandos auxiliares

```bash
# Roda todas as regras na skill nova
node packages/cli/bin/nmforge.js validate --skill <name>

# Conta linhas (R-OP47-02 ≤ 200)
wc -l skills/<name>/SKILL.md

# Procura strings proibidas (R-OP47-05)
grep -E 'STAY IN CHARACTER|NO LYING|NO CHEATING|DO NOT skip steps' skills/<name>/SKILL.md
```

## Reporte final

Imprima resumo com:

- Total de itens do checklist
- Marcados / falhos / pendentes
- Sugestão da próxima ação (corrigir, expandir steps, ou marcar skill como pronta)
