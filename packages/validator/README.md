# @nmforge/validator

Skill validator para NMforge — regras determinísticas + Opus 4.7 hygiene.

## Status

v0.1 (MVP). 5 regras implementadas: R-DET-01, 02, 03, 10, 12.
Próximas: R-OP47-01..08 (Opus 4.7 hygiene) em v0.2.

## Uso programático

```ts
import { discoverSkills, loadSkill, runValidation } from '@nmforge/validator';

const roots = await discoverSkills(process.cwd());
for (const root of roots) {
  const ctx = await loadSkill(root);
  const result = runValidation(ctx, { strict: true });
  console.log(result.skill, result.passed ? 'OK' : 'FAIL');
}
```

## Regras

Ver [DESIGN.md Seção 4](../../DESIGN.md#4--skill-validator--regras-de-opus-47-hygiene).

## License

MIT © Vinicius Caetano
