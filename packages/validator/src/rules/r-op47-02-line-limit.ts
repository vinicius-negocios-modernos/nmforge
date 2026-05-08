/**
 * R-OP47-02 — SKILL.md body ≤ 200 linhas.
 *
 * Anti-pattern: workflows-monstro como bmad-retrospective.md (1.512 linhas)
 * ou bmad-dev-story.md (485). Skills longas devem ser quebradas em sub-skills
 * ou step files (steps-c/, steps-e/, steps-v/).
 */

import type { Rule } from '../types.js';

const MAX_LINES = 200;

export const ruleOp4702: Rule = {
  id: 'R-OP47-02',
  category: 'opus47-hygiene',
  severity: 'warn',
  description: `SKILL.md body must be ≤ ${MAX_LINES} lines (Opus 4.7 hygiene; split into sub-skills or step files if larger).`,
  check(ctx) {
    const lines = ctx.body.split('\n').length;
    if (lines <= MAX_LINES) return [];
    return [
      {
        ruleId: this.id,
        severity: this.severity,
        message: `SKILL.md body is ${lines} lines (limit: ${MAX_LINES}). Consider splitting into sub-skills or moving content to steps-c/, steps-e/, steps-v/, or resources/.`,
      },
    ];
  },
};
