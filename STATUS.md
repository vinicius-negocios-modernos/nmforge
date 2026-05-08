# NMforge — STATUS

*Atualizado em: 2026-05-08 (após Fase C).*
*Mantenedor único: Vinicius Caetano.*
*Atualize este arquivo ao final de cada sessão de trabalho não-trivial.*

---

## Estado atual

| Item | Valor |
|---|---|
| Versão | `0.1.0` (não publicada — alpha local) |
| Branch ativo | `main` |
| Commits | 6 |
| Fases concluídas | A (founding docs), B (monorepo + 4 packages), B+ (8 regras hygiene), **C (5 skills core)** |
| Testes | **118/118 ✓** em 11 arquivos Vitest |
| Validator (skills core) | **5 OK / 0 warns / 0 fails** em modo strict |
| Cobertura threshold | 80% lines configurado (não medido ainda) |
| Lint / typecheck / build | clean ✓ |
| Repo público GitHub | **não** (decisão pendente) |
| npm publicado | **não** (nome `nmforge` + `@nmforge/core` reservados livres) |

## Componentes prontos

- ✅ `@nmforge/validator` — 13 regras (5 R-DET-* + 8 R-OP47-*) + loader recursivo + runner com strict mode
- ✅ `@nmforge/customize-resolver` — TOML 3 camadas + deep merge imutável
- ✅ `@nmforge/hooks` — SessionStart + PreSkill (Node CJS, soft-fail policy)
- ✅ `@nmforge/core` (CLI `nmforge`) — `install` (stub) / `validate` / `doctor` / `skill create`
- ✅ **5 skills core** em `skills/`:
  - `nmforge-skill-create` (paridade com CLI)
  - `nmforge-validate` (wrapper amigável)
  - `nmforge-customize` (guia interativo TOML)
  - `nmforge-doctor` (audit profundo, complementar ao CLI)
  - `nmforge-help` (router meta-cognitivo)

## Próximas ações (em ordem)

1. **[ ] Fase D** — documentação Diataxis em PT
   - Tutorial: "Sua primeira skill em 10 minutos"
   - How-to: customizar sem fork; ativar prompt cache 1h
   - Reference: frontmatter spec + 13 regras do validator
   - Estimativa: ~14h

2. **[ ] Fase E+F** — validation pré-release + publish
   - 1 dev externo testa tutorial
   - Cobertura ≥ 85% confirmada
   - CI matrix verde (macOS + Ubuntu × Node 20+22)
   - Reservar `@nmforge/core@0.1.0-alpha` no npm
   - Criar repo público GitHub
   - Estimativa: ~20h

## Decisões pendentes (precisam de você)

- **Quando publicar repo no GitHub?** Sob qual org/user? (`viniciuscaetano/nmforge`, `negociosmodernos/nmforge`, `nmforge-dev/core`)
- **Reservar `@nmforge/core@0.1.0-alpha` no npm agora?** (evita squat de nome; ~5 min)
- **Nome do canal Discord/Telegram BR community** (P6 — comunidade BR primary; meta v1.0 = 50+ membros em 6 meses)
- **Domínio:** confirmar `nmforge.com` (livre verificado em 2026-05-08) e comprar?

## Para retomar (próxima sessão)

```bash
cd ~/dev/nmforge
git log --oneline                          # timeline
pnpm install --frozen-lockfile              # caso node_modules tenha sumido
pnpm test                                   # confirma 118/118 verde
node packages/cli/bin/nmforge.js validate   # 5 skills core OK
node packages/cli/bin/nmforge.js doctor     # smoke test do CLI
```

Documentos canônicos para leitura inicial:
1. **Este arquivo** (STATUS.md) — estado atual
2. **CONSTITUTION.md** — 8 princípios, NÃO-negociáveis
3. **DESIGN.md Seção 15** — roadmap detalhado por fase

## Convenções desta sessão (resumo)

- ESM, Node 20+, pnpm workspaces
- TS strict, ESLint flat v9, Prettier, Vitest
- Commits Conventional (`feat(b+):`, `chore:`, etc.) com co-author Claude
- Sem `@eslint/js` (TypeScript-eslint cobre)
- `tsup` para build (ESM + .d.ts), `--clean` flag em todos
- Hooks Node-only (P1/ADR-002 banem subprocess Python)

---

*Para handoff entre sessões Claude: este arquivo + git log + auto-memory são suficientes. Não há cerimônia formal de handoff (P3/P8).*
