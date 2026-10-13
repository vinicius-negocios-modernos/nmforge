/**
 * R-AS-01 — `name` no formato do padrão aberto Agent Skills.
 *
 * 1–64 caracteres, só minúsculas, dígitos e hífens, sem hífen no início, no fim
 * ou repetido. O claude.ai também recusa nomes com "claude" ou "anthropic".
 */

import type { Rule, RuleViolation } from '../types.js';

const MAX_LENGTH = 64;
const FORMAT = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const RESERVED = ['claude', 'anthropic'];

export const ruleAs01: Rule = {
  id: 'R-AS-01',
  category: 'agentskills',
  severity: 'fail',
  profiles: ['agentskills'],
  description: `Frontmatter \`name\` must be 1-${MAX_LENGTH} chars of lowercase letters, digits and single hyphens, without reserved words.`,
  check(ctx) {
    const name = ctx.frontmatter?.['name'];
    if (typeof name !== 'string' || name.trim().length === 0) {
      return [
        {
          ruleId: this.id,
          severity: this.severity,
          message: 'Frontmatter `name` is missing or empty.',
        },
      ];
    }
    const violations: RuleViolation[] = [];
    if (name.length > MAX_LENGTH) {
      violations.push({
        ruleId: this.id,
        severity: this.severity,
        message: `Frontmatter \`name\` has ${name.length} chars (max ${MAX_LENGTH}).`,
      });
    }
    if (!FORMAT.test(name)) {
      violations.push({
        ruleId: this.id,
        severity: this.severity,
        message: `Frontmatter \`name\` "${name}" must use only lowercase letters, digits and single hyphens, not starting or ending with a hyphen.`,
      });
    }
    const reserved = RESERVED.filter((w) => name.toLowerCase().includes(w));
    if (reserved.length > 0) {
      violations.push({
        ruleId: this.id,
        severity: this.severity,
        message: `Frontmatter \`name\` contains reserved word(s): ${reserved.join(', ')}.`,
      });
    }
    return violations;
  },
};
