# Tutorial 02 — Sua primeira skill em 10 minutos

> **Tempo estimado:** 10 minutos.
> **Pré-requisitos:** [Tutorial 01](01-getting-started.md) completo.
> **Você vai sair daqui com:** uma skill custom (`exemplo-saudacao`) escrita do zero, passando o validator strict.

Este é o tutorial flagship. Cobre: scaffold, edição de frontmatter, escrita de step, checklist, validação. Sem rodeios.

---

## Cenário

Você quer criar uma skill que cumprimente o usuário de forma personalizada, lendo o nome de um arquivo `docs/user-name.txt`. Simples mas exercita todas as partes.

## 1. Scaffold (1 min)

Use o CLI:

```bash
node packages/cli/bin/nmforge.js skill create exemplo-saudacao
```

Saída:

```
✓ Skill scaffolded at /Users/.../skills/exemplo-saudacao

Next steps:
  1. Edit skills/exemplo-saudacao/SKILL.md (frontmatter + overview)
  2. Edit skills/exemplo-saudacao/checklist.md (acceptance criteria)
  3. Run nmforge validate to confirm it passes
```

Estrutura criada:

```
skills/exemplo-saudacao/
├── SKILL.md
├── checklist.md
├── customize.toml
├── resources/
├── steps-c/01-todo.md
├── steps-e/01-assess.md
└── steps-v/01-evaluate.md
```

## 2. Editar SKILL.md (3 min)

Substitua o conteúdo do `SKILL.md` por:

```markdown
---
name: exemplo-saudacao
description: |
  Cumprimenta o usuário lendo o nome configurado em docs/user-name.txt.
  Use when: usuário pede saudação personalizada, abertura de sessão, ou demo de skill custom.

allowed-tools: Read, Bash
effort: low
token_budget: 600
phase: meta
persona-mode: minimal
language: pt-br
customize-keys:
  - greeting_template
  - fallback_name
---

# exemplo-saudacao

Skill mínima de demonstração: lê um nome de `docs/user-name.txt` e devolve uma saudação.

## Quando usar

- Demo de skill custom para alguém aprendendo NMforge.
- Abertura de sessão com toque pessoal.

## Procedimento

Ver [steps-c/01-greet.md](steps-c/01-greet.md).

## Customização

[customize.toml](customize.toml):

- `greeting_template`: template com `{name}` (default: `"Olá, {name}!"`)
- `fallback_name`: nome a usar se arquivo não existir (default: `"forjador"`)

## Critérios de sucesso

Ver [checklist.md](checklist.md).
```

**Pontos de atenção:**

- `name` casa com nome da pasta (R-DET-01).
- `description` contém `Use when:` (R-DET-02).
- `allowed-tools` lista apenas tools válidas (R-DET-03).
- Body curto. Token budget 600 ≈ até 2880 chars no body.

## 3. Escrever o step principal (2 min)

Renomeie `steps-c/01-todo.md` para `steps-c/01-greet.md` e substitua o conteúdo:

```bash
mv skills/exemplo-saudacao/steps-c/01-todo.md skills/exemplo-saudacao/steps-c/01-greet.md
```

Conteúdo de `steps-c/01-greet.md`:

```markdown
# Step 01 — Cumprimentar usuário

## Procedimento

1. Tente ler `docs/user-name.txt`:

   ```bash
   cat docs/user-name.txt 2>/dev/null
   ```

2. Se existir e não-vazio, use o conteúdo como `name`. Senão, use `fallback_name` do customize.toml.
3. Aplique o `greeting_template` substituindo `{name}`.
4. Imprima o resultado.

## Exemplo

Input (`docs/user-name.txt`): `Vinicius`
Template: `Olá, {name}!`
Output: `Olá, Vinicius!`
```

## 4. Atualizar checklist.md (1 min)

Substitua por:

```markdown
# Checklist — exemplo-saudacao

- [ ] Skill lê `docs/user-name.txt` quando presente
- [ ] Aplica `fallback_name` quando arquivo ausente
- [ ] Output respeita `greeting_template` do customize.toml
- [ ] Não modifica nenhum arquivo (só lê)
- [ ] Passa `nmforge validate --skill exemplo-saudacao`
```

## 5. Atualizar customize.toml (30s)

```toml
# Customization — exemplo-saudacao

[defaults]
greeting_template = "Olá, {name}!"
fallback_name = "forjador"
```

## 6. Validar (30s)

```bash
node packages/cli/bin/nmforge.js validate --skill exemplo-saudacao
```

Esperado:

```
[✓] exemplo-saudacao               OK

Summary: 1 OK, 0 warns, 0 fails.
Build: PASS.
```

Se aparecer algum fail, ver [troubleshooting](#troubleshooting) abaixo.

## 7. Rodar em strict (30s)

```bash
node packages/cli/bin/nmforge.js validate --skill exemplo-saudacao --strict
```

Mesmo resultado: 1 OK. Sua skill passa as 13 regras.

---

## Próximos passos

- Adicione um teste em `tests/` que descobre a skill e valida.
- Customize via `.nmforge/customize.toml` — ver [How-to: customizar sem fork](../how-to/customizar-sem-fork.md).
- Refine a skill: adicione `steps-e/01-update-name.md` para modo Edit.

## Troubleshooting

**R-DET-01 falha**: pasta e `name` no frontmatter precisam casar exatamente.

**R-DET-02 falha**: adicione `Use when:` ao `description`.

**R-OP47-06 falha** (token_budget excedido): aumente budget OU encolha o body. Mantenha proporcional ao conteúdo real.

**R-OP47-05 falha**: você usou alguma string proibida (`STAY IN CHARACTER`, `NO LYING`, `NO CHEATING`, `DO NOT skip steps`). Reescreva sem padrões BMAD-style.
