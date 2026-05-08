# Explanation — Por que ser Opus 4.7-aware muda o design

> Frameworks pré-Opus 4.7 foram otimizados para modelos que precisavam de prompts longos, persona obrigatória e ritual de ativação. Opus 4.7 não precisa nada disso. NMforge é projetado para o modelo que existe, não para o que existia.

---

## A regra geral

**Opus 4.7 é eficiente com prompts curtos. Cada token extra é custo sem retorno.**

Frameworks BMAD-style assumem que precisam:

- Reforçar identidade ("STAY IN CHARACTER").
- Repetir invariantes em CAPS LOCK ("MUST" 185x em src/).
- Listar passos numerados de 30+ itens.
- Carregar 1.500+ linhas de workflow inline.

Tudo isso reduz qualidade do thinking nativo do Opus 4.7. Não melhora.

## O que muda concretamente

### Sem ritual de ativação inflado

BMAD: ~57 linhas no topo da skill antes do primeiro passo útil.
NMforge (R-OP47-08): ≤ 30 linhas. Ideal: zero. O frontmatter já dá contexto.

### Sem persona obrigatória

Opus 4.7 segue instruções claras sem precisar adotar persona "John, Senior Developer". Persona aumenta tokens e às vezes empurra o modelo para padrões de role-play que perdem precisão técnica.

NMforge: `persona-mode: minimal` é default. Quem quer ativa `named` ou `full`.

### Sem repetição defensiva

`MUST do X. MUST NOT do Y. CRITICAL: do Z.` repetido a cada parágrafo trata o modelo como adversário. Opus 4.7 segue uma instrução clara dada uma vez.

NMforge: R-OP47-07 (≤ 5 `MUST`), R-OP47-01 (≤ 5 `CRITICAL:`).

### Reads em paralelo, não sequencial

Opus 4.7 pode invocar múltiplas tools numa única mensagem. Listar 4 reads sequenciais força serialização desnecessária.

```markdown
❌ Antes:
1. Read X
2. Read Y
3. Read Z

✅ Depois:
Em paralelo, leia X, Y, Z (uma única mensagem, 3 Read tools).
```

R-OP47-03 sinaliza esse anti-pattern.

### Subagents para paralelismo real

`Task(subagent_type="Explore")` permite parallelização que vai além de tools paralelas — cada subagent tem seu próprio contexto.

NMforge expõe isso via `subagent-pattern: parallel | fan-out` no frontmatter.

### Prompt cache 1h por default

Sessão skill-heavy invoca a mesma SKILL.md várias vezes. Sem cache, paga preço cheio em cada uma. Com cache 1h, paga ~10% nas reinvocações.

Frameworks pré-2.1.x não documentam isso. NMforge faz cache 1h **default ON** ([How-to: ativar prompt cache](../how-to/ativar-prompt-cache-1h.md)).

### Deferred tools

Schemas só carregam quando necessários. Reduz prompt inicial. Hooks do NMforge respeitam isso.

## Token budget como gate

Cada SKILL.md declara `token_budget`. Validator R-OP47-06 quebra build se body exceder `budget × 1.2`.

Por quê:

- Disciplina de tamanho desde o dia 1.
- CI prevenindo "creep" de prompt inflado.
- Sinal claro: skill > 2500 tokens? Hora de splitar em sub-skills.

## O que NÃO é Opus 4.7-aware

- Hardcodar modelo (P2 — model-agnostic).
- Otimizar tanto que perde clareza humana — docs e SKILL.md devem ser lidos por gente também.
- Confundir "curto" com "vago". Opus 4.7 ainda precisa de instrução precisa, só não precisa de cerimônia.

## Quando isso pode mudar

Quando Anthropic lançar 4.8 ou 5.0 com características diferentes (ex.: prompt curto perde algo), revisitamos. Por isso P2: framework é otimizado para 4.7, mas o `model` é decisão do usuário via env var.

## Ver também

- [Reference: validator-rules](../reference/validator-rules.md) — todas as regras Opus 4.7 hygiene.
- [`CONSTITUTION.md` P2/P3/P4](../../CONSTITUTION.md)
- [How-to: ativar prompt cache 1h](../how-to/ativar-prompt-cache-1h.md)
