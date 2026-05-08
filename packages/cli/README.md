# @nmforge/core

CLI principal do NMforge — `nmforge install`, `validate`, `doctor`, `skill create`.

## Instalação

```bash
npx @nmforge/core install
# ou local
pnpm add -D @nmforge/core
```

## Comandos (v0.1)

| Comando | O que faz |
|---|---|
| `nmforge install` | Stub MVP (full installer em v0.2) |
| `nmforge validate [--strict] [--skill <name>] [--rule <id>] [--json]` | Roda validator (5 regras MVP) |
| `nmforge doctor [--verbose]` | Audita projeto: marcadores NMforge, settings, prompt cache 1h |
| `nmforge skill create <name> [--module <name>]` | Scaffold de nova skill (SKILL.md + checklist + steps-c/e/v) |

## Exit codes

- `0` — passou
- `1` — validação falhou (modo `validate`)

## License

MIT © Vinicius Caetano
