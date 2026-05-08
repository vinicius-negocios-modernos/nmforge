/**
 * R-DET-12 — Frontmatter YAML deve ser parseável.
 *
 * Esta regra usa o erro de parse capturado no SkillContext (preenchido
 * pelo loader). Se o frontmatter falhou ao parsear, todas as outras
 * regras que dependem dele não rodam — esta deve ser executada primeiro
 * para dar mensagem clara.
 */

import type { Rule } from '../types.js';

export const ruleDet12: Rule = {
  id: 'R-DET-12',
  category: 'deterministic',
  severity: 'fail',
  description: 'SKILL.md frontmatter must be valid YAML between --- delimiters.',
  check(ctx) {
    if (ctx.frontmatter !== null) {
      return [];
    }
    return [
      {
        ruleId: this.id,
        severity: this.severity,
        message: ctx.frontmatterError ?? 'Frontmatter is invalid or missing.',
      },
    ];
  },
};
