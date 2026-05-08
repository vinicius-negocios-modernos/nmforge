# Step 01 — Loop fix → validate

## Quando

Validador retornou fail. Você sabe a skill afetada. Vai aplicar correção e re-validar.

## Loop (máx 3 iterações)

```
para i = 1..3:
  1. Aplicar fix mais provável (Edit no SKILL.md ou criar arquivo faltante)
  2. Rodar: nmforge validate --skill <name>
  3. Se exit 0 → sair
  4. Se exit 1 → analisar, voltar ao passo 1
após 3 iterações sem sucesso → reportar ao usuário e pedir orientação
```

## Anti-pattern

NÃO desabilitar regra para "passar". Regras existem por princípio (CONSTITUTION.md). Se uma regra está errada, abra discussão; não suprima silenciosamente.
