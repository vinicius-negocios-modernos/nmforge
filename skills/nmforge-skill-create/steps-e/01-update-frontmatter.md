# Step 01 — Modo Edit: atualizar frontmatter

## Quando usar este modo

Skill já existe. Usuário quer ajustar `allowed-tools`, `phase`, `token_budget`, ou outra chave do frontmatter.

## Procedimento

1. Leia `<target_dir>/SKILL.md` (Read).
2. Identifique seção `---` ... `---` no topo.
3. Use `Edit` com `old_string` específico — preserve indentação YAML.
4. NÃO renomeie a skill por aqui (a chave `name` deve casar com basename do dir; renomear exige `mv`).

## Validação

Depois de cada edit, rode:

```bash
node packages/cli/bin/nmforge.js validate --skill <name>
```

Se aparecer fail novo, reverta com `git checkout <path>` e refaça.
