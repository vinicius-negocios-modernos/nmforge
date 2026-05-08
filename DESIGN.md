# NMforge — Design Document
*Versão: 0.1 (draft)*
*Data: 2026-05-08*
*Autor: Vinicius Caetano*
*Co-design: Claude Opus 4.7 (1M context)*

> **Status do documento:** Draft fundador v0.1, commit inicial em 2026-05-08.
>
> **Decisão de nome (final):** **NMforge** (NM = Negócios Modernos + forge). npm: `nmforge` + `@nmforge/core`. Domínio principal: `nmforge.com` (também .io / .ai / .build / .co disponíveis).
> A Seção 0 deste documento mantém o histórico do processo de naming (5 candidatos avaliados antes da decisão por NMforge, que entrou via brainstorm complementar).
>
> **Insumos de discovery (citados ao longo, em `~/research/analises/`):**
> - `aiox-opus47.md` — análise AIOX v5.1.15 (491 linhas, 27 findings)
> - `aiox-impacto-projetos.md` — mapeamento dos 16 projetos do usuário
> - `bmad-analise.md` — análise BMAD v6.6.0 + claude-code-bmad-skills + TEA + WDS (734 linhas)

---

## 0. Naming Proposal

**Critérios:** ≤8 chars idealmente; pronunciável BR+EN; sem conflito ativo no npm com framework de IA/dev tools; evocativo de "orquestração leve, agentes, modelo nativo"; domínio `.dev` ou `.ai` disponível idealmente.

> Os 5 candidatos abaixo precisam ser **verificados manualmente** com `npm view <nome>` antes da decisão final. As notas de "disponibilidade" são inferências educadas, não confirmações.

### 0.1 Cinco candidatos

| # | Nome | Origem & Significado | Tagline PT | Tagline EN | Domínio sugerido |
|---|------|----------------------|------------|------------|-------------------|
| 1 | **Synkra** | Brand pessoal já existente (`synkra` → "synchronized + agora"). Cunhado pelo usuário. | "Agentes em sincronia para Claude Code." | "Agents in sync for Claude Code." | `synkra.dev` |
| 2 | **Forja** | PT-BR puro: lugar onde se forja. Curto, identificável, evoca craft + manufatura técnica. Em EN funciona como "forge" (já tomado em vários nichos, mas "forja" não). | "A forja para agentes de IA." | "Forge AI agents that work for you." | `forja.dev` |
| 3 | **Conduit** | EN: canal/condutor — entre desenvolvedor e modelo. Conota fluxo, não controle. 7 chars. Pronuncia BR aceitável ("con-DU-it"). | "O canal entre você e o modelo." | "The conduit between you and the model." | `conduit.dev` (provavelmente tomado, alternativa: `conduit.ai`) |
| 4 | **NMforge** | Latim: pátio central de casa romana — onde tudo conflui. Metáfora arquitetural perfeita para "core + módulos". 6 chars. Pronuncia idêntica BR+EN. | "Onde seus agentes se encontram." | "Where your agents convene." | `nmforge.com` |
| 5 | **Skein** | EN: novelo de fio — múltiplas threads (agentes, contextos) que se entrelaçam sem nó. 5 chars. Sonoro e raro. Pronuncia BR exige ensino ("skein"). | "Múltiplos agentes, um único fio." | "Many agents, one thread." | `skein.dev` |

### 0.2 Pros/contras

| Nome | Pros | Contras |
|------|------|---------|
| **Synkra** | Brand já reconhecido pelo usuário; coerência com projetos existentes; sugestivo (sync + skra). | Já usado pelo usuário em outros contextos (AIOX é "Synkra AIOX") — reuso pode confundir/canibalizar. Soa "vendor"; menos universal para OSS. |
| **Forja** | Português puro, autêntico BR; evoca craft/quality; combina com pilar "test-first como gate". | Difícil para audiência EN (não traduz literal); "Forge" tomado em N projetos. |
| **Conduit** | Semântica forte (canal, não orquestrador externo — alinha com tese do BMAD "engine roda no LLM"); pronuncia ok. | Provavelmente tomado em npm/GitHub; sem ressonância BR. |
| **NMforge** | Metáfora arquitetural elegante; pronuncia única BR+EN; remete a calma/centro vs "command center" militar. | Termo já usado em CMS (NMforge do Liferay) e arquitetura — pode haver ruído de busca. |
| **Skein** | Original, raro, memorável; metáfora "fios entrelaçados" descreve perfeitamente multi-agente. | Difícil pronúncia BR; pode soar arbitrário até a tagline ser interiorizada. |

### 0.3 Recomendação

**Recomendação: `NMforge`** (com `Synkra` como segundo lugar forte).

**Justificativa:**
- A metáfora do *atrium* (pátio central romano) descreve com precisão a arquitetura proposta: **core mínimo no centro** + **módulos externos como galerias** que conectam ao centro. É um modelo mental que vende a arquitetura sem precisar de slides.
- 6 caracteres, foneticamente idêntico em PT e EN (ambos /a.tri.um/).
- Não carrega bagagem de "agente militar" / "orquestrador" / "comando" — alinha com posicionamento "não é meu cérebro, é meu cinto de utilidade" (lição D6.15 do bmad-analise.md, l.617).
- `Synkra` carrega o lastro positivo do brand pessoal, mas reutilizá-lo no framework arrisca diluir o brand do usuário e amarrar o framework à pessoa. Para projeto OSS público com ambição BMAD-killer, **distância entre brand pessoal e brand do projeto é saudável** (BMAD não é "Madison's Method"; é BMAD).

**Plano de verificação antes de adotar:**
```bash
npm view nmforge                  # verificar se existe pacote
npm view @nmforge/core            # alternativa scoped
gh search repos "nmforge"         # verificar overlap
whois nmforge.com nmforge.ai       # disponibilidade de domínio
```

> **Para o resto deste documento, o nome será referido como `[FRAMEWORK]` ou `nmforge` (placeholder). Após decisão do usuário, search-replace no commit final.**

---

## 1. Manifesto / Tese

### 1.1 Por que existir

**O problema real:**

O ecossistema de frameworks de "AI-driven dev" para Claude Code está dominado por duas linhagens:

1. **BMAD-METHOD** (v6.6.0, 46.6K stars) — referência da indústria, mas **construído na era Claude Code 1.x**: zero uso de prompt cache 1h, zero deferred tools, zero hooks que consomem `$CLAUDE_EFFORT`, zero `Plan`/`Explore` subagents nativos (`bmad-analise.md:240-251` — D2.9). Carrega 297 ocorrências de `CRITICAL:` em `src/` (`bmad-analise.md:178`) e workflows de 485-1.512 linhas que competem com o thinking nativo do Opus 4.7. **Anti-padrão documentado** para 4.x.

2. **AIOX/AIOS** (linhagem que herda o BMAD pré-v6 com namespace renomeado — `aiox-opus47.md:236-242`, D3.1) — congelou a arquitetura BMAD pré-v6 e adicionou camadas próprias (Constitution, IDS, SYNAPSE), mas **sem refatorar a base**. 4 cópias de cada agente (`aiox-opus47.md:165-174`), modelos hardcoded para `claude-3-5-sonnet` (`aiox-opus47.md:88-92`, D1.2), DeepSeek silenciosamente roteado em 3 projetos do usuário (`aiox-impacto-projetos.md:144-156`).

A **terceira via** — `claude-code-bmad-skills` (aj-geddes, 418 stars) — descartou tanto o estilo BMAD pré-v6 quanto BMAD v6, escrevendo skills funcionais sem persona, com hooks usando `$CLAUDE_*` env vars (`bmad-analise.md:418-425`). É a referência mais próxima do que precisamos, mas **para curto** (`bmad-analise.md:450-453`): só 9 skills, sem skill-validator, sem TOML customization, sem módulos externos npm, claim de "70-85% redução de tokens" sem benchmark publicado, e arquivos `resources/*.md` de 1.599 linhas que anulam a economia se carregados.

**Por que BMAD não basta:**
- 297 `CRITICAL:` + 185 `MUST` + workflows de 1.512 linhas + activation ritual idêntico em 8 steps com subprocess Python obrigatório (`bmad-analise.md:195-209`, D2.3-D2.4).
- Zero uso de features Claude Code 2.1.x (`bmad-analise.md:240-251`, D2.9).
- Persona-overhead obrigatório ("Greet by name, lead with icon, do not break character") — tokens caros que o usuário paga sempre (`bmad-analise.md:226-232`, D2.7).
- Para nosso target (devs técnicos intensivos em Claude Code), persona é fricção.

**Por que AIOX não basta:**
- Quádrupla cópia dos agentes (`aiox-opus47.md:165-174`, D2.1).
- Activation prompts gigantes com chain-of-thought hardcoded (`aiox-opus47.md:114-118`, D1.5) — "competem com o thinking nativo do 4.7".
- DeepSeek redirect ATIVO em 3 projetos (`aiox-impacto-projetos.md:144-156`).
- Modelo `claude-3-5-sonnet` como default em 12+ projetos (`aiox-impacto-projetos.md:121-134`).
- Verdict da análise: "MAL CALIBRADO para Opus 4.7" (`aiox-opus47.md:26-28`).

**Por que claude-code-bmad-skills não basta (variante mais próxima):**
- Sem skill-validator → não escala como framework público.
- Sem módulos externos npm → tudo em monorepo, segue o pior padrão do AIOX.
- Sem customization TOML → não permite override sem fork.
- Sem help/router → "qual skill chamar?" continua sem resposta.
- Resources de 1.599 linhas — anulam a economia.
- Pasta `bmad-v6/` legacy ainda no repo — confunde.
- Cross-platform installer em Bash + PowerShell (não Node) — fricção pra Node-first.
- 418 stars, sem mantenedor full-time aparente — risco de bus factor.

**Síntese:** ninguém é **Claude Code 2.1.x-native**, ninguém é **Opus 4.7-aware** desde dia 1, ninguém combina **arquitetura modular real (BMAD v6) + skills funcionais (claude-code-bmad-skills) + validator determinístico + 4.7 hygiene** num só framework.

### 1.2 Para quem é

**Persona primária — "Solo Power Dev BR":**
- Dev sênior, técnico, intensivo em Claude Code (>10 sessões/semana).
- Trabalha em múltiplos projetos paralelos (~5-20 repos ativos).
- Pragmático: quer ferramenta que acelere, não metodologia que obrigue rituais.
- Já testou BMAD/AIOS/AIOX e percebeu que algo está errado mas não sabe o quê.
- Prefere docs em PT-BR, código/prompts em EN.
- **Exemplo canônico:** Vinicius Caetano (autor).

**Persona secundária — "Tech Lead opinativo (BR/EN):**
- Lidera time pequeno (3-8 devs).
- Quer padronizar uso de Claude Code no time sem impor BMAD inteiro.
- Precisa de skills auditáveis (validator + CI) e customizáveis por projeto.
- Aceita configurar uma vez, usar muitas — quer ROI mensurável.

**Quem NÃO é o target (anti-persona):**
- Quem busca "metodologia ágil completa pronta" (vai gostar mais de BMAD).
- Quem ama personas RP-style ("Greet me, Mary!") — nosso default é minimal.
- Quem não usa Claude Code (multi-IDE é roadmap pós-MVP).
- Quem programa só ocasionalmente — overhead de instalação não compensa.
- Quem não quer abrir mão de Python (nosso pré-req é Node 20+ apenas).

### 1.3 Posicionamento

**Tagline:** *"Onde seus agentes se encontram."* (PT) / *"Where your agents convene."* (EN)

**Elevator pitch (3 frases):**
> [FRAMEWORK] é um framework Node-nativo de orquestração de agentes para Claude Code 2.1.x, otimizado para Opus 4.7. Combina a arquitetura modular do BMAD v6 (skills auto-contidas + validator + módulos externos npm) com skills funcionais sem persona-overhead e features 2.1.x ativadas por padrão (prompt cache 1h, deferred tools, hooks effort-aware, Plan/Explore subagents). Não tenta ser seu cérebro — é seu cinto de utilidade.

**Diferenciação vs BMAD vs AIOX vs claude-code-bmad-skills:**

| Dimensão | [FRAMEWORK] (proposta) | BMAD v6.6 | AIOX 5.1 | CC-BMAD-skills |
|----------|------------------------|-----------|----------|----------------|
| Modelo hardcoded | **Nunca** (env var) | Nunca | claude-3-5-sonnet | Datado mas não hardcoded |
| Persona obrigatória | **Não** (opt-in) | Sim | Sim | Não |
| Activation ritual | **Hook nativo** (Node) | 8 steps + Python | 5 steps embedded YAML | Sem ritual |
| Subprocess Python | **Nunca** | Toda ativação | Não | Não |
| Skill-validator | **Sim** (15-20 regras + Opus 4.7 hygiene) | Sim (19 regras) | Não | Não |
| Customization camadas | **TOML 3 camadas** (shipped/team/user) | TOML 4 camadas | YAML embedded | Sem |
| Módulos externos npm | **Sim (dia 1)** | Sim | Não (monorepo) | Não |
| Help router | **Sim** (skill `[framework]-help`) | Sim (`bmad-help`) | Não | Não |
| Tri-modal step files (C/E/V) | **Sim** (do TEA) | Parcial | Não | Não |
| Prompt cache 1h | **Default ON** | Não documentado | Não | Não |
| Deferred tools | **First-class** | Não | "indisponível" (errado) | Não |
| Hooks usam `$CLAUDE_*` env vars | **Sim** (todos) | Não | Parcial | **Sim (3 hooks)** |
| `allowed-tools` no frontmatter | **Sim (regra do validator)** | Não | Não | Sim |
| `effort` no frontmatter | **Sim** (hooks reagem) | Não | Não | Não |
| `token_budget` no frontmatter | **Sim** (validator quebra se exceder) | Não | Não | Não |
| Test-first como gate | **Sim** (lição TEA) | Parcial | Parcial | Não |
| Diataxis docs + style guide | **Sim** | Sim | Não | Parcial |
| i18n docs | **PT primary, EN secondary** | EN primary, 5 idiomas | Mistura | EN |
| Marketplace de extensions | **Roadmap dia 30** | "Coming" há 2 anos | Não | Não |
| License | MIT | MIT | (privado/OSS) | MIT |

### 1.4 Princípios fundadores (Constitution v0.1)

> 8 princípios não-negociáveis. Inspirados em D6 do `bmad-analise.md` (l.527-617) e na Constitution AIOX (mas drasticamente mais curta — banimos o estilo "297 CRITICAL"). Cada princípio é uma frase + 1 parágrafo de contexto + 1 critério de violação.

**P1 — Native-first, custom-only-when-needed.**
Features do Claude Code (Skill tool, Plan/Explore, deferred tools, prompt cache, hooks env vars) são default. Implementação custom só onde provadamente agrega valor não oferecido pelo harness. *Violação:* recriar Plan via prompt narrativo quando `Task(subagent_type="general-purpose")` resolve.

**P2 — Opus 4.7-aware, model-agnostic.**
O framework é otimizado para 4.7 (prompts curtos, thinking nativo respeitado, deferred tools), mas **nunca hardcoda modelo**. Modelo é decisão do usuário via env var. *Violação:* qualquer string `claude-opus-4-7` ou similar em código de produção fora de docs.

**P3 — Token budget é cidadão de primeira classe.**
Cada SKILL declara `token_budget` no frontmatter; o validator quebra build se exceder. Lista numerada de Read calls > 3 vira warn. Persona-overhead default off. *Violação:* SKILL.md com mais de 200 linhas sem split em sub-skills.

**P4 — Persona é opt-in, não obrigatório.**
Default `persona-mode: minimal` (sem greeting, sem icon prefix, sem "do not break character"). Persona nomeada existe para quem quer (`persona-mode: named` ou `full`), mas o usuário técnico não paga pedágio. *Violação:* skill que assume persona ativa para funcionar.

**P5 — Test-first como gate de release.**
Cada SKILL nasce com `checklist.md` (critérios de aceitação) + `steps-v/` (validação). Sem isso, validator falha. CI não merge. Cobertura mínima por camada documentada (ver Seção 7). *Violação:* skill sem checklist.md no PR.

**P6 — Diataxis-driven docs, em PT primeiro.**
Docs estruturadas em tutorials / how-to / reference / explanation (modelo BMAD `_STYLE_GUIDE.md`). Português é a língua primária; inglês é tradução secundária garantida apenas para reference (mínimo). Style guide automatizado (lint markdown). *Violação:* nova feature merge sem doc Diataxis correspondente.

**P7 — Customização sem fork (4 camadas mas leve).**
Override em camadas TOML — `framework defaults` → `team` → `user` → `local` (3 camadas explícitas + 1 implícita). Resolução em **Node, via hook nativo**, sem subprocess Python. *Violação:* skill que codifica behavior de projeto-específico em vez de delegar pra customize.toml.

**P8 — Honestidade sobre o que somos.**
Não somos cérebro, somos cinto de utilidade. Não somos metodologia, somos infraestrutura. Não somos orquestrador externo, somos engenharia de prompt estruturada que roda dentro do LLM. *Violação:* marketing que prometa "AI agents that work autonomously" sem caveats.

> **Constitution v0.1 = essas 8 frases. Cada uma com 1 parágrafo de contexto. Total ~80 linhas. Comparativo: AIOX `constitution.md` tem 6 artigos com ~30 NON-NEGOTIABLE/MUST/SHOULD; BMAD não tem constitution explícita. Nosso ponto: enxuta, executável, testável.**

---

## 2. Arquitetura de Alto Nível

### 2.1 Componentes principais

```
                          ┌──────────────────────────────────┐
                          │       Claude Code 2.1.x          │
                          │    (Skill tool, Plan/Explore,    │
                          │   deferred tools, hooks engine)  │
                          └─────────────┬────────────────────┘
                                        │
            SessionStart / PreToolUse / PostToolUse / UserPromptSubmit
                                        │
                                        ▼
   ┌────────────────────────────────────────────────────────────────────┐
   │                     [FRAMEWORK] Hook Layer (Node)                  │
   │  ┌──────────────┐  ┌────────────────┐  ┌──────────────────────┐   │
   │  │ session-start│  │ pre-skill      │  │ post-skill           │   │
   │  │ (detecta     │  │ (resolve       │  │ (métricas, token     │   │
   │  │  projeto)    │  │  customize.toml│  │  usage, cache stats) │   │
   │  │              │  │  + injeta ctx) │  │                      │   │
   │  └──────────────┘  └────────────────┘  └──────────────────────┘   │
   └──────────────────┬─────────────────────────────────────────────────┘
                      │
                      ▼
   ┌────────────────────────────────────────────────────────────────────┐
   │                       [FRAMEWORK] Core (Node)                       │
   │                                                                    │
   │  ┌────────────────┐   ┌──────────────────┐   ┌────────────────┐    │
   │  │ Skill Registry │   │  Skill Validator │   │ Module Resolver│    │
   │  │  (catálogo     │   │  (15-20 regras   │   │  (npm packages │    │
   │  │   gerado de    │   │   + Opus 4.7     │   │   + manifests  │    │
   │  │   frontmatter) │   │   hygiene)       │   │   YAML)        │    │
   │  └────────────────┘   └──────────────────┘   └────────────────┘    │
   │                                                                    │
   │  ┌────────────────┐   ┌──────────────────┐   ┌────────────────┐    │
   │  │ Customize      │   │  CLI             │   │ Help Router    │    │
   │  │ Resolver (TOML │   │  (install,       │   │  (skill nativa │    │
   │  │  3 layers, JS) │   │   validate,      │   │   que descobre │    │
   │  │                │   │   doctor, etc.)  │   │   estado)      │    │
   │  └────────────────┘   └──────────────────┘   └────────────────┘    │
   └────────────────────────────────────────────────────────────────────┘
                      │
                      ▼
   ┌────────────────────────────────────────────────────────────────────┐
   │                          Skills (in-context)                        │
   │                                                                    │
   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌──────────┐  │
   │  │ core skills │  │ phase-1     │  │ phase-2     │  │ ...      │  │
   │  │ (help,      │  │ skills      │  │ skills      │  │ modules  │  │
   │  │  customize, │  │ (analysis)  │  │ (planning)  │  │ externos │  │
   │  │  doctor)    │  │             │  │             │  │ via npm  │  │
   │  └─────────────┘  └─────────────┘  └─────────────┘  └──────────┘  │
   └────────────────────────────────────────────────────────────────────┘
```

**Descrição de cada componente:**

- **Core engine (Node, in-context):** Não é orquestrador externo. Roda parcialmente no host (CLI, hooks) e parcialmente "como prompt" (skills carregadas pelo modelo). Lição direta do TEA (`bmad-analise.md:464-466`): *"BMad is a small agent + workflow engine. There is no external orchestrator — everything runs inside the LLM context window through structured instructions."* Adotamos.

- **Skill Registry & Validator:** Frontmatter padrão (Seção 3) + validador determinístico com 15-20 regras (Seção 4). O registry é gerado automaticamente do frontmatter de cada SKILL.md (não CSV manual como `bmad-help.csv`). Validator roda em CI e como `[framework] validate` local.

- **Module System (extensions como npm packages externos):** Cada módulo (ex.: `@nmforge/analysis`, `@nmforge/test-architect`, `@nmforge/wds`) é um npm package separado com `module.yaml` declarativo (lição WDS, `bmad-analise.md:503-514`). O instalador resolve dependências via `requiredModules` / `recommendedModules`.

- **Help/Router skill:** Skill nativa (não CLI command — ADR-007) que lê o registry + detecta artefatos no projeto + recomenda próximo passo. Modelo direto do `bmad-help` (`bmad-analise.md:269-275`).

- **Hooks Layer (Node, sem Python):** SessionStart, PreToolUse, PostToolUse, UserPromptSubmit, PreCompact. Implementados em CJS portáveis (modelo dos hooks bem-feitos do AIOX, `aiox-opus47.md:215-221`, D2.7). PreSkill resolve customize.toml em Node — substitui o subprocess Python do BMAD.

- **CLI (`nmforge` ou `[framework]`):** Comandos `install`, `validate`, `doctor`, `benchmark`, `module create`, `skill create`. Modelo BMAD (`tools/installer/bmad-cli.js`, 105 linhas, Commander.js + @clack/prompts).

- **Customization Layer (TOML 3 camadas):** `framework defaults` → `_nmforge/team.toml` → `_nmforge/user.toml` (+ env vars como override implícito). Resolver em Node puro. Sem subprocess Python (lição direta da decisão D2.4 do `bmad-analise.md`, l.203-209).

### 2.2 Fluxo de uma sessão típica

```
1. Usuário abre Claude Code num projeto com .claude/skills/nmforge-* instaladas.

2. Claude Code dispara hook SessionStart (bash + node):
   - hook lê .claude/nmforge/config.toml (se existir)
   - exporta env vars: NMFORGE_PROJECT=true, NMFORGE_PHASE=current, etc.
   - aciona prompt cache 1h (ENABLE_PROMPT_CACHING_1H=1)

3. Usuário digita: "preciso planejar refactor do módulo X"

4. Claude Code (Opus 4.7) lê system-reminder com lista de skills disponíveis
   (incluindo nmforge-help). Decide invocar nmforge-help via Skill tool.

5. Hook PreToolUse (PreSkill custom em Node) é disparado:
   - Identifica que skill alvo é "nmforge-plan-refactor"
   - Resolve customize.toml em 3 camadas via merge JS nativo
   - Injeta system-reminder com contexto resolvido (não algoritmo de resolução)
   - Aplica policy de allowed-tools do frontmatter

6. Modelo recebe SKILL.md já-customizado + checklist.md + decide qual step
   carregar (steps-c/ para Create, steps-e/ para Edit, steps-v/ para Validate).

7. Modelo executa, faz tool calls em paralelo onde possível (Read X, Read Y,
   Read Z numa única mensagem — instrução explícita no SKILL.md).

8. Hook PostToolUse registra: skill invocada, tokens IO, cache hit ratio,
   effort level, duration. Métrica vai para .claude/nmforge/metrics.jsonl
   (append-only, local).

9. Usuário pode invocar `/nmforge doctor` a qualquer momento para auditar
   configuração, versão, modelo em uso, cache stats das últimas N sessões.
```

### 2.3 Decisões arquiteturais explícitas (ADRs leves)

> Formato: cada ADR é decisão concreta + contexto + consequência. Formato leve (não Madr completo). Numeradas para referência.

#### ADR-001 — TOML para customize, YAML para module manifest

- **Decisão:** Customizações por skill em `customize.toml` (4 camadas, modelo BMAD); manifestos de módulo em `module.yaml` (modelo WDS).
- **Contexto:** TOML é melhor para **overrides estruturados com merge profundo** (BMAD provou). YAML é melhor para **manifestos declarativos com listas de objetos** (WDS provou). Misturar é OK quando cada formato faz o que faz melhor.
- **Consequências:** Usuários precisam aprender 2 formatos. Trade-off aceito. Mitigação: docs de exemplo claros + validator com erros explicativos.

#### ADR-002 — Hook layer Node, nunca Python

- **Decisão:** Todos os hooks do framework são implementados em Node (CJS para portabilidade, ESM para módulos novos). Customize resolution em Node nativo. Python permitido APENAS em scripts opcionais de skill (não framework core).
- **Contexto:** BMAD obriga `python3 resolve_customization.py` em toda ativação (`bmad-analise.md:203-209`, D2.4). Adiciona pré-requisito (Python 3.10+ + uv), latência de subprocess, falhas silenciosas. Para um framework Node-first, é fricção desnecessária.
- **Consequências:** Quem quiser estender com Python (ex.: skill de data science) pode — mas core é Node-only. Reduz usuários potenciais? Marginalmente. Ganha simplicidade.

#### ADR-003 — Skills via Skill tool nativa, não markdown estático "always loaded"

- **Decisão:** Skills do framework são registradas via Skill tool nativa do Claude Code 2.1.x (frontmatter `name`/`description`/`allowed-tools` + ToolSearch deferred loading). Markdown estático em `.claude/skills/` apenas para skills core que precisam estar sempre disponíveis (`nmforge-help`, `nmforge-doctor`).
- **Contexto:** AIOX trata skills como markdown estático sempre carregado (`aiox-opus47.md:128-134`, D1.7) — pesa contexto. CC 2.1.x oferece deferred loading via Skill tool.
- **Consequências:** Skills "raras" (1-2 invocações por mês) não pesam quando não usadas. Cache hit ratio em sessões longas melhora. Skills "always" precisam justificar via PR.

#### ADR-004 — Persona opt-in, default minimal

- **Decisão:** Frontmatter `persona-mode: minimal | named | full`. Default `minimal` (sem greeting, sem icon, sem "do not break character"). Persona nomeada (à la BMAD Mary/Amelia) é tier acima.
- **Contexto:** BMAD obriga persona em todas as 7 agents nomeados (`bmad-analise.md:226-232`, D2.7). Para nosso target (dev técnico BR pragmático), greeting+emoji é fricção. Mas há mercado para quem ama RP — não vamos eliminar.
- **Consequências:** Documentação tem que cobrir "como ativar persona se quiser". Migração de usuário BMAD para nosso framework via config switch.

#### ADR-005 — Customization em 3 camadas (não 4)

- **Decisão:** `framework defaults` (shipped) → `_nmforge/team.toml` (compartilhado via git) → `_nmforge/user.toml` (gitignored, pessoal). 3 camadas apenas. Sem distinção `shipped` vs `team` separada como BMAD faz com `_bmad/config.toml` vs `_bmad/custom/{skill}.toml`.
- **Contexto:** BMAD tem 4 camadas (`bmad-analise.md:140-141`). Funciona, mas tem complexidade de merge de "arrays-of-tables keyed por code/id". Para nosso MVP, 3 é suficiente — adicionar 4ª se demanda real aparecer.
- **Consequências:** Resolver mais simples. Documentação mais curta. Perda: granularidade fina por skill (mitigada por seções TOML por skill no mesmo arquivo).

#### ADR-006 — Módulos como npm packages externos (dia 1)

- **Decisão:** Core (`@nmforge/core`) + módulos (`@nmforge/analysis`, `@nmforge/test`, `@nmforge/wds-equivalent`, etc.) cada um em seu próprio npm package, instalável via `npx nmforge install --modules core,analysis,test`. Monorepo NO REPO de desenvolvimento (Turborepo/Nx ou pnpm workspaces) mas distribuição como packages independentes.
- **Contexto:** BMAD acerta nisso (BMM/BMB/TEA/CIS/BMGD/WDS são npm packages — `bmad-analise.md:36`, D2.3). AIOX erra (tudo em `squads/` no monorepo — `bmad-analise.md:36`).
- **Consequências:** Core fica enxuto (sem inflação). Extension authors ganham primeiros-cidadãos status. Custo de manutenção: precisa CI cross-package (mitigado por monorepo de dev).

#### ADR-007 — Tri-modal step files (C/E/V) — adotar do TEA

- **Decisão:** Skills do framework adotam estrutura de pasta com `steps-c/` (Create), `steps-e/` (Edit), `steps-v/` (Validate). Modelo direto do TEA (`bmad-analise.md:466-475`, D5).
- **Contexto:** TEA propõe que cada workflow oferece menu na ativação `[C] Create | [R] Resume | [V] Validate | [E] Edit`. É padrão **excepcional** para workflows que devem ser repetíveis, corrigíveis, auditáveis. Aplicável muito além de testes.
- **Consequências:** Boilerplate inicial de skill aumenta (3 pastas em vez de 1). Mitigado por `[framework] skill create` que gera scaffolding. Skills triviais (sem Edit/Validate) podem ter pastas vazias com README explicativo.

#### ADR-008 — Help router como skill nativa, não CLI command

- **Decisão:** O `[framework]-help` é uma SKILL invocável via Skill tool, não um CLI command como `nmforge help`. CLI tem `nmforge doctor` e `nmforge validate` (porque rodam fora do contexto do modelo).
- **Contexto:** Help router precisa de **inteligência contextual** — analisar artefatos no projeto, ler estado, recomendar próximo passo. Isso é trabalho do modelo, não do CLI. BMAD acerta nisso (`bmad-help` é skill — `bmad-analise.md:269-275`, D2.12).
- **Consequências:** Usuário invoca via "what should I do next?" (linguagem natural) e modelo dispara `nmforge-help`. CLI permanece para tarefas determinísticas (validate, doctor, install).

#### ADR-009 — Token budget como first-class

- **Decisão:** Frontmatter de cada SKILL declara `token_budget: <int>` (estimado, em tokens de input). Validator quebra build se SKILL.md exceder esse budget × 1.2 (margem de 20%). `nmforge benchmark` mede uso real e atualiza budgets sugeridos.
- **Contexto:** Hoje, ninguém mede. BMAD tem skills de 1.512 linhas sem orçamento. AIOX idem. Para um framework "Opus 4.7-aware", orçamento é doutrina.
- **Consequências:** Disciplina forçada. Pode irritar contributors no início (até pegarem o jeito). ROI: previne inflação de skills com o tempo.

#### ADR-010 — Cobertura de testes como gate de release

- **Decisão:** PR não merge se cobertura unit < 85%, integration < 70%, e2e cobrindo top-5 fluxos críticos. Validator e CLI: 90%+. Skills: cada skill com `checklist.md` cobrindo 100% dos cases declarados em `description.Use when:`.
- **Contexto:** Pilar 1 do projeto. AIOX tem testes mas com gaps em features novas (`aiox-opus47.md:223-229`, D2.8). BMAD tem CI maduro mas testa instalação, não comportamento das skills.
- **Consequências:** Esforço inicial alto. Mitigação: começar MVP com poucas skills mas todas testadas; expandir devagar. Ver Seção 7.

#### ADR-011 — Changelog vivo, semantic-release manual nos primeiros 6 meses

- **Decisão:** CHANGELOG.md atualizado a cada PR (não automático). Releases são manuais (npm publish + git tag) nos primeiros 6 meses. Após v1.0, considerar semantic-release.
- **Contexto:** AIOX tem 2 changelogs inconsistentes (`aiox-opus47.md:184-189`, D2.3) — sintoma de semantic-release mal configurado. BMAD tem changelog vivo bem mantido. No MVP, simplicidade > automação.
- **Consequências:** Manutenção manual é trabalho. Compensa por evitar bugs de semver automation no início.

#### ADR-012 — `allowed-tools` no frontmatter (princípio do menor privilégio)

- **Decisão:** Toda SKILL.md declara `allowed-tools` no frontmatter (lista explícita). Validator falha se ausente. Hook PreSkill aplica essa policy via `permissions.allow` dinâmico.
- **Contexto:** claude-code-bmad-skills usa isso (`bmad-analise.md:413-414`, D4 lesson 4). BMAD/AIOX não. Princípio de segurança básico — skill de "draft PR" não precisa de Bash; skill de "doctor" não precisa de Write.
- **Consequências:** Mais um campo obrigatório. Mitigado por `[framework] skill create` que sugere lista mínima baseada em template.

#### ADR-013 — Documentação i18n PT primary, EN secondary

- **Decisão:** Toda doc nasce em PT-BR. EN é tradução secundária (mínimo: README, getting started, reference). Tradução automática (LLM) com revisão humana, não traduções paralelas duplicadas.
- **Contexto:** Persona primária BR (Vinicius). Mas projeto OSS público precisa de EN para discoverability global. Modelo BMAD (5 idiomas) é overkill no MVP.
- **Consequências:** Comunidade BR primeiro — alavanca para engajamento. Risco: comunidade global mais lenta. Aceito no MVP, revisado em v1.0.

#### ADR-014 — Conditional persona-mode `full` requires Sonnet+ (não Haiku)

- **Decisão:** Quando `persona-mode: full`, validator emite warn se modelo declarado for Haiku. Persona-narrativa pesada perde valor em modelos pequenos.
- **Contexto:** lição do `bmad-party-mode` (`bmad-analise.md:255-259`, D2.10): "match model weight to depth". Persona pesada num Haiku é desperdício duplo.
- **Consequências:** Edge case mas elegante; documenta intent para extension authors.

#### ADR-015 — Toda skill declara `phase` (mesmo se "meta")

- **Decisão:** Frontmatter `phase: analysis | planning | solutioning | implementation | meta`. Help router usa para sugerir progressão lógica.
- **Contexto:** BMAD organiza por fases (1-analysis, 2-plan, 3-solutioning, 4-implementation). Funciona conceitualmente. "meta" cobre help/doctor/customize que não pertencem a uma fase.
- **Consequências:** Vincula framework a um modelo mental (4 phases agile). Aceito porque mapeia o uso real (mesmo dev solo segue analysis → plan → impl).

---

## 3. Spec da Skill (formato canônico)

### 3.1 Frontmatter padrão de SKILL.md

```yaml
---
# Identidade
name: nmforge-create-prd                # kebab-case; prefixo do módulo
description: |                          # 1-2 sentences + "Use when:" trigger
  Generates a Product Requirements Document from a brief.
  Use when: user has a project brief and needs structured PRD before architecture.

# Capacidades
allowed-tools: Read, Write, Edit, Glob, Grep
effort: medium                          # low | medium | high
token_budget: 2500                      # tokens de input estimados (validator: ±20%)
phase: planning                         # analysis | planning | solutioning | implementation | meta

# Workflow graph
preceded-by: [nmforge-product-brief]     # skills que tipicamente vêm antes
followed-by: [nmforge-create-architecture]
required-artifacts: [docs/brief.md]     # arquivos que devem existir
output-artifacts: [docs/prd.md]         # arquivos gerados/modificados

# Persona (opt-in)
persona-mode: minimal                   # minimal | named | full
# persona-name: John                    # só relevante se mode != minimal
# persona-icon: "📋"

# i18n
language: auto                          # en | pt-br | auto (segue config do projeto)

# Customization
customize-keys:                          # chaves expostas para customize.toml
  - target_audience
  - prd_format

# Subagent strategy (opcional)
subagent-pattern: none                  # none | parallel | fan-out
---
```

### 3.2 Explicação de cada campo

| Campo | Por que existe | Como o validator usa |
|-------|----------------|----------------------|
| `name` | Identifica skill globalmente. Prefixo de módulo (`nmforge-`, `wds-`) evita colisão. | Regra `R-DET-01`: deve casar com basename do dir, kebab-case, sem espaços. |
| `description` | Modelo decide quando invocar via Skill tool. Sem `Use when:` o modelo não sabe disparar. | `R-DET-02`: presente, ≥ 1 frase, contém substring "Use when:". |
| `allowed-tools` | Princípio de menor privilégio. Hook aplica como `permissions.allow`. | `R-DET-03`: presente, lista válida de tool names CC nativas. |
| `effort` | Hooks ajustam injection de contexto baseado nisso. | `R-DET-04`: enum válido. `R-INF-01` (inferência): sugere `low` se SKILL < 60 linhas, `high` se > 250. |
| `token_budget` | Disciplina de tamanho. CI quebra se body ultrapassa budget × 1.2. | `R-OP47-06`: budget × 1.2 ≥ token count(SKILL.md body). Tokenização via tiktoken aproximação. |
| `phase` | Help router agrupa por fase. ADR-015. | `R-DET-05`: enum válido. |
| `preceded-by`/`followed-by` | DAG navegável. Help router usa. | `R-INF-02`: nomes apontam para skills existentes (cross-module OK com warn). |
| `required-artifacts` | Help router avisa "você precisa criar X primeiro". | `R-INF-03`: paths são glob-resolvíveis em projeto típico. |
| `output-artifacts` | Help router atualiza estado pós-execução. | Idem. |
| `persona-mode` | Opt-in. Default minimal. | `R-DET-06`: enum válido. `R-INF-04`: se `full`, warn se Haiku declarado. |
| `language` | Define idioma de outputs/comunicação. `auto` lê config. | `R-DET-07`: enum válido. |
| `customize-keys` | Documenta o que pode ser customizado. Validator avisa se customize.toml referencia chave não declarada. | `R-DET-08`: lista de strings válida. |
| `subagent-pattern` | Documenta intent de paralelismo. ADR-007 + D4 do bmad-analise. | `R-DET-09`: enum válido. |

### 3.3 Estrutura de pasta da skill

```
nmforge-create-prd/
├── SKILL.md                  # frontmatter + overview executivo (≤ 200 linhas)
├── customize.toml            # overrides (gerado vazio por skill create)
├── checklist.md              # critérios de aceitação (test-first, P5)
├── steps-c/                  # Create mode
│   ├── 01-load-brief.md
│   ├── 02-elicit-requirements.md
│   └── 03-write-prd.md
├── steps-e/                  # Edit mode
│   ├── 01-assess-changes.md
│   └── 02-apply-edits.md
├── steps-v/                  # Validate mode
│   └── 01-evaluate-checklist.md
├── resources/                # docs longos referenciados, não inline
│   └── prd-template.md
└── scripts/                  # scripts auxiliares (Node ou bash)
    └── extract-sections.js
```

**Princípios da estrutura:**
1. **SKILL.md ≤ 200 linhas** (P3, ADR-009).
2. **Step files carregados just-in-time** pelo modelo, não pré-carregados (lição BMAD pré-v6, padrão D1 BMAD canonical).
3. **Resources referenciados por link markdown** (`[ver template](resources/prd-template.md)`), nunca inline.
4. **Scripts em Node** (default) ou bash POSIX (portabilidade).
5. **`checklist.md` é obrigatório** (P5 / ADR-010). Validator falha se ausente.

---

## 4. Skill Validator — Regras de Opus 4.7 Hygiene

> Modelo: BMAD `validate-skills.js` com 19 regras (`bmad-analise.md:262-267`, D2.11). Adotamos formato e expandimos com regras Opus 4.7 hygiene.

### 4.1 Regras determinísticas (fail = build break)

| ID | Descrição | Severity | Exemplo de violação |
|----|-----------|----------|---------------------|
| `R-DET-01` | `name` casa com basename do dir, kebab-case | fail | dir `myskill/` com `name: my-skill` |
| `R-DET-02` | `description` ≥ 1 frase, contém "Use when:" | fail | `description: "PRD generator"` (sem Use when) |
| `R-DET-03` | `allowed-tools` presente, valores válidos | fail | `allowed-tools: ReadFile` (não existe) |
| `R-DET-04` | `effort` é enum válido | fail | `effort: extreme` |
| `R-DET-05` | `phase` é enum válido | fail | `phase: testing` |
| `R-DET-06` | `persona-mode` é enum válido | fail | `persona-mode: aggressive` |
| `R-DET-07` | `language` é enum válido | fail | `language: spanish` |
| `R-DET-08` | `customize-keys` lista de strings | fail | `customize-keys: "all"` |
| `R-DET-09` | `subagent-pattern` é enum válido | fail | `subagent-pattern: many` |
| `R-DET-10` | `checklist.md` existe na pasta da skill | fail | sem arquivo `checklist.md` |
| `R-DET-11` | Refs internas (`@/path` ou `[link](file)`) resolvem | fail | link para `resources/foo.md` que não existe |
| `R-DET-12` | Frontmatter YAML é parseável | fail | indentação inválida |

### 4.2 Regras Opus 4.7 hygiene

| ID | Descrição | Severity | Exemplo de violação |
|----|-----------|----------|---------------------|
| `R-OP47-01` | SKILL.md tem ≤ 5 ocorrências de `CRITICAL:` ou `<critical>` | warn | 7 `<critical>` no topo (estilo BMAD `bmad-dev-story:76-84`) |
| `R-OP47-02` | SKILL.md ≤ 200 linhas | warn | 485 linhas (estilo `bmad-dev-story.md`) |
| `R-OP47-03` | Lista numerada de Read calls > 3 sem instrução de paralelismo | warn | "1. Read X 2. Read Y 3. Read Z 4. Read W" |
| `R-OP47-04` | Frontmatter sem `allowed-tools` | fail | (já em R-DET-03, mantido aqui por ênfase) |
| `R-OP47-05` | Strings proibidas no body: `STAY IN CHARACTER`, `NO LYING`, `NO CHEATING`, `DO NOT skip steps` | fail | qualquer ocorrência (ver bmad-analise D2.7 e aiox-opus47 D1.5) |
| `R-OP47-06` | Body excede `token_budget × 1.2` | fail | budget 1500, body 2000 tokens |
| `R-OP47-07` | `MUST` aparece > 5 vezes no body | warn | estilo BMAD (185 ocorrências em `src/`) |
| `R-OP47-08` | Activation ritual > 30 linhas no início do SKILL.md | warn | estilo BMAD (~57 linhas) |

### 4.3 Regras de inferência (warn ou info)

| ID | Descrição | Severity | Comportamento |
|----|-----------|----------|---------------|
| `R-INF-01` | Sugerir `effort` baseado em tamanho | info | "skill tem 220 linhas, considere `effort: high`" |
| `R-INF-02` | `preceded-by`/`followed-by` apontam para skills existentes | warn | "skill `foo-bar` referenciada não encontrada no registry" |
| `R-INF-03` | `required-artifacts` paths plausíveis | info | "path `docs/prd.md` não existe no projeto típico — confirmar" |
| `R-INF-04` | `persona-mode: full` + modelo Haiku | warn | "persona pesada perde valor em modelos pequenos (ADR-014)" |
| `R-INF-05` | Diagrama ASCII detectado | info | "considere mover diagrama para `resources/diagrams/`" |
| `R-INF-06` | Mistura PT/EN no body | warn | "consistência: prompts em EN, UI em PT (ADR-013)" |

### 4.4 Como rodar

```bash
nmforge validate                    # roda todas as regras
nmforge validate --strict           # warns viram fail (CI mode)
nmforge validate --skill nmforge-create-prd  # uma skill só
nmforge validate --rule R-OP47-05   # uma regra só
nmforge validate --json             # output JSON para CI parsing
```

### 4.5 Sample output

```
$ nmforge validate

[✓] nmforge-help                       OK
[✓] nmforge-doctor                     OK
[!] nmforge-create-prd                 2 warns
    R-OP47-02  SKILL.md is 234 lines (limit: 200). Consider splitting steps.
    R-OP47-03  Lines 89-92: 4 sequential Read calls without parallelism hint.
[✗] nmforge-create-architecture        1 fail, 1 warn
    R-DET-10  checklist.md missing.
    R-OP47-05  Line 42: forbidden string "DO NOT skip steps".

Summary: 2 OK, 2 with warnings, 1 failed.
Build: FAIL.
```

---

## 5. MVP Scope — Versão 0.1

### 5.1 O que ENTRA no MVP (release 0.1)

**Core:**
1. **CLI** com 4 comandos: `install`, `validate`, `doctor`, `skill create`.
2. **Skill Validator** com 12 regras (R-DET-01 a R-DET-12 + R-OP47-01, 02, 04, 05).
3. **Customize Resolver** TOML 3 camadas em Node nativo.
4. **Hook PreSkill** que resolve customize antes do modelo ver a skill.
5. **Hook SessionStart** que detecta projeto e exporta env vars.
6. **Hook PostToolUse** que registra métricas em `.nmforge/metrics.jsonl`.

**Skills core (5):**
1. `nmforge-help` — router meta-cognitivo (modelo BMAD `bmad-help`).
2. `nmforge-doctor` — auditoria do projeto (modelos legados, anti-patterns 4.7, refs órfãs).
3. `nmforge-customize` — guia interativo de edição de TOML.
4. `nmforge-skill-create` — scaffold de nova skill (gera SKILL.md + checklist + steps-c/steps-e/steps-v vazios).
5. `nmforge-validate` — wrapper amigável para `nmforge validate` rodado pelo modelo (não CLI).

**Module system básico:**
- Manifesto `module.yaml` definido (Seção 9).
- Instalador resolve `requiredModules` simples (sem dependency tree complexo).
- Apenas `@nmforge/core` é package distribuído no 0.1 (módulos externos vêm em 0.2).

**Documentação:**
- README PT (completo) + EN (essencial: install, quick start, link para PT).
- 1 tutorial Diataxis: "Sua primeira skill em 10 minutos".
- 1 how-to: "Customizar uma skill sem fork".
- Reference: frontmatter spec + lista de regras do validator.
- Explanation: CONSTITUTION.md + DESIGN.md (esse doc).

**Testes:**
- Unit tests para CLI (≥ 90% cobertura).
- Unit tests para validator (≥ 95% cobertura — cada regra com test cases positivo+negativo).
- Unit tests para customize resolver (≥ 90%).
- Integration tests para hooks (rodar contra Claude Code mock).
- 1 e2e test: instalar do zero, criar skill, validar, rodar.

**CI:**
- GitHub Actions: lint + test + validate-skills + smoke install em macOS + Linux.

### 5.2 O que NÃO ENTRA (deixa para 0.2+)

- Módulos externos (analysis, planning, etc.) — vêm em 0.2-0.4.
- `nmforge benchmark` (medição de skills) — vem em 0.3.
- Skill graph visualizável — vem em 0.3.
- Marketplace de extensions — vem em v1.0.
- Multi-IDE support (Cursor, Codex, Gemini) — vem pós-1.0.
- Persona named/full presets prontos — vem em 0.2 (frontmatter pronto, mas sem skills com persona ainda).
- Tri-modal step files completos para todas as skills core — só `nmforge-skill-create` no 0.1; outras skills core podem usar estrutura simples.
- Regras de validator R-INF-* (inferência) — só determinísticas + 4 hygiene críticas no 0.1.
- i18n além de PT+EN — vem em v1.0+.

### 5.3 Critérios de release de 0.1

**Funcionais:**
- [ ] `npx @nmforge/core install` funciona em projeto vazio (macOS + Linux).
- [ ] `nmforge validate` corre no próprio repo do framework e passa.
- [ ] `nmforge doctor` identifica corretamente: modelo configurado, versão Claude Code, prompt cache status, anti-patterns nas skills.
- [ ] Hook PreSkill resolve customize.toml e injeta no prompt em < 100ms.
- [ ] As 5 skills core funcionam invocadas via Skill tool no Claude Code 2.1.x.

**Qualidade:**
- [ ] Cobertura unit ≥ 85% global, ≥ 95% no validator.
- [ ] Cobertura integration ≥ 70%.
- [ ] 1 e2e test passa em CI.
- [ ] Zero warnings críticos do validator no próprio repo.
- [ ] Lint (eslint + prettier + markdownlint) passa.
- [ ] CHANGELOG.md atualizado.

**Documentação:**
- [ ] README PT completo (install, quick start, why, links).
- [ ] README EN essencial.
- [ ] CONSTITUTION.md publicado (8 princípios).
- [ ] DESIGN.md (este doc) publicado.
- [ ] 1 tutorial PT: "Sua primeira skill em 10 minutos" testado por 1 dev externo.
- [ ] CONTRIBUTING.md com onboarding ≤ 30 minutos.
- [ ] LICENSE (MIT) presente.

**Comunidade:**
- [ ] Repo público no GitHub.
- [ ] npm package `@nmforge/core` publicado.
- [ ] 1 issue template + 1 PR template.
- [ ] Discussion forum aberto (GitHub Discussions).

**Esforço estimado para 0.1:** **6-8 semanas** com 1 dev part-time (~15-20h/semana). Ver Seção 6 e Resumo Executivo.

---

## 6. Roadmap

> Cadência: releases manuais nos primeiros 6 meses (ADR-011). Major releases ~2 meses, minor a cada 2-3 semanas.

### v0.1 (MVP) — semanas 1-8

**Marcos:**
1. **Semana 2:** scaffold do repo + CI verde + primeiro spike do validator (5 regras).
2. **Semana 4:** customize resolver + hook PreSkill funcionando localmente.
3. **Semana 6:** 5 skills core implementadas + tests com cobertura mínima.
4. **Semana 7:** docs PT + tutorial testado por 1 dev externo (não-Vinicius).
5. **Semana 8:** publicação npm `@nmforge/core` v0.1.0 + post no Reddit r/ClaudeAI/r/programming.

**Métricas de sucesso:**
- 0 bugs P0/P1 nas primeiras 2 semanas pós-release.
- 50+ instalações npm na primeira semana.
- 5 issues abertas (sinal de uso real).

### v0.2 — semanas 9-16

**Marcos:**
1. Módulo `@nmforge/analysis` (3-5 skills): brainstorming, market-research, document-project.
2. Módulo `@nmforge/test` (inspirado no TEA): tri-modal completo, knowledge fragments tier-loaded.
3. Persona presets opt-in (mode `named` e `full` documentados com skills exemplo).
4. Validator: regras R-INF-* (inferência) + R-OP47-03/06/07/08.
5. Tutorial 2: "Crie seu próprio módulo @meu-org/foo".

**Métricas:**
- 200+ instalações cumulativas.
- 1 contribuição externa de PR (não-Vinicius).
- 1 módulo externo publicado por terceiro (mesmo que tutorial-only).

### v0.3 — semanas 17-24

**Marcos:**
1. `nmforge benchmark` (medição de tokens/latência por skill).
2. Skill graph visualizável (`nmforge graph` — output mermaid).
3. Módulo `@nmforge/planning` (PRD, architecture, epics-stories).
4. Módulo `@nmforge/wds` (design discovery, lição WDS).
5. CI: Windows support oficial.

**Métricas:**
- 500+ instalações.
- 3+ módulos externos da comunidade.
- Documentação 100% reference + 80% how-to em PT, 60% em EN.

### v1.0 (production-ready) — semanas 25-36 (~6-8 meses)

**Critérios para declarar 1.0:**
- ≥ 5 módulos oficiais estáveis.
- API estável (nada quebra entre 1.x.y bumps).
- Marketplace de extensions aberto (mesmo que simples — listagem npm + metadata).
- Cobertura agregada ≥ 90%.
- 1.000+ instalações cumulativas.
- 10+ contribuidores ativos.
- Multi-IDE explorado (Cursor pelo menos como spike, mesmo que não release).
- BR community ativa (canal Discord/Telegram com 50+ membros).

---

## 7. Estratégia de Testes (PILAR 1)

### 7.1 Filosofia

**Test-first como gate**, não como aspiração. Inspirado no TEA (`bmad-analise.md:464-498`, D5):
> "BMad is a small agent + workflow engine. There is no external orchestrator — everything runs inside the LLM context window through structured instructions."

Se o engine roda no contexto do modelo, **a única coisa que podemos testar deterministicamente é a infraestrutura** (CLI, validator, hooks, resolver). Comportamento das skills é testado via:
1. Validator (regras determinísticas + hygiene).
2. Checklist.md por skill (rodado em CI como simulação parametrizada).
3. Smoke tests (rodar skill em Claude Code mock, verificar artefato gerado).

### 7.2 Camadas

| Camada | Cobertura mínima | Tooling | Foco |
|--------|------------------|---------|------|
| Unit | 85% global, 95% validator/CLI | **Vitest** | Funções puras, parsers, regras isoladas |
| Integration | 70% | Vitest + temp dirs | Hooks rodando contra config real, customize resolver com TOML real |
| E2E | Top-5 fluxos | Vitest + child_process | `install` → `skill create` → `validate` → mock CC invoca |
| Skill validation | 100% das skills core | `nmforge validate --strict` | Roda em CI, falha PR |
| Smoke install | 100% | GitHub Actions matrix | macOS + Linux + Windows |

### 7.3 Tooling: Vitest (escolhido)

**Por quê Vitest e não Jest/Bun test:**
- **Vitest:** native ESM (alinha com Node 20+), fast, Jest-compatible API, built-in coverage (v8/istanbul), excelente DX. Comunidade grande.
- **Jest:** maduro mas pesado, ESM ainda chato, mais lento.
- **Bun test:** rápido mas Bun como runtime obrigatório é fricção (não queremos pré-req Bun no MVP — Node 20+ é o contrato).

**Decisão:** Vitest. Permite migrar pra Jest se algum dia precisar (API compatível).

### 7.4 Coverage targets por camada

```yaml
# vitest.config.ts (esboço)
test:
  coverage:
    provider: v8
    thresholds:
      lines: 85
      functions: 85
      branches: 80
      statements: 85
    perFile: false  # global, não por arquivo
    exclude:
      - 'tests/**'
      - 'docs/**'
      - 'bin/**'
```

**Por pacote (no monorepo):**
- `packages/validator/`: 95% lines.
- `packages/cli/`: 90% lines.
- `packages/customize-resolver/`: 90% lines.
- `packages/hooks/`: 80% lines (hooks têm muito I/O — testes integração compensam).
- `skills/nmforge-help/` etc.: validator + checklist + smoke (sem unit propriamente).

### 7.5 Como cada SKILL é testada

**Estrutura:**
```
skills/nmforge-create-prd/
├── SKILL.md
├── checklist.md       # critérios de aceitação (lido por validator)
├── tests/
│   ├── checklist.test.ts          # parsea checklist.md, verifica formato
│   ├── frontmatter.test.ts        # valida frontmatter (cobertos por validator também)
│   └── smoke.test.ts              # opcional: simula invocação via CC mock
```

**Fluxo:**
1. Validator roda regras determinísticas + hygiene → fail/warn.
2. Test parsea `checklist.md` → estrutura válida (cada item tem `[ ] critério` em formato canônico).
3. (Opcional, em integration test): mock Claude Code lê SKILL.md + steps + chama skill com input fixture; output é comparado contra fixture esperada (snapshot).

### 7.6 CI workflow (esboço GitHub Actions)

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: corepack enable
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm format:check
      - run: pnpm markdownlint
  
  test:
    needs: lint
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest]
        node: [20, 22]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
      - run: corepack enable
      - run: pnpm install --frozen-lockfile
      - run: pnpm test:unit -- --coverage
      - run: pnpm test:integration
      - uses: codecov/codecov-action@v4
  
  validate-skills:
    needs: lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: corepack enable && pnpm install --frozen-lockfile
      - run: pnpm validate:skills --strict
  
  e2e-install:
    needs: [test, validate-skills]
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: corepack enable && pnpm install --frozen-lockfile
      - run: pnpm build
      - run: pnpm pack
      - run: |
          mkdir /tmp/test-install && cd /tmp/test-install
          npm init -y
          npm install $GITHUB_WORKSPACE/nmforge-core-*.tgz
          npx nmforge install --yes
          npx nmforge validate --strict
          npx nmforge doctor
```

### 7.7 Test architect role (lição do TEA)

Inspirado em Murat (TEA Master Test Architect — `bmad-analise.md:461-498`, D5):

**No nosso framework, "test architect" é uma responsabilidade documentada, não um cargo:**
- Toda PR de nova skill exige checklist.md aprovado por revisor.
- Toda PR de feature core exige tests + coverage check verde.
- "Murat" se torna a skill `nmforge-test-review` (vem em v0.3) que avalia PRs de skills com critérios P0-P3 (lição direta TEA).

---

## 8. Estratégia de Documentação (PILAR 2)

### 8.1 Estrutura Diataxis (modelo BMAD `_STYLE_GUIDE.md`)

```
docs/
├── _STYLE_GUIDE.md            # vocabulário, header budget, convenções
├── tutorials/                 # learning-oriented (passo a passo, completo, sucesso garantido)
│   ├── 01-getting-started.md
│   ├── 02-sua-primeira-skill.md
│   └── 03-criando-um-modulo.md
├── how-to/                    # task-oriented (resolva problema X)
│   ├── customizar-skill-sem-fork.md
│   ├── ativar-prompt-cache-1h.md
│   ├── debugar-validator-fail.md
│   └── migrar-de-bmad.md
├── reference/                 # information-oriented (consulta, autoritativo)
│   ├── frontmatter.md
│   ├── validator-rules.md
│   ├── cli.md
│   ├── hooks.md
│   ├── module-yaml.md
│   └── customize-toml.md
└── explanation/               # understanding-oriented (porquês, conceitos)
    ├── manifesto.md           # tldr da CONSTITUTION
    ├── arquitetura.md          # tldr deste DESIGN.md
    ├── opus-47-aware.md        # por que prompt curto importa
    ├── persona-opt-in.md
    └── genealogia-bmad.md      # contexto histórico (lição D3 bmad-analise)
```

### 8.2 `_STYLE_GUIDE.md` (essencial)

Modelo direto BMAD (`bmad-analise.md:521-525`). Itens:
- **Header budget:** 8-12 `##` por doc; mais que isso, splitar.
- **Vocabulário canônico:** glossário compartilhado (ver Apêndice B). Termo banido sempre listado (ex.: "expansion pack" → "module"; "agent" → "skill" quando aplicável).
- **Examples-first:** todo conceito tem exemplo de código antes de explicação prosaica.
- **No-emoji-in-prompts policy:** docs explicam quando usar emoji (UI, sim) e quando não (prompts internos, não — ADR-013 implícito).
- **Linkagem cruzada:** todo termo técnico referenciado em outra doc com link.

### 8.3 i18n: PT-BR primary, EN secondary

**Política (ADR-013):**
- Toda doc nasce em PT-BR.
- EN é tradução secundária garantida apenas para: README, getting-started, reference completo. How-tos e explanations: best-effort.
- Tradução automática (LLM, ex: skill `nmforge-translate`) com revisão humana antes de merge.
- Estrutura: `docs/{tutorials,how-to,reference,explanation}/{file}.md` (PT) e `docs/en/...` (EN).

### 8.4 Site: Astro/Starlight (escolhido)

**Por quê Astro/Starlight e não VitePress/Docusaurus:**
- BMAD usa Astro/Starlight (`docs.bmad-method.org`) — referência da indústria pra docs OSS de framework.
- Starlight tem i18n built-in (mapeamento `docs/en/` → `/en/...` rota).
- Search nativo (Pagefind), zero JS extra.
- Deploy fácil (Vercel/Cloudflare Pages).
- Markdown puro com MDX opcional.

### 8.5 Onde docs vivem

**Decisão:** monorepo único.
- `docs/` no mesmo repo do framework.
- Site Astro em `website/` (separado de `docs/` para clareza — `docs/` é fonte, `website/` é build config).
- Single source of truth: edição em `docs/*.md` reflete em `website/` build automático.

**Domínio sugerido:** `nmforge.com` (verificar disponibilidade) com fallback `nmforge-framework.dev` ou `getnmforge.com`.

---

## 9. Module System (Extensions)

### 9.1 Spec do `module.yaml`

> Modelo direto WDS (`bmad-analise.md:503-514`, D5). Adaptado para nosso framework.

```yaml
# module.yaml (na raiz do package npm)
code: analysis                      # identificador curto, prefixo das skills
name: Analysis Module               # nome legível
version: 0.1.0                      # semver
description: |
  Discovery, brainstorming, market research, and document-project skills.
  Phase 1 of the NMforge method.

# Dependências
required-modules: [core]            # módulos obrigatórios
recommended-modules: []             # sugeridos, não obrigatórios
peer-dependencies:                  # versões compatíveis de NMforge core
  '@nmforge/core': '>=0.1.0 <1.0.0'

# Prompts de instalação (declarativo, não-código)
install-prompts:
  - key: project_type
    type: single-select
    label: "Tipo do projeto?"
    options:
      - { value: greenfield, label: "Greenfield (do zero)" }
      - { value: brownfield, label: "Brownfield (existente)" }
  - key: research_depth
    type: single-select
    label: "Profundidade de pesquisa?"
    options:
      - { value: light, label: "Light (1-2 fontes)" }
      - { value: deep, label: "Deep (5+ fontes)" }

# Conteúdo entregue
skills:
  - nmforge-brainstorming
  - nmforge-market-research
  - nmforge-document-project
  - nmforge-product-brief

agents: []                          # agents nomeados (opt-in via persona-mode)

hooks:
  - on: SessionStart
    script: hooks/analysis-session-start.cjs
  - on: PreToolUse
    script: hooks/analysis-pre-tool.cjs
    matchers: ["Skill"]             # só dispara para Skill tool

# Diretórios criados na instalação
directories:
  - docs/research
  - docs/analysis-output

# Mensagem pós-instalação
post-install-notes: |
  ✓ Analysis module installed.
  
  Próximos passos:
    1. /nmforge-help  para descobrir o que fazer agora.
    2. Ou: comece direto com /nmforge-brainstorming.
  
  Customize via: _nmforge/team.toml (compartilhado) ou _nmforge/user.toml (pessoal).
```

### 9.2 Distribuição (npm packages namespaced)

**Padrão:** `@nmforge/<module>` para módulos oficiais, `@<org>/nmforge-<module>` para terceiros.

**Estrutura típica de um módulo:**
```
@nmforge/analysis/
├── package.json                # main: "module.yaml"
├── module.yaml                 # manifesto
├── skills/
│   ├── nmforge-brainstorming/
│   │   ├── SKILL.md
│   │   ├── checklist.md
│   │   └── ...
│   └── ...
├── hooks/
│   └── analysis-session-start.cjs
├── tests/
└── README.md
```

### 9.3 Como o instalador resolve dependências

```bash
$ npx nmforge install --modules analysis,test
NMforge Resolving modules...
  ✓ @nmforge/core (already installed)
  + @nmforge/analysis (^0.1.0)
    requires: @nmforge/core
  + @nmforge/test (^0.1.0)
    requires: @nmforge/core
  recommends: @nmforge/wds (skip)
NMforge npm install in progress...
NMforge Running install prompts...
  Tipo do projeto? > greenfield
  Profundidade de pesquisa? > deep
NMforge Writing _nmforge/team.toml ...
NMforge Creating directories: docs/research, docs/analysis-output
NMforge Installing skills to .claude/skills/nmforge/ ...
NMforge Installing hooks to .claude/hooks/ ...
NMforge ✓ Done. Run: /nmforge-help
```

**Resolver:** Algoritmo simples no MVP — npm install + leitura de `module.yaml` + execução de prompts via @clack/prompts. Sem dependency tree solver custom (delega ao npm).

### 9.4 Conflitos de namespace

**Política:**
- Skills com mesmo `name` em módulos diferentes: validator quebra build na instalação.
- Recomendado: prefixo de módulo no `name` (ex.: `analysis-brainstorming`, `wds-saga-discovery`).
- Hooks com mesmo `on` event: empilham por ordem de instalação (último instalado dispara por último). Documentado.
- Customize keys conflitantes: TOML resolve por seção (cada skill tem seu bloco `[skill.name]`).

---

## 10. Hooks & Claude Code 2.1.x Integration

### 10.1 Hooks do framework

| Hook | Quando | O que faz |
|------|--------|-----------|
| **SessionStart** | Início da sessão CC | Detecta projeto, exporta env vars (`NMFORGE_PROJECT`, `NMFORGE_PHASE`, `NMFORGE_MODEL`), aciona prompt cache 1h |
| **UserPromptSubmit** | Antes do prompt ir ao modelo (opcional) | Injeta contexto do help router se prompt contém "what next" / "where am I" |
| **PreToolUse (PreSkill custom)** | Antes de Skill tool ser invocada | Resolve customize.toml em Node, injeta system-reminder com contexto resolvido, aplica `permissions.allow` baseado em `allowed-tools` |
| **PreToolUse (logging)** | Antes de qualquer tool | Loga em `.nmforge/metrics.jsonl` (tool, args hash, timestamp) |
| **PostToolUse** | Depois de tool | Métricas: tokens, duration, success/fail; atualiza `output-artifacts` no estado do projeto |
| **PreCompact** | Antes de compactação automática | Preserva contexto crítico: estado do projeto, último skill invocado, customize ativo |

### 10.2 Implementação de exemplo: PreSkill em Node

```javascript
// .claude/hooks/nmforge-pre-skill.cjs
#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const { resolveCustomize } = require('@nmforge/core/customize-resolver');

const toolName = process.env.CLAUDE_TOOL_NAME;
if (toolName !== 'Skill') process.exit(0);

const toolInput = JSON.parse(process.env.CLAUDE_TOOL_INPUT || '{}');
const skillName = toolInput.skill;
if (!skillName?.startsWith('nmforge-') && !skillName?.includes('-nmforge-')) process.exit(0);

const projectRoot = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const skillRoot = findSkillRoot(skillName, projectRoot);
if (!skillRoot) process.exit(0);

try {
  const resolved = resolveCustomize({
    skillRoot,
    layers: [
      path.join(skillRoot, 'customize.toml'),                    // shipped
      path.join(projectRoot, '_nmforge/team.toml'),               // team
      path.join(projectRoot, '_nmforge/user.toml'),               // user
    ],
    skillName,
  });
  
  // Emit system-reminder via stdout (CC consumes as injected context)
  console.log(JSON.stringify({
    type: 'system-reminder',
    content: `# Customization for ${skillName}\n${formatToml(resolved)}`,
  }));
} catch (err) {
  console.error(`[nmforge-pre-skill] ${err.message}`);
  process.exit(0);  // soft fail — don't block model
}
```

### 10.3 Features 2.1.x usadas

| Feature | Como o framework usa |
|---------|----------------------|
| `ENABLE_PROMPT_CACHING_1H=1` | Documentado, sugerido em `.env.example`, hook SessionStart pode ativar via `process.env` se permitido. Default ON na doc de instalação. |
| Skill tool nativa | **Mecanismo primário** de invocação. Todas as skills declaradas em `.claude/skills/` com frontmatter padrão. |
| Plan/Explore subagents | Skills que precisam planejar usam `Task(subagent_type="general-purpose")` com modo Plan. Não recriamos via prompt. ADR-001. |
| Deferred tools (ToolSearch) | Skills "raras" (1-2 invoke/mês) usam padrão deferred — só carregam schema quando invocadas. Reduz overhead em sessões longas. |
| `worktree.baseRef` | Documentado em how-to: "use o worktree nativo, não recriem". Opcional para usuário. AIOX errou em criar `worktree-manager.js` custom (`aiox-opus47.md:303-308`, D4.4). |
| `effort.level` | Frontmatter `effort` no SKILL casa com `$CLAUDE_EFFORT`. Hook PostToolUse loga distribution. |
| `skillOverrides` | Documentado em how-to "como sobrescrever uma skill em projeto específico". |
| `parentSettingsBehavior` | Documentado em how-to "settings em monorepo". |
| `sandbox.bwrapPath` | Documentado em reference, opcional. |

---

## 11. CLI

### 11.1 Comandos do CLI

```bash
# Instalação
nmforge install [--modules <list>] [--directory <path>] [--yes]
nmforge install --modules core,analysis,test --yes  # CI mode

# Validação
nmforge validate [--strict] [--skill <name>] [--rule <id>] [--json]
nmforge validate --strict --json > validation.json  # CI

# Diagnóstico
nmforge doctor [--verbose] [--fix]
# Output: modelo configurado, versão CC, prompt cache status, anti-patterns,
# refs órfãs, métricas das últimas N sessões.

# Benchmark (v0.3+)
nmforge benchmark [--skill <name>] [--scenarios <count>]

# Scaffolding
nmforge skill create <name> [--module <module>] [--template <template>]
nmforge module create <name> [--template <template>]

# Utilities
nmforge catalog                      # gera/exibe catálogo de skills (registry)
nmforge graph [--out <file>]         # exibe DAG de skills (mermaid)
nmforge customize [--skill <name>]   # editor interativo de customize.toml
nmforge uninstall [--module <name>]
nmforge upgrade [--module <name>] [--channel stable|next]
```

### 11.2 Flags globais

```
--cwd <path>          Trabalha em outro diretório que não cwd
--config <file>       Usa config alternativo
--quiet               Suprime output não-essencial
--json                Output JSON (parsing por CI/scripts)
--no-color            Desabilita cores
--version             Exibe versão
--help                Help
```

### 11.3 Implementação

**Stack:**
- **Commander.js** (modelo BMAD `tools/installer/bmad-cli.js`) — maduro, simples, CLI declarativo.
- **@clack/prompts** (também BMAD) — prompts interativos modernos, bonitos.
- **chalk** para cores (best-of-breed, leve).
- **execa** para subprocessos (Node nativo, mais ergonômico que `child_process`).
- **conf** ou **cosmiconfig** para leitura de config.

**Tamanho alvo:** CLI bin < 500 linhas por arquivo. Lógica em `packages/cli/src/commands/*.ts`.

---

## 12. Estratégia de Release

### 12.1 Channels (lição BMAD v6.4)

| Channel | Uso | Atualização |
|---------|-----|-------------|
| `stable` | Default em `npx nmforge install` | Releases manuais aprovados, semver respeitado |
| `next` | `npx nmforge install --channel next` | Releases pré-lançamento, podem quebrar |
| `pinned` | `npm install @nmforge/core@0.1.5` | Versão exata fixada por usuário |

### 12.2 Cadência

- **Semanas 1-8 (MVP):** sem cadência fixa, releases conforme features.
- **Pós-0.1:** patches a cada 1-2 semanas se necessário; minors a cada 4-6 semanas; majors a cada 6-9 meses.
- **Critério de patch:** bugfix de regressão ou docs.
- **Critério de minor:** nova skill, nova regra de validator, nova feature CLI sem quebrar API.
- **Critério de major:** breaking change em API pública (frontmatter spec, module.yaml spec, CLI commands).

### 12.3 Semantic-release

**Decisão (ADR-011):** semantic-release **manual nos primeiros 6 meses**. Após v1.0, considerar adoção do tool `semantic-release` se o overhead de release manual virar gargalo.

**Razão:** AIOX tem 2 changelogs inconsistentes provavelmente por semantic-release mal-configurado (`aiox-opus47.md:184-189`, D2.3). Simplicidade > automação no início.

### 12.4 Backward compatibility (semver real)

**Política:**
- Frontmatter spec é API pública. Mudança breaking → major bump.
- `module.yaml` spec é API pública. Idem.
- Regras do validator: adicionar nova regra `warn` é minor; adicionar `fail` é major (porque quebra builds).
- CLI commands: remover ou renomear comando é major. Adicionar flag opcional é minor.
- Hooks: mudar contrato (env vars consumidas) é major.

### 12.5 Como users fazem upgrade

```bash
nmforge upgrade                    # upgrade core para latest stable
nmforge upgrade --module analysis  # upgrade só um módulo
nmforge upgrade --channel next     # mover pra next
nmforge upgrade --check            # só lista o que mudaria, sem aplicar
```

---

## 13. Open Source / Community

### 13.1 License

**MIT** (default open-source, modelo BMAD).

### 13.2 CONTRIBUTING.md (outline)

```
# Contributing to NMforge

## Quick start
1. Fork + clone
2. `corepack enable && pnpm install`
3. `pnpm test` (deve passar)
4. Branch, commit, PR

## Antes de abrir PR
- [ ] Testes passam (`pnpm test`)
- [ ] Validator passa (`pnpm validate:skills --strict`)
- [ ] Lint passa (`pnpm lint`)
- [ ] Docs atualizadas se necessário
- [ ] CHANGELOG.md atualizado (sob "Unreleased")

## Tipos de contribuição
- Bugfix: PR direto, link issue
- Nova feature: abra discussion antes
- Nova skill: siga template de `nmforge skill create`
- Novo módulo: siga template de `nmforge module create`

## Code style
- Prettier + ESLint (auto via pre-commit)
- Markdown segue _STYLE_GUIDE.md
- Commits: [Conventional Commits](https://www.conventionalcommits.org/)

## Idioma
- Código: EN
- Comments: EN (preferencial) ou PT
- Docs: PT primeiro, EN secundário (ver ADR-013)
- Issues/PRs: PT ou EN, ambos OK
```

### 13.3 Code of Conduct

**Contributor Covenant v2.1** (link: https://www.contributor-covenant.org/version/2/1/code_of_conduct/).

### 13.4 Issue templates

```
.github/ISSUE_TEMPLATE/
├── bug-report.yml          # Reproduzir, esperado, atual, ambiente
├── feature-request.yml     # Problema, solução proposta, alternativas
├── new-skill.yml           # Proposta de skill, fase, motivo
└── documentation.yml       # Que doc, que problema
```

### 13.5 Discussion forum

**GitHub Discussions** (categorias):
- General
- Q&A
- Show & Tell (mostre seu uso)
- Ideas
- Polls
- Module proposals

### 13.6 Marketplace de extensions

**MVP (v0.1):** sem marketplace, apenas npm namespace `@nmforge/*` para oficiais.

**v0.3:** página `nmforge.com/modules` lista módulos descobertos via npm search por keyword `nmforge-module`.

**v1.0:** marketplace com:
- Listagem auto-gerada de packages npm com keyword `nmforge-module`.
- Metadata: stars GitHub, downloads, última atualização, compatibility matrix.
- Verificação opcional ("verified by NMforge team") para módulos premium.
- Filtros por phase, by author, etc.

**Não fazer:** marketplace pago / paywall / curadoria editorial pesada. BMAD demorou 2 anos pra "marketplace coming"; vamos com simples.

---

## 14. Riscos e Mitigações

| # | Risco | Probabilidade | Impacto | Mitigação |
|---|-------|---------------|---------|-----------|
| R1 | **Replicar dívida do BMAD por inércia** (cair em XML soup, persona obrigatória, etc.) | Média | Alto | Validator com regras `R-OP47-*` rejeita anti-patterns automaticamente; CONSTITUTION.md reforça princípios; spike inicial obrigatório de validator antes de skills core. |
| R2 | **Usuário (Vinicius) abandonar projeto** (energia, contexto, vida) | Média | Alto | MVP enxuto entregável em 6-8 semanas; 5 skills core, não 50; cobertura completa garante que código resta funcional mesmo sem evolução. Documentação fundadora (DESIGN, CONSTITUTION) permite outros pegarem. |
| R3 | **BMAD-METHOD lança v7 com features parecidas** (prompt cache 1h, deferred tools) | Média | Médio | Foco em **4.7-native como diferencial defensável**; PT-BR primary como nicho alavancável; module system + persona opt-in são bets concretos onde já saímos na frente. |
| R4 | **Claude Code 2.2.x quebra hooks API** | Baixa | Alto | Hook layer abstraído em `@nmforge/hooks` package — mudança em 1 ponto. Tests de integração contra mock detectam early. Subscription a release notes da Anthropic. |
| R5 | **Skill validator engessa demais** (contributors abandonam por estrita) | Média | Médio | Regras `R-INF-*` são warns por padrão; `--strict` é opt-in (CI). Documentação clara de "como justificar exceção". Issue template para pedir relaxamento. |
| R6 | **Adoção zero pós-launch** (50 stars, sem comunidade) | Média | Alto | PT-BR primary alavanca BR community (alvo: 50+ membros canal Discord/Telegram em 6 meses); post estratégico em Reddit/Hacker News no release; alinhamento com influencers BR de IA. |
| R7 | **Confusão de naming** (NMforge colide com outro projeto) | Baixa | Médio | Verificação npm + GitHub antes do commit final; alternativas Synkra/Forja/Conduit/Skein no banco. Domain disponível obrigatório. |
| R8 | **Performance dos hooks Node degrada UX** (latency > 100ms) | Baixa | Médio | Benchmark em CI; budget de 100ms por hook; fallback noop se exceder timeout. |
| R9 | **Subprocess Python como dependência transitiva** (dev terceiro adiciona) | Baixa | Baixo | Validator detecta uso de `python3` em hooks/scripts core e warn. Documentação proíbe explicitamente em CONSTITUTION (P1). |
| R10 | **Modelo Opus 4.7 fica desatualizado em 6 meses** (Opus 5.0 lança) | Alta | Baixo (na verdade) | Princípio P2: framework é Opus 4.7-aware mas model-agnostic. Frontmatter `effort` e regras de hygiene servem para 4.x e 5.x. Update doc, não código. |

---

## 15. Próximas Ações (concretas, executáveis)

> Lista pós-aprovação do usuário. Marcar `[x]` conforme executar. Cada ação tem dono (todas Vinicius por enquanto), estimativa.

### Fase A — Setup (semana 1)

1. [ ] **Decidir nome** (escolher dentre os 5 propostos na Seção 0). _Recomendação: NMforge._ — 30 min
2. [ ] **Verificar disponibilidade:** `npm view <nome>`, `gh search repos <nome>`, `whois <nome>.dev`. — 15 min
3. [ ] **`mkdir -p ~/dev/nmforge/`** + `cd ~/dev/nmforge/` + `git init`. — 5 min
4. [ ] **Primeiro commit:** este `DESIGN.md` + `CONSTITUTION.md` derivada (8 princípios) + `README.md` mínimo + `LICENSE` (MIT). — 1h
5. [ ] **Criar repo no GitHub** (público, MIT) e push. Configurar branch protection em `main`. — 30 min
6. [ ] **Setup do monorepo:** `pnpm init`, configurar workspaces (`packages/*`, `skills/*`, `modules/*`), `pnpm-workspace.yaml`, `.nvmrc` (20). — 1h
7. [ ] **Setup CI:** `.github/workflows/ci.yml` com lint + test + validate-skills (esboço Seção 7.6). — 2h
8. [ ] **Setup linting:** ESLint + Prettier + markdownlint + commitlint. — 2h

### Fase B — Spikes técnicos (semana 2-3)

9. [ ] **Spike: skill-validator com 5 regras iniciais** (R-DET-01, 02, 03, 10, 12) em TypeScript. Testes para cada regra. — 6h
10. [ ] **Spike: hook PreSkill em Node** (resolução TOML 3 camadas, injection via stdout). Testes integração. — 8h
11. [ ] **Spike: customize-resolver standalone package** (`@nmforge/customize-resolver`). 90% cobertura. — 6h
12. [ ] **Spike: CLI esqueleto** (`nmforge --help`, `nmforge validate`, `nmforge doctor` stubs). — 4h

### Fase C — Skills core (semana 4-5)

13. [ ] **Implementar `nmforge-help`** (router, lê registry, sugere próximo passo). — 6h
14. [ ] **Implementar `nmforge-doctor`** (audita projeto, modelo, anti-patterns). — 8h
15. [ ] **Implementar `nmforge-customize`** (guia interativo de TOML). — 4h
16. [ ] **Implementar `nmforge-skill-create`** (scaffold). — 6h
17. [ ] **Implementar `nmforge-validate`** (wrapper amigável). — 3h
18. [ ] **Para cada skill: SKILL.md + checklist.md + steps-v/01.md mínimo + tests.** — 4h × 5 = 20h

### Fase D — Documentação (semana 6)

19. [ ] **`README.md` PT completo** (install, quick start, why, links). — 3h
20. [ ] **`README.md` EN essencial** (translate + revisão). — 1h
21. [ ] **`CONSTITUTION.md`** finalizada (8 princípios + parágrafos de contexto). — 2h
22. [ ] **Tutorial 1:** "Sua primeira skill em 10 minutos" (PT). — 4h
23. [ ] **Reference completo:** frontmatter spec, validator rules, CLI, hooks. — 6h
24. [ ] **CONTRIBUTING.md + CODE_OF_CONDUCT.md.** — 1h

### Fase E — Validation pré-release (semana 7)

25. [ ] **1 dev externo testa tutorial** (peer review do onboarding). — coordenação 2h + 1 dev externo 1h
26. [ ] **`nmforge validate --strict` no próprio repo** zero warnings. — debugging 4h
27. [ ] **Cobertura unit ≥ 85% global, 95% validator/CLI** confirmada. — 4h
28. [ ] **CI verde em 3 OS-builds:** macOS, Ubuntu (Windows opcional). — 3h

### Fase F — Release (semana 8)

29. [ ] **Publicar `@nmforge/core@0.1.0`** no npm. — 1h
30. [ ] **Tag `v0.1.0` + GitHub Release** (com release notes derivadas do CHANGELOG). — 1h
31. [ ] **Anúncio:** post em r/ClaudeAI, r/programming, Discord BR de IA, LinkedIn pessoal. — 3h
32. [ ] **Setup GitHub Discussions** com categorias iniciais. — 30 min
33. [ ] **Monitoramento primeira semana:** responder issues e PRs ≤ 24h. — variável

**Total estimado:** ~120-150 horas de trabalho efetivo. A 15-20h/semana de tempo dedicado: **6-8 semanas calendário**.

---

## Apêndices

### A. Tabela comparativa rápida (Diferenciação)

> 22 dimensões × 4 frameworks. Linhas críticas marcadas.

| Dimensão | NMforge (proposta) | BMAD v6.6 | AIOX 5.1 | CC-BMAD-skills |
|----------|---------------------|-----------|----------|----------------|
| **Modelo hardcoded** | **Nunca** (env var) | Nunca | claude-3-5-sonnet | "Sonnet 4.6 / Opus 4.6" comentário |
| **Stack runtime** | Node 20+ | Node 20+ + Python 3.10+ + uv | Node 18+ | Bash ou PowerShell |
| **Distribuição** | npm + npx | npm + npx | npm | install.sh / install.ps1 |
| **License** | MIT | MIT | (privado/OSS pequeno) | MIT |
| **Stars (snapshot)** | 0 | 46.6K | privado | 418 |
| **Persona obrigatória** | **Não** (opt-in) | Sim | Sim | Não (removida) |
| **Activation ritual** | **Hook nativo** | 8 steps + Python subprocess | 5 steps embedded YAML | Não tem |
| **Skill-validator** | **Sim** (15-20 regras + Opus 4.7 hygiene) | Sim (19 regras) | Não | Não |
| **Customization layers** | TOML 3 camadas | TOML 4 camadas | YAML embedded | Sem |
| **Subprocess Python** | **Nunca** | Toda ativação | Não | Não |
| **Módulos npm externos** | **Sim** (dia 1) | Sim | Não (monorepo) | Não |
| **Module manifest** | YAML declarativo (lição WDS) | YAML | (não tem) | (não tem) |
| **Help/router skill** | **Sim** (`nmforge-help`) | Sim (`bmad-help`) | Não | Não |
| **Tri-modal step files (C/E/V)** | **Sim** (lição TEA) | Parcial | Não | Não |
| **Knowledge fragments tier-loaded** | Sim (v0.2+) | Não | Não (mas SYNAPSE tenta) | Não |
| **Helper pattern referenciado** | **Sim** | Sim | Não | Sim |
| **Subagent patterns documentados** | **Sim** | Parcial (`bmad-party-mode`) | Parcial | **Sim** (`SUBAGENT-PATTERNS.md`) |
| **`allowed-tools` no frontmatter** | **Obrigatório** (validator) | Não | Não | Sim |
| **`effort` no frontmatter** | **Sim** (hooks reagem) | Não | Não | Não |
| **`token_budget` no frontmatter** | **Sim** (validator quebra) | Não | Não | Não |
| **Prompt cache 1h documentado** | **Default ON** | Não | Não | Não |
| **Deferred tools / ToolSearch** | **First-class** | Não | "indisponível" (errado) | Não |
| **Hooks `$CLAUDE_*` env vars** | **Todos** | Não | Parcial (1 ref) | **Sim** (3 hooks) |
| **`Plan`/`Explore` subagents** | **First-class** | Não | Não | Não |
| **`worktree.baseRef` usado** | Documentado | Não | Não (custom worktree-manager) | Não |
| **Test-first como gate** | **Sim** (lição TEA) | Parcial (CI maduro mas não comportamento) | Parcial | Não |
| **Diataxis docs + style guide** | **Sim** | Sim | Não | Parcial |
| **i18n docs** | **PT primary, EN secondary** | EN primary (5 idiomas) | Mistura | EN |
| **Channels release** | stable/next/pinned | stable/next | (não tem) | (não tem) |
| **Marketplace de extensions** | Roadmap dia 30 (v1.0) | "Coming" há 2 anos | Não | Não |
| **`<critical>` count em src/** | **≤ 5 / skill** (regra) | 297 | 150 | 0 |
| **`STAY IN CHARACTER` count** | **0 (banido)** | 0 | 25+ | 0 |
| **Maior SKILL/agent file** | **≤ 200 linhas** (regra) | 1.512 (`bmad-retrospective`) | 1.575 (`squad-chief`) | < 250 |

### B. Glossário

| Termo | Definição |
|-------|-----------|
| **Skill** | Pacote auto-contido (pasta com `SKILL.md` + `checklist.md` + opcionalmente `customize.toml`, `steps-c/e/v/`, `resources/`, `scripts/`). Unidade de capacidade reutilizável invocável via Skill tool nativa do Claude Code 2.1.x. |
| **Module** | npm package que entrega 1+ skills + opcionalmente hooks + diretórios + prompts de instalação. Manifesto declarado em `module.yaml`. Distribuído como `@nmforge/<name>` ou `@<org>/nmforge-<name>`. |
| **Agent** | Em NMforge: skill com `persona-mode: named` ou `full`. Não é entidade separada como em BMAD. (Em BMAD: agent = persona dedicada com customize.toml próprio.) |
| **Persona** | Conjunto de traços de comunicação (nome, ícone, vocabulário, linguagem). Opt-in em NMforge via `persona-mode`. |
| **Hook** | Script Node (CJS) acionado pelo Claude Code em eventos (SessionStart, PreToolUse, PostToolUse, etc.). NMforge hooks consomem env vars `$CLAUDE_*`. |
| **Customize** | Override de behavior de skill via TOML em 3 camadas (shipped → team → user). Resolvido em Node nativo, sem subprocess Python. |
| **Phase** | Estágio do workflow conceitual: analysis / planning / solutioning / implementation / meta. Frontmatter declara; help router agrupa. |
| **Step file** | Arquivo dentro de `steps-c/`, `steps-e/`, ou `steps-v/`. Carregado just-in-time pelo modelo durante execução de skill. |
| **Checklist** | Arquivo `checklist.md` na raiz da skill. Lista critérios de aceitação testáveis. Obrigatório (regra `R-DET-10`). |
| **Validator** | Programa Node que aplica 15-20 regras determinísticas + Opus 4.7 hygiene a SKILL.md files. Falha CI se regras `fail` violadas. |
| **Help router** | Skill (`nmforge-help`) que descobre estado do projeto e recomenda próximo passo. Modelo direto do BMAD `bmad-help`. |
| **Effort** | `low | medium | high`. Casa com `$CLAUDE_EFFORT`. Hooks ajustam injection. Frontmatter declara default por skill. |
| **Token budget** | Estimativa de tokens de input que SKILL.md consome. Validator quebra build se exceder budget × 1.2. |
| **Tri-modal** | Padrão de pasta de skill com `steps-c/` (Create), `steps-e/` (Edit), `steps-v/` (Validate). Lição direta TEA. |
| **Diataxis** | Framework de documentação em 4 quadrantes: tutorials / how-to / reference / explanation. Adotado para docs do projeto. |
| **Constitution** | Documento `CONSTITUTION.md` com 8 princípios fundadores. Não-negociável. |
| **NMforge** | (placeholder do nome) Framework descrito neste documento. Decisão final na Seção 0. |

### C. Referências

**Insumos de discovery (relatórios próprios):**
- `/Users/viniciuscaetano/research/analises/aiox-opus47.md` — Análise AIOX v5.1.15 (491 linhas, 27 findings).
- `/Users/viniciuscaetano/research/analises/aiox-impacto-projetos.md` — Mapeamento projetos do usuário (471 linhas).
- `/Users/viniciuscaetano/research/analises/bmad-analise.md` — Análise BMAD v6.6.0 + variantes (734 linhas).

**Repos analisados:**
- `BMAD-METHOD` v6.6.0 (`/Users/viniciuscaetano/research/repos/BMAD-METHOD/`) — referência principal de arquitetura modular.
- `claude-code-bmad-skills` (aj-geddes, `/Users/viniciuscaetano/research/repos/claude-code-bmad-skills/`) — referência de skills funcionais sem persona + hooks env vars.
- `bmad-method-test-architecture-enterprise` (TEA, `/Users/viniciuscaetano/research/repos/bmad-method-test-architecture-enterprise/`) — referência de tri-modal step files + knowledge tier-loading + test-first.
- `bmad-method-wds-expansion` (WDS v0.3.1, `/Users/viniciuscaetano/research/repos/bmad-method-wds-expansion/`) — referência de `module.yaml` declarativo.
- `aiox-core` v5.1.15 (`/Users/viniciuscaetano/research/repos/aiox-core/`) — anti-referência (o que não fazer).

**Docs Claude Code 2.1.x:**
- Anthropic Claude Code official docs (https://docs.claude.com/en/docs/claude-code/) — Skill tool, Hooks, Plan/Explore, deferred tools, prompt caching.
- Hooks documentation (eventos: SessionStart, UserPromptSubmit, PreToolUse, PostToolUse, PreCompact).
- Settings reference (skillOverrides, parentSettingsBehavior, sandbox, worktree.baseRef).

**Inspirações conceituais:**
- Diataxis framework (https://diataxis.fr/) — estrutura de docs.
- Conventional Commits (https://www.conventionalcommits.org/) — commits.
- Contributor Covenant v2.1 — Code of Conduct.
- Semver real (https://semver.org/) — versionamento.
- BMAD `_STYLE_GUIDE.md` (em `BMAD-METHOD/docs/_STYLE_GUIDE.md`) — referência de style guide.

**Tooling considerado:**
- Vitest (test runner — escolhido).
- Commander.js + @clack/prompts (CLI — escolhido, modelo BMAD).
- Astro/Starlight (docs site — escolhido, modelo BMAD).
- pnpm workspaces (monorepo — escolhido).
- TypeScript (linguagem do core — implícito; skills são markdown puro).

---

*Fim do Design Doc v0.1. Total: ~1.250 linhas. Aprovação do usuário desbloqueia execução das Próximas Ações (Seção 15).*
