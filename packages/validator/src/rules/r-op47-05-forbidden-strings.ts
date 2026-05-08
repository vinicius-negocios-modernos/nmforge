/**
 * R-OP47-05 — Strings proibidas no body (instruções defensivas explícitas).
 *
 * Patterns como "STAY IN CHARACTER", "NO LYING OR CHEATING", "DO NOT skip
 * steps" são confissões de "não confio no modelo" e degradam Opus 4.7 — o
 * modelo gasta tokens performando obediência em vez de pensar.
 *
 * Severity: fail (não é warn — é gatekeeper P8 do CONSTITUTION).
 */

import type { Rule, RuleViolation } from '../types.js';

const FORBIDDEN: Array<{ pattern: RegExp; canonical: string }> = [
  { pattern: /\bSTAY\s+IN\s+CHARACTER\b/i, canonical: 'STAY IN CHARACTER' },
  { pattern: /\bNO\s+LYING\b/i, canonical: 'NO LYING' },
  { pattern: /\bNO\s+CHEATING\b/i, canonical: 'NO CHEATING' },
  { pattern: /\bDO\s+NOT\s+skip\s+steps\b/i, canonical: 'DO NOT skip steps' },
  { pattern: /\bDO\s+NOT\s+break\s+character\b/i, canonical: 'DO NOT break character' },
];

export const ruleOp4705: Rule = {
  id: 'R-OP47-05',
  category: 'opus47-hygiene',
  severity: 'fail',
  description:
    'Defensive anti-patterns banned: STAY IN CHARACTER, NO LYING, NO CHEATING, DO NOT skip steps, DO NOT break character (P8).',
  check(ctx) {
    const violations: RuleViolation[] = [];
    const lines = ctx.body.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i] ?? '';
      for (const f of FORBIDDEN) {
        if (f.pattern.test(line)) {
          violations.push({
            ruleId: 'R-OP47-05',
            severity: 'fail',
            message: `Forbidden defensive string detected: "${f.canonical}". Trust the model — Opus 4.7 maintains persona/intent without verbal reinforcement (CONSTITUTION P8).`,
            line: i + 1,
          });
          break; // Uma violação por linha basta.
        }
      }
    }
    return violations;
  },
};
