/**
 * R-OP47-07 — Body tem ≤ 5 ocorrências da palavra `MUST` (case-sensitive).
 *
 * Anti-pattern: BMAD-METHOD acumula 185 ocorrências de MUST em src/.
 * Imperativos em ALL-CAPS sinalizam micromanagement do modelo.
 */

import type { Rule } from '../types.js';

const MUST_RE = /\bMUST\b/g;
const MAX_ALLOWED = 5;

export const ruleOp4707: Rule = {
  id: 'R-OP47-07',
  category: 'opus47-hygiene',
  severity: 'warn',
  description: `Body should contain at most ${MAX_ALLOWED} ALL-CAPS \`MUST\` occurrences (Opus 4.7 hygiene; lowercase or alternative phrasings are equally clear).`,
  check(ctx) {
    const matches = ctx.body.match(MUST_RE);
    const count = matches ? matches.length : 0;
    if (count <= MAX_ALLOWED) return [];
    return [
      {
        ruleId: this.id,
        severity: this.severity,
        message: `Body has ${count} occurrences of \`MUST\` (limit: ${MAX_ALLOWED}). Consider lowercase ("must"), "needs to", or rephrasing as positive statement.`,
      },
    ];
  },
};
