/**
 * R-OP47-06 — Body do SKILL.md não excede `token_budget × 1.2`.
 *
 * Tokenização aproximada via heurística "1 token ≈ 4 chars" (regra de bolso
 * para EN; PT-BR fica próximo). Para tokenização precisa, instalar tiktoken
 * em v0.2.
 *
 * Se `token_budget` ausente no frontmatter, regra é skipped (não warn).
 * Skill com token_budget declarado mas sem disciplina é violação.
 */

import type { Rule } from '../types.js';

const CHARS_PER_TOKEN_APPROX = 4;
const TOLERANCE = 1.2;

function approxTokens(text: string): number {
  return Math.ceil(text.length / CHARS_PER_TOKEN_APPROX);
}

export const ruleOp4706: Rule = {
  id: 'R-OP47-06',
  category: 'opus47-hygiene',
  severity: 'fail',
  description: `Body must not exceed declared token_budget × ${TOLERANCE} (P3, ADR-009; tokenization is an approximation: chars/${CHARS_PER_TOKEN_APPROX}).`,
  check(ctx) {
    const budget = ctx.frontmatter?.['token_budget'];
    if (typeof budget !== 'number' || budget <= 0) {
      // Sem budget declarado — regra não aplicável.
      return [];
    }
    const actual = approxTokens(ctx.body);
    const limit = Math.ceil(budget * TOLERANCE);
    if (actual <= limit) return [];
    return [
      {
        ruleId: this.id,
        severity: this.severity,
        message: `Body has ~${actual} tokens (estimate, chars/${CHARS_PER_TOKEN_APPROX}); declared token_budget is ${budget}, limit ${limit}. Tighten or split into sub-skills.`,
      },
    ];
  },
};
