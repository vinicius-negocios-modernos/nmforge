# Step 03 — Formatar e responder

## Modo `list`

Agrupe por phase, ordem: analysis → planning → solutioning → implementation → meta.

```
== <phase> ==
- <name>            — <primeira frase do description>
```

## Modo `match`

1. Tokenize a query do usuário (lowercase, remova stopwords PT comuns).
2. Para cada skill, score = #tokens em `name` + 2 × #tokens em `description`.
3. Top 3 com score > 0:

```
Encontrei 3 candidatos:
1. <name>  (score N)  — <description curta>
2. ...
3. ...
```

Se 0 matches: sugira modo `list`.

## Modo `next`

```
Estado atual:
- Artefatos presentes: docs/brief.md, docs/prd.md
- Última fase identificada: planning

Próxima skill recomendada: nmforge-create-architecture
- Razão: brief + prd já existem, architecture é a saída esperada.
- Comando: usar Skill tool com nome `nmforge-create-architecture`
```
