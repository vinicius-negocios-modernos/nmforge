# Style Guide — Documentação NMforge

*Versão: 0.1 (PT-BR primary).*
*Aplica-se a todo conteúdo sob `docs/`.*

---

## Estrutura Diataxis

Cada doc pertence a **uma** das 4 categorias. Se não cabe em nenhuma, repense — provavelmente é dois docs separados.

| Categoria | Pergunta que responde | Exemplo |
|-----------|----------------------|---------|
| **Tutorial** | "Como aprendo?" | `01-getting-started.md` |
| **How-to** | "Como resolvo X?" | `customizar-sem-fork.md` |
| **Reference** | "Como funciona Y?" | `validator-rules.md` |
| **Explanation** | "Por que existe?" | `manifesto.md` |

Mais sobre Diataxis: <https://diataxis.fr>.

## Header budget

- Máximo **8-12 `##`** por documento. Se passar, splite.
- Nível 4 (`####`) é raro — preferia restruturar.
- Título único `#` no topo.

## Vocabulário canônico

Termos com forma única. Outros banidos.

| Use | Não use | Por quê |
|-----|---------|---------|
| skill | agent (em geral) | "agent" é genérico demais — usar só quando for SDK/agente externo |
| module | expansion pack | terminologia npm-native |
| hook | plugin | "hook" é nome usado pelo Claude Code 2.1.x |
| frontmatter | metadata header | termo padrão de Markdown/YAML |
| customize.toml | config / settings | nomeação consistente |
| persona-mode: minimal | "stay in character" | banido por R-OP47-05 |

## Examples-first

Sempre que possível, **exemplo de código antes de prosa**.

✅ Bom:

```yaml
allowed-tools: Read, Write, Edit
```

Cada item dessa lista é uma tool name nativa do Claude Code 2.1.x. O hook PreSkill aplica como `permissions.allow` na sessão.

❌ Ruim:

A lista `allowed-tools` define quais tools nativas são permitidas durante a execução da skill, sendo aplicada pelo hook PreSkill como `permissions.allow` na sessão. Exemplo: `allowed-tools: Read, Write, Edit`.

## No-emoji-in-prompts

- **UI / READMEs / commit messages** podem usar emoji com moderação.
- **Prompts** (SKILL.md, steps, hooks) — NÃO usar emoji. Eles consomem token e empoeram o thinking.

## Linkagem cruzada

Todo termo técnico mencionado em uma doc deve ter link para a referência canônica:

- Primeira menção em cada doc: link.
- Menções subsequentes: opcional.
- Use caminho relativo, não absoluto.

## Idioma

- **Doc nasce em PT-BR.**
- EN é tradução secundária (ver ADR-013 em `DESIGN.md`).
- Misturar PT/EN no mesmo doc é warn (R-INF-06).
- Termos técnicos em inglês ficam em inglês: `frontmatter`, `hook`, `subagent`, `prompt cache`.

## Tom

- Direto. Curto. Sem hype.
- Segunda pessoa: "você" (não "o usuário").
- Imperativo nos passos: "Crie", "Rode", "Edite".
- Banidos: "simplesmente", "apenas", "obviamente" (assumem conhecimento que o leitor pode não ter).

## Formatação

- Code blocks com linguagem declarada: ` ```bash ` , ` ```yaml `, ` ```toml `.
- Tabelas para comparação ≥ 3 colunas; senão, lista.
- Citações de arquivos do repo: ``[`packages/cli/src/index.ts`](../../packages/cli/src/index.ts)``.
- Citações de linha: `path:line` (ex.: `packages/cli/src/index.ts:32`).

## Validação

Antes de mergir doc nova:

1. Rodar `pnpm format:check` (Prettier).
2. Verificar que cada `[link](path)` resolve.
3. Spell check rápido (PT-BR).
4. Conferir que se encaixa em **uma** categoria Diataxis.
