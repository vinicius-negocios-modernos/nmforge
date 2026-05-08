# How-to — Ativar prompt cache de 1 hora

> **Problema:** sessões com muitas skills consomem tokens repetidamente nos mesmos prompts.
> **Solução:** habilitar `ENABLE_PROMPT_CACHING_1H` no `.claude/settings.json`.

Anthropic cobra ~10% do preço normal para tokens em cache. Em sessões skill-heavy, economia chega a 70%+ no input.

---

## Quando ativar

Sempre. NMforge é projetado para sessões com múltiplas invocações de skill — exatamente o caso onde cache 1h paga.

Casos onde NÃO ajuda:

- Sessão one-shot de 1-2 mensagens.
- Conversa em que o system prompt muda a cada turno (raro).

## Passo a passo

### 1. Localize ou crie `.claude/settings.json`

```bash
ls .claude/settings.json 2>/dev/null || mkdir -p .claude
```

### 2. Adicione a env var

Se o arquivo não existe, crie:

```bash
cat > .claude/settings.json <<'JSON'
{
  "env": {
    "ENABLE_PROMPT_CACHING_1H": "true"
  }
}
JSON
```

Se já existe, mescle a chave `env` manualmente (não sobrescreva o resto).

### 3. Reinicie a sessão

Feche e reabra o Claude Code. Env vars são lidas no boot.

### 4. Verifique

Rode `nmforge doctor`:

```bash
node packages/cli/bin/nmforge.js doctor
```

Esperado:

```
[✓] ENABLE_PROMPT_CACHING_1H in settings  enabled
```

## Como medir o ganho

A API expõe métricas em `usage.cache_creation_input_tokens` e `usage.cache_read_input_tokens`. No Claude Code 2.1.x, isso aparece nos logs de uso da conta:

- **Primeira invocação** da skill: tokens vão para `cache_creation` (preço normal + ~25%).
- **Próximas 60 minutos**: mesmas seções viram `cache_read` (preço ~90% off).

Em uma sessão de 10 invocações da mesma skill, expectativa: 1 creation + 9 reads → economia ~70-80% no input dessa skill.

## Estratégia: o que cachear

NMforge prioriza cache em:

- **Prompt do sistema do Claude Code** — cacheia por padrão.
- **SKILL.md** — uma vez carregada, fica em cache.
- **Step files (`steps-*/`)** — quando referenciados.
- **Resources** (arquivos longos sob `resources/`) — cacheiam ao serem lidos.

## Anti-pattern

Não confunda cache 1h com cache 5min (default antigo). 1h é a TTL longa, ideal para sessões de trabalho. Mais detalhes: <https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching>.

## Ver também

- [Reference: hooks](../reference/hooks.md) — SessionStart pode injetar config.
- [DESIGN.md §10](../../DESIGN.md) — features 2.1.x.
- [CONSTITUTION.md P1](../../CONSTITUTION.md) — native-first.
