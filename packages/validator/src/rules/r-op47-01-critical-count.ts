/**
 * R-OP47-01 — Body do SKILL.md tem ≤ 5 ocorrências de `CRITICAL:` ou `<critical>`.
 *
 * Anti-pattern documentado: BMAD-METHOD acumula 297 dessas tags em src/,
 * AIOX 150. Para Opus 4.7, gasta tokens "performando obediência" às críticas
 * em vez de pensar.
 */

import type { Rule } from '../types.js';

const CRITICAL_RE = /CRITICAL:|<critical>/g;
const MAX_ALLOWED = 5;

export const ruleOp4701: Rule = {
  id: 'R-OP47-01',
  category: 'opus47-hygiene',
  severity: 'warn',
  description: `Body must contain at most ${MAX_ALLOWED} occurrences of \`CRITICAL:\` or \`<critical>\` (Opus 4.7 hygiene).`,
  check(ctx) {
    const matches = ctx.body.match(CRITICAL_RE);
    const count = matches ? matches.length : 0;
    if (count <= MAX_ALLOWED) return [];
    return [
      {
        ruleId: this.id,
        severity: this.severity,
        message: `Body has ${count} occurrences of CRITICAL:/<critical> (limit: ${MAX_ALLOWED}). Trust the model — Opus 4.7 maintains constraints without verbal reinforcement.`,
      },
    ];
  },
};
