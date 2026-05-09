# NMforge — STATUS

*Atualizado em: 2026-05-08 (após Fase E parcial — 3/4 itens; peer review pendente de dev externo).*
*Mantenedor único: Vinicius Caetano.*
*Atualize este arquivo ao final de cada sessão de trabalho não-trivial.*

---

## Estado atual

| Item | Valor |
|---|---|
| Versão | `0.1.0` (não publicada — alpha local) |
| Branch ativo | `main` |
| Commits | 8 |
| Fases concluídas | A, B, B+, C, D, **E parcial (3/4 itens)** |
| Testes | **136/136 ✓** em 11 arquivos Vitest |
| Validator (skills core) | **5 OK / 0 warns / 0 fails** em modo strict |
| Cobertura medida | **97.05% lines / 100% functions / 88.69% branches** (alvo ≥85%) |
| Cobertura por área | CLI commands 100%, validator/src 95.34%, validator/rules 100% |
| Threshold no `vitest.config` | 85% lines / 85% functions / 80% branches |
| Lint / typecheck / build | clean ✓ |
| Repo público GitHub | decidido: `github.com/vinicius-negocios-modernos/nmforge` (push pendente) |
| npm publicado | **não** (decidido: stub `@nmforge/core@0.1.0-alpha.0` aguardando login) |
| Domínio | **`nmforge.com`** comprado ✓ |

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
- ✅ **Docs Diataxis** em `docs/` (~1.700 linhas, PT-BR primary):
  - 2 tutoriais (`01-getting-started`, `02-sua-primeira-skill`)
  - 2 how-tos (`customizar-sem-fork`, `ativar-prompt-cache-1h`)
  - 4 references (`frontmatter`, `validator-rules`, `cli`, `hooks`)
  - 2 explanations (`manifesto`, `opus-47-aware`)
  - `_STYLE_GUIDE.md` essencial
- ✅ **Comunidade**: `CONTRIBUTING.md` + `CODE_OF_CONDUCT.md` (Contributor Covenant 2.1)
- ✅ **CI matrix** em `.github/workflows/ci.yml`: lint, typecheck, test (Ubuntu+macOS × Node 20+22), validate strict, coverage (com threshold)
- ✅ **Peer-review protocol** em `docs/how-to/peer-review-tutorial.md`

## Próximas ações (em ordem)

1. **[ ] Fase E (item 25)** — 1 dev externo segue protocolo de peer review do tutorial. Bloqueado: precisa coordenar com pessoa.

2. **[ ] Fase F** — release
   - Reservar `@nmforge/core@0.1.0-alpha` no npm
   - Criar repo público GitHub (org/user a decidir)
   - Push + tag v0.1.0 + GitHub Release
   - Anúncio (r/ClaudeAI, Discord BR, LinkedIn)
   - Estimativa: ~6h (sem peer review feedback) / ~10h (com peer review feedback)

## Decisões executivas tomadas (2026-05-08)

- ✅ **GitHub host:** `vinicius-negocios-modernos/nmforge` (eponímico, modelo OSS pessoal). Migrar para org só se tração justificar.
- ✅ **npm:** reservar `@nmforge/core@0.1.0-alpha.0` como stub, aguardando `npm login` do usuário.
- ✅ **Domínio:** `nmforge.com` adquirido. Site Astro/Starlight fica para v0.2+.
- ⏸ **Canal comunidade BR:** decisão adiada para o release. Criar quando 5+ pessoas pedirem.

## Para retomar (próxima sessão)

```bash
cd ~/dev/nmforge
git log --oneline                          # timeline
pnpm install --frozen-lockfile              # caso node_modules tenha sumido
pnpm test                                   # confirma 136/136 verde
pnpm test:coverage                          # confirma ≥85% (atual: 97%)
node packages/cli/bin/nmforge.js validate   # 5 skills core OK
ls docs/                                    # 4 categorias Diataxis
cat .github/workflows/ci.yml                # CI matrix
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
