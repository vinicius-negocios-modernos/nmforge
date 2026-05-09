# Tutorial 01 — Primeiros passos com NMforge

> **Tempo estimado:** 5 minutos.
> **Pré-requisitos:** Node 20+, pnpm, git, Claude Code 2.1.x.
> **Você vai sair daqui com:** repositório clonado, dependências instaladas, validator rodando contra as 5 skills core.

Este tutorial te leva do `git clone` ao primeiro `nmforge validate` verde. Não cobre criação de skill — para isso, vá direto para o [Tutorial 02 — Sua primeira skill em 10 minutos](02-sua-primeira-skill.md).

---

## 1. Clonar o repositório

NMforge ainda não está publicado no npm (alpha local). Use git:

```bash
git clone https://github.com/vinicius-negocios-modernos/nmforge.git ~/dev/nmforge
cd ~/dev/nmforge
```

> **Nota:** push público pendente. Estado atual em [STATUS.md](../../STATUS.md).

## 2. Instalar dependências

```bash
pnpm install --frozen-lockfile
```

Esperado: ~30s, sem warnings críticos. Se você não tem `pnpm`:

```bash
npm install -g pnpm@10
```

## 3. Verificar saúde do projeto

Rode os 4 checks essenciais em sequência:

```bash
pnpm test         # Vitest — esperado: 118/118 passing
pnpm lint         # ESLint — esperado: clean
pnpm typecheck    # TypeScript — esperado: clean
pnpm build        # tsup — esperado: 4 packages built
```

Se algum falhar, abra issue (link em [CONTRIBUTING.md](../../CONTRIBUTING.md)).

## 4. Rodar o validator nas skills core

```bash
node packages/cli/bin/nmforge.js validate
```

Esperado:

```
[✓] nmforge-customize              OK
[✓] nmforge-doctor                 OK
[✓] nmforge-help                   OK
[✓] nmforge-skill-create           OK
[✓] nmforge-validate               OK

Summary: 5 OK, 0 warns, 0 fails.
Build: PASS.
```

5 skills, 13 regras (5 R-DET-* + 8 R-OP47-*). Zero violações.

## 5. Inspecionar uma skill

Abra `skills/nmforge-help/SKILL.md`. Note:

- Frontmatter YAML no topo (entre `---` ... `---`).
- Body em Markdown abaixo, ≤ 200 linhas.
- Pasta da skill contém: `checklist.md`, `customize.toml`, `steps-c/`, `steps-e/`, `steps-v/`.

Esse é o formato canônico que você vai replicar no Tutorial 02.

## 6. (Opcional) Modo strict

```bash
node packages/cli/bin/nmforge.js validate --strict
```

Em strict, **warns viram fails**. É o modo do CI. Esperado: ainda 5 OK.

---

## Próximos passos

- [Tutorial 02 — Sua primeira skill em 10 minutos](02-sua-primeira-skill.md) — flagship.
- [How-to: customizar sem fork](../how-to/customizar-sem-fork.md) — overrides TOML.
- [Reference: frontmatter](../reference/frontmatter.md) — todos os 12 campos.

## Troubleshooting

**`pnpm: command not found`** — instale: `npm install -g pnpm@10`.

**`Node 18 is not supported`** — atualize para Node 20+. Use `nvm`:

```bash
nvm install 20 && nvm use 20
```

**Validator falha em strict mas passa em normal** — alguma skill tem warn. Rode sem `--strict` para ver detalhes.
