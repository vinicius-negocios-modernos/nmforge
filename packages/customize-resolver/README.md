# @nmforge/customize-resolver

Resolve `customize.toml` em 3 camadas (shipped → team → user) com deep merge,
em Node puro — **sem subprocess Python** (vide ADR-002 do DESIGN).

## Uso

```ts
import { resolveCustomize } from '@nmforge/customize-resolver';

const result = await resolveCustomize({
  skillRoot: '/abs/path/to/skill',
  skillName: 'nmforge-help',
  layers: [
    `${skillRoot}/customize.toml`,
    `${projectRoot}/_nmforge/team.toml`,
    `${projectRoot}/_nmforge/user.toml`,
  ],
});

console.log(result.merged);     // objeto resultante
console.log(result.layersUsed); // arquivos efetivamente lidos
console.log(result.errors);     // erros não-fatais (layer pulada)
```

## Regras de merge

- Scalars: override (later wins).
- Arrays de scalars: REPLACE.
- Arrays de tables com chave (`code` / `id` / `name`): merge por chave.
- Tables: merge profundo recursivo.
- Inputs imutáveis (clone-and-merge).

## License

MIT © Vinicius Caetano
