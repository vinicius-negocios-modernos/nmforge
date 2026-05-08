/**
 * R-DET-02 — `description` deve ser ≥ 1 frase e conter o substring "Use when:".
 *
 * Sem "Use when:" o modelo não sabe quando disparar a skill via Skill tool.
 */

import type { Rule } from '../types.js';

export const ruleDet02: Rule = {
  id: 'R-DET-02',
  category: 'deterministic',
  severity: 'fail',
  description:
    'Frontmatter `description` must be present, contain at least one sentence, and include "Use when:" trigger.',
  check(ctx) {
    const description = ctx.frontmatter?.['description'];
    if (typeof description !== 'string' || description.trim().length === 0) {
      return [
        {
          ruleId: this.id,
          severity: this.severity,
          message: 'Frontmatter `description` is missing or empty.',
        },
      ];
    }
    const trimmed = description.trim();
    if (trimmed.length < 10) {
      return [
        {
          ruleId: this.id,
          severity: this.severity,
          message: `Frontmatter \`description\` is too short (${trimmed.length} chars). Provide at least one full sentence.`,
        },
      ];
    }
    if (!/use when:/i.test(trimmed)) {
      return [
        {
          ruleId: this.id,
          severity: this.severity,
          message:
            'Frontmatter `description` must contain "Use when:" trigger so the model knows when to invoke the skill.',
        },
      ];
    }
    return [];
  },
};
