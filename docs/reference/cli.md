# Reference — CLI `nmforge`

*Comandos disponíveis em v0.1. Binário: `packages/cli/bin/nmforge.js`.*

---

## Invocação

Pré-publicação no npm, use:

```bash
node packages/cli/bin/nmforge.js <comando> [opções]
```

Após publish (Fase F), `npx nmforge <comando>` ou `nmforge <comando>` (instalação global).

## `nmforge install`

*Status v0.1: stub. Implementação completa em v0.2.*

Configura NMforge no projeto atual (cria `_nmforge/`, popula `.claude/settings.json`, registra hooks).

```bash
node packages/cli/bin/nmforge.js install [--cwd <path>] [--modules <list>] [--yes]
```

| Flag | Tipo | Descrição |
|------|------|-----------|
| `--cwd` | path | Diretório alvo (default: `process.cwd()`). |
| `--modules` | CSV | Módulos externos a instalar junto. |
| `--yes` | bool | Modo não-interativo (CI). |

## `nmforge validate`

Roda validator em todas as skills do projeto (descoberta recursiva por `SKILL.md`).

```bash
node packages/cli/bin/nmforge.js validate [opções]
```

| Flag | Tipo | Descrição |
|------|------|-----------|
| `--cwd` | path | Diretório raiz para descoberta. |
| `--strict` | bool | Warns viram fails (CI). |
| `--skill <name>` | string | Filtra para uma única skill. |
| `--rule <id>` | string | Roda apenas uma regra (ex.: `R-OP47-05`). |
| `--json` | bool | Saída JSON para parsing. |

**Exit codes:**

- `0` — todas passam (warns toleradas em modo normal).
- `1` — pelo menos uma fail OU warn em modo strict.

**Exemplo de saída humana:**

```
[✓] nmforge-help                   OK
[!] custom-skill                   1 warn
    R-OP47-02  warn: SKILL.md is 234 lines (limit: 200).

Summary: 1 OK, 1 warns, 0 fails.
Build: PASS.
```

**Exemplo de saída JSON:**

```json
{
  "skills": [
    {
      "skill": "nmforge-help",
      "skillRoot": "/abs/path/skills/nmforge-help",
      "violations": [],
      "passed": true
    }
  ],
  "passed": true
}
```

## `nmforge doctor`

Auditoria leve do projeto: checa presença de `_nmforge/`, `.claude/settings.json`, prompt cache 1h, skills descobertas.

```bash
node packages/cli/bin/nmforge.js doctor [opções]
```

| Flag | Tipo | Descrição |
|------|------|-----------|
| `--cwd` | path | Diretório alvo. |
| `--verbose` | bool | Detalhe extra. |

**Exemplo de saída:**

```
NMforge doctor — auditoria de /path/to/project

[✓] _nmforge/ directory                  present
[!] .claude/ directory                   absent (Claude Code project not initialized?)
[i] Skills discovered                    5 skill(s) found

1 warning(s).
```

Para audit mais profundo (anti-patterns, modelos legados, refs órfãs), use a [skill `nmforge-doctor`](../../skills/nmforge-doctor/SKILL.md) que complementa o CLI.

## `nmforge skill create <name>`

Cria scaffolding completo de uma nova skill.

```bash
node packages/cli/bin/nmforge.js skill create <name> [opções]
```

| Flag | Tipo | Descrição |
|------|------|-----------|
| `--cwd` | path | Diretório raiz. |
| `--module <nome>` | string | Coloca em `modules/<nome>/skills/` em vez de `skills/`. |

**Estrutura criada:**

```
<target>/<name>/
├── SKILL.md              # frontmatter mínimo + body TODO
├── checklist.md          # critérios placeholder
├── customize.toml
├── steps-c/01-todo.md
├── steps-e/01-assess.md
├── steps-v/01-evaluate.md
└── resources/
```

Após scaffold, edite o frontmatter e rode `nmforge validate --skill <name>`.

## Flags globais

Todos os comandos aceitam:

| Flag | Descrição |
|------|-----------|
| `--help` / `-h` | Help do comando ou subcomando. |
| `--version` / `-V` | Versão do `@nmforge/core`. |

## Variáveis de ambiente respeitadas

| Var | Lida por | Efeito |
|-----|----------|--------|
| `CLAUDE_PROJECT_DIR` | doctor | Override de `--cwd` quando rodando dentro do Claude Code. |
| `NMFORGE_DEBUG` | todos | `1` ativa stack traces completos em erros. |

## Ver também

- [Reference: frontmatter](frontmatter.md)
- [Reference: validator-rules](validator-rules.md)
- [Reference: hooks](hooks.md)
- [DESIGN.md §11](../../DESIGN.md)
