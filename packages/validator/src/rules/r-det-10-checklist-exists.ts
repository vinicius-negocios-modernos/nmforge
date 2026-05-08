/**
 * R-DET-10 — `checklist.md` deve existir na pasta da skill.
 *
 * Test-first como gate (P5 do CONSTITUTION). Sem critérios de aceitação,
 * skill não é completável.
 */

import type { Rule } from '../types.js';

export const ruleDet10: Rule = {
  id: 'R-DET-10',
  category: 'deterministic',
  severity: 'fail',
  description: 'Skill folder must contain `checklist.md` (test-first gate, P5).',
  check(ctx) {
    const hasChecklist = ctx.files.some(
      (f) => f === 'checklist.md' || f.toLowerCase() === 'checklist.md'
    );
    if (!hasChecklist) {
      return [
        {
          ruleId: this.id,
          severity: this.severity,
          message:
            '`checklist.md` not found in skill folder. Required by P5 (test-first as release gate).',
        },
      ];
    }
    return [];
  },
};
