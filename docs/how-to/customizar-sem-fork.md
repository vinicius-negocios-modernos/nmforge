# How-to — Customizar uma skill sem fazer fork

> **Problema:** você quer mudar o comportamento default de uma skill (sua ou de um módulo externo) sem editar o `SKILL.md` original.
> **Solução:** override em `customize.toml`, em uma das 3 camadas.

---

## Modelo de 3 camadas

```
framework defaults  (declarados em cada SKILL.md → customize-keys)
        ↓ override
team       <repo>/.nmforge/customize.toml         (commitado)
        ↓ override
user       ~/.config/nmforge/customize.toml       (não-commitado)
        ↓ override
local      ./customize.local.toml                 (gitignored)
```

Resolução: deep merge imutável via `@nmforge/customize-resolver`.

## Decisão: qual camada?

| Cenário | Camada |
|---------|--------|
| "Todo mundo do time precisa" | `team` |
| "Preferência minha" | `user` |
| "Só pra esse experimento" / CI | `local` |
| Default oficial do framework | NÃO editar — abra PR |

## Passo a passo (camada team)

Você quer que toda nova skill criada no projeto vá para `modules/analysis/skills/` em vez de `skills/`.

### 1. Inspecione as chaves disponíveis

```bash
grep -A 5 "^customize-keys:" skills/nmforge-skill-create/SKILL.md
```

Saída:

```yaml
customize-keys:
  - default_module
  - skills_root
  - default_phase
```

### 2. Crie o arquivo team

```bash
mkdir -p .nmforge
cat > .nmforge/customize.toml <<'TOML'
[nmforge-skill-create.defaults]
default_module = "analysis"
TOML
```

### 3. Confirme a resolução

```bash
node -e "
import('@nmforge/customize-resolver').then(async ({resolveCustomize}) => {
  const r = await resolveCustomize({
    layers: [
      '.nmforge/customize.toml',
      process.env.HOME + '/.config/nmforge/customize.toml',
      './customize.local.toml',
    ],
  });
  console.log('Layers used:', r.layersUsed);
  console.log('Merged:', JSON.stringify(r.merged, null, 2));
});
"
```

### 4. Commit (camada team é compartilhada)

```bash
git add .nmforge/customize.toml
git commit -m "chore: customize default_module to analysis"
```

## Passo a passo (camada user)

Cenário: você prefere modo strict default no validator no seu setup pessoal.

```bash
mkdir -p ~/.config/nmforge
cat > ~/.config/nmforge/customize.toml <<'TOML'
[nmforge-validate.defaults]
default_strict = true
TOML
```

Não commite. Não compartilhe.

## Passo a passo (camada local)

Cenário: você está debugando algo e quer pular uma regra temporariamente.

```bash
cat > customize.local.toml <<'TOML'
[nmforge-validate.defaults]
rules_to_skip = ["R-OP47-08"]
TOML
```

Confirme `.gitignore`:

```bash
grep customize.local.toml .gitignore || echo "customize.local.toml" >> .gitignore
```

## Anti-patterns

- **Forkar SKILL.md** para customizar — derrota o propósito do P7.
- **Editar `customize-keys`** — só o autor da skill faz isso (são contrato público).
- **Customizar chave não declarada** — o validator não impede, mas o resolver vai mesclar e a skill vai ignorar.

## Quando NÃO funciona

Algumas skills aceitam `customize-keys` mas a lógica de leitura está em código (não no prompt). Confira `SKILL.md` da skill alvo — se mencionar leitura ativa do customize.toml, OK. Se não, talvez a skill ignore overrides nesse caminho.

## Ver também

- [Reference: customize.toml](../reference/customize-toml.md) (em breve)
- [Skill `nmforge-customize`](../../skills/nmforge-customize/SKILL.md) — guia interativo
- [DESIGN.md §9](../../DESIGN.md) — module system
