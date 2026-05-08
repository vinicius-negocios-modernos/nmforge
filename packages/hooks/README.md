# @nmforge/hooks

Hooks do Claude Code 2.1.x para NMforge — todos em Node (sem Python).

## Hooks disponíveis (v0.1)

- **SessionStart** (`bin/session-start.cjs`) — detecta projeto NMforge e
  exporta env vars (`NMFORGE_PROJECT`, `NMFORGE_PROJECT_ROOT`, etc.) via
  `$CLAUDE_ENV_FILE`.
- **PreSkill** (`bin/pre-skill.cjs`) — quando Claude Code invoca a Skill tool,
  resolve `customize.toml` em 3 camadas e injeta o resultado como
  system-reminder. Apenas dispara para skills com prefixo `nmforge-`.

## Configurar no `.claude/settings.json`

```json
{
  "hooks": {
    "SessionStart": [
      { "matcher": "*", "hooks": [{ "type": "command", "command": "node ./node_modules/@nmforge/hooks/bin/session-start.cjs" }] }
    ],
    "PreToolUse": [
      { "matcher": "Skill", "hooks": [{ "type": "command", "command": "node ./node_modules/@nmforge/hooks/bin/pre-skill.cjs" }] }
    ]
  }
}
```

## Soft-fail policy

Hooks NUNCA bloqueiam o modelo no MVP. Erros vão para stderr e exit 0.
Razão: customização é "nice to have" — falha de hook não deve quebrar a sessão.

## License

MIT © Vinicius Caetano
