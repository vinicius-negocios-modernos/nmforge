# Reference — Hooks

*Hooks rodam em Node, sem subprocess Python. Política de soft-fail: erros não bloqueiam a sessão.*

---

## Sumário

| Hook | Disparo | Efeito principal |
|------|---------|------------------|
| `SessionStart` | Início da sessão | Detecta projeto NMforge, exporta env vars, emite reminder de boas-vindas. |
| `PreSkill` | Antes de invocar Skill tool | Resolve `customize.toml` em 3 camadas, injeta como system-reminder. |

Implementação: [`packages/hooks/src/`](../../packages/hooks/src/).

---

## SessionStart

### Sinais de detecção

Considera "projeto NMforge" se qualquer um for verdadeiro:

1. `_nmforge/` existe na raiz e tem ao menos uma entrada.
2. `.claude/skills/` contém skill com prefixo `nmforge-`.

### Saída

Se detectado, faz duas coisas:

**1. Exporta env vars** (via `CLAUDE_ENV_FILE`):

```
NMFORGE_PROJECT=true
NMFORGE_PROJECT_ROOT=<absolute path>
NMFORGE_SESSION_START=<ISO timestamp>
```

**2. Emite system-reminder:**

```markdown
# NMforge detected

Project root: `/path/to/project`

Use `/nmforge-help` to discover available skills.
```

### Soft-fail

Se a escrita em `CLAUDE_ENV_FILE` falhar, hook continua sem quebrar a sessão. Princípio P1: hooks são best-effort.

### Configuração

`.claude/settings.json`:

```json
{
  "hooks": {
    "SessionStart": "node ./node_modules/@nmforge/hooks/dist/session-start.js"
  }
}
```

---

## PreSkill

### Quando dispara

Em toda invocação de tool, mas só age quando `CLAUDE_TOOL_NAME === "Skill"`.

### Filtro de namespace

Só processa skills com prefixo:

- `nmforge-*` (core)
- `*-nmforge-*` (sub-namespace de módulos)

Skills externas passam sem modificação.

### Resolução de customize.toml

Para cada invocação de skill, resolve em ordem:

1. `<skillRoot>/customize.toml` — defaults da skill.
2. `<projectRoot>/_nmforge/team.toml` — overrides do time.
3. `<projectRoot>/_nmforge/user.toml` — overrides do usuário.

> **Nota v0.1:** o hook usa essa ordem. A camada `customize.local.toml` documentada na arquitetura completa (DESIGN §9) chega em v0.2.

### Saída

System-reminder Markdown com TOML resolvido:

```markdown
# NMforge — Customização resolvida para `nmforge-help`

```toml
[defaults]
default_phase_filter = []
show_external_modules = true
```

_Camadas aplicadas: 2_
```

Se nenhuma camada produzir conteúdo, hook não emite reminder.

### Env vars consumidas

| Var | Origem | Uso |
|-----|--------|-----|
| `CLAUDE_TOOL_NAME` | Claude Code | Filtra para `Skill`. |
| `CLAUDE_TOOL_INPUT` | Claude Code | JSON com `skill` ou `name`. |
| `CLAUDE_PROJECT_DIR` | Claude Code | Raiz do projeto para resolver paths. |

### Soft-fail

Erros de leitura, parse TOML, ou skill não encontrada vão para `result.errors[]` e o hook continua. Reminder ainda é emitido com nota dos erros para o modelo decidir.

### Configuração

`.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": "node ./node_modules/@nmforge/hooks/dist/pre-skill.js"
  }
}
```

---

## Política de hooks (CONSTITUTION P1, P7)

- **Native-first:** sempre que possível, usar hooks nativos do Claude Code 2.1.x.
- **Node-only:** banido subprocess Python (ADR-002). Hooks são `.js` ESM ou CJS.
- **Soft-fail:** falha do hook nunca bloqueia o modelo.
- **Idempotente:** mesma input deve produzir mesmo reminder; sem side effects fora de stdout/env file.

## Testes

`packages/hooks/tests/`:

- `session-start.test.ts` — 4 testes (detecção + env vars).
- `pre-skill.test.ts` — 7 testes (parse, resolve, soft-fail).

Total: 11 testes do pacote hooks. Inclusos no `pnpm test`.

## Ver também

- [Reference: customize.toml](customize-toml.md) (em breve)
- [How-to: customizar sem fork](../how-to/customizar-sem-fork.md)
- [DESIGN.md §10](../../DESIGN.md) — racional dos hooks.
