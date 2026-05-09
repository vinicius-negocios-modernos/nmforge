# Contributing — NMforge

Obrigado por considerar contribuir. NMforge é alpha local (v0.1, pré-publicação no npm). Contribuições são bem-vindas, com algumas regras curtas para manter qualidade.

---

## Quick start

```bash
git clone https://github.com/vinicius-negocios-modernos/nmforge.git ~/dev/nmforge
cd ~/dev/nmforge
pnpm install --frozen-lockfile
pnpm test         # esperado: 118/118 passing
pnpm lint
pnpm typecheck
```

Pré-requisitos:

- Node 20+
- pnpm 10+
- git

## Antes de abrir PR

- [ ] `pnpm test` passa (todas as suites verdes).
- [ ] `pnpm lint` clean.
- [ ] `pnpm typecheck` clean.
- [ ] `pnpm validate:strict` clean (todas as skills passam validator em strict).
- [ ] Commits seguem [Conventional Commits](https://www.conventionalcommits.org/).
- [ ] PR descreve **o quê** + **por quê**, não só **como**.

## Tipos de contribuição

### Skill nova

1. `node packages/cli/bin/nmforge.js skill create <nome>` (scaffold).
2. Edite frontmatter, body, checklist.md, steps.
3. `nmforge validate --skill <nome> --strict` deve passar.
4. Adicione teste em `tests/` cobrindo a skill.
5. PR com título `feat(skill): <nome> — <propósito curto>`.

Veja [Tutorial 02](docs/tutorials/02-sua-primeira-skill.md).

### Regra nova no validator

1. Implemente em `packages/validator/src/rules/r-<categoria>-<id>-<slug>.ts`.
2. Adicione teste unitário em `packages/validator/tests/`.
3. Atualize `docs/reference/validator-rules.md`.
4. Atualize `DESIGN.md §4` se for regra prevista no roadmap.
5. PR com título `feat(validator): <ID> — <descrição curta>`.

### Bug fix

1. Issue descrevendo o bug (ou referência inline no PR).
2. Teste que falha antes do fix, passa depois.
3. PR com título `fix(<escopo>): <descrição curta>`.

### Documentação

1. Doc nasce em PT-BR (ADR-013).
2. Encaixa em uma das 4 categorias Diataxis (ver [`docs/_STYLE_GUIDE.md`](docs/_STYLE_GUIDE.md)).
3. PR com título `docs(<categoria>): <descrição curta>`.

## Code style

- TypeScript strict (`tsconfig.base.json`).
- ESLint flat v9 (`eslint.config.js`).
- Prettier (`.prettierrc` implícito).
- ESM (Node 20+, `"type": "module"`).
- Sem subprocess Python (ADR-002, P1).

## Idioma

- **Código:** identifiers em inglês (`const skillRoot`, não `pastaDaSkill`).
- **Comentários:** PT-BR (consistente com docs).
- **Mensagens de commit:** PT-BR ou EN, escolha do autor.
- **Issues / PR descriptions:** PT-BR ou EN.
- **Docs:** PT-BR primary (ver `docs/_STYLE_GUIDE.md`).

## Convenção de commit

[Conventional Commits](https://www.conventionalcommits.org/):

- `feat(<escopo>):` nova funcionalidade
- `fix(<escopo>):` correção de bug
- `docs(<escopo>):` mudança de documentação
- `chore(<escopo>):` manutenção (CI, deps, etc.)
- `test(<escopo>):` adição/ajuste de teste
- `refactor(<escopo>):` mudança sem alterar comportamento

Escopos comuns: `validator`, `cli`, `hooks`, `customize-resolver`, `skill`, `docs`, `c`, `d` (fases).

Co-authoring com Claude é encorajado quando aplicável:

```
Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
```

## Branch strategy

- `main` — sempre verde (CI passa).
- Features em branches `feat/<descrição>`.
- Bug fixes em `fix/<descrição>`.
- PRs vão para `main` direto (até v1.0; depois introduzimos `release/*`).

## Discussão antes de PR grande

Para mudanças que afetam:

- Princípios da Constitution
- ADRs do DESIGN.md
- Spec do frontmatter
- Regras do validator (semântica)

Abra issue primeiro discutindo a abordagem. PR sem discussão prévia pode ser rejeitado.

## Code of Conduct

Ver [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md). Tldr: respeito mútuo, sem assédio, foco técnico.

## Licença

Ao abrir PR, você concorda em licenciar sua contribuição sob MIT (ver [`LICENSE`](LICENSE)).

---

*Dúvidas? Abra issue com label `question`.*
