# Step 03 — Agregar e reportar

## Formato do relatório

```
NMforge doctor — relatório

== CLI checks ==
<output literal do CLI>

== Deep checks ==

[Modelos legados]
<lista path:line OU "none">

[Refs órfãs]
<lista skill -> ref OU "none">

[Anti-patterns]
<lista descrição + local OU "none">

== Resumo ==
- Info: N
- Warn: N
- Fail: N

Próxima ação sugerida: <fix mais crítico>
```

## Filtro por severity_threshold

Se `severity_threshold = "warn"`, oculte `info`. Se `= "fail"`, oculte `info` e `warn`.

## Pós-condição

Pergunte ao usuário se quer fix automático para os fails. Se sim, abra task no TaskCreate para cada um.
