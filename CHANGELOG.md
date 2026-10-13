# Changelog

## [0.2.0-alpha.0] — 2026-10-12

### Adicionado
- Perfil `agentskills` no validator (`--profile agentskills` no CLI, `profile` em `runValidation`): valida skills no padrão aberto Agent Skills, em que só `name` e `description` são obrigatórios. Regras novas:
  - R-AS-01: formato do `name` (1–64, minúsculas, dígitos e hífens; sem `claude`/`anthropic`).
  - R-AS-02: `description` com 10–1024 caracteres, sem tags XML, sem exigir "Use when:".
  - R-AS-03: `allowed-tools` opcional; aceita lista, string separada por espaço ou vírgula, `Bash(...)` e `mcp__*`; nome desconhecido gera warn.
- `Rule.profiles` e o tipo `Profile`; `PROFILES` e `parseAllowedTools` exportados.
- Testes do perfil (`packages/validator/tests/agentskills-profile.test.ts`), 145 no total.

### Alterado
- R-DET-02, R-DET-03 e R-DET-10 passam a rodar só no perfil `nmforge` (o padrão, sem mudança de comportamento para quem não usa `--profile`).
- Regra pedida com `--rule` roda em qualquer perfil.
- Perfil desconhecido sai com código 2.

### Licença
- Continua MIT. A partir desta versão o aviso de copyright inclui Negócios Modernos, mantendo a linha original.

### Segurança
- Dependências atualizadas: vitest 5, @vitest/coverage-v8 5, tsup, prettier, typescript-eslint, yaml 2.9 e smol-toml 1.9 (esta em produção, no `@nmforge/customize-resolver`).
- Overrides do pnpm para transitivas corrigidas (brace-expansion, js-yaml, vite, esbuild). `pnpm audit`: nenhuma vulnerabilidade.

## [0.1.0-alpha.0] — 2026-05-08

Primeira publicação no npm (`@nmforge/*`, tag `alpha`) e no GitHub.
