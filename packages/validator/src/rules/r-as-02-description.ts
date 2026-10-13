/**
 * R-AS-02 — `description` no padrão aberto Agent Skills.
 *
 * Obrigatória, 1–1024 caracteres, dizendo o que a skill faz e quando usar.
 * Não exige a frase literal "Use when:" (isso é convenção do perfil nmforge).
 * Tags XML são recusadas pelo claude.ai.
 */

import type { Rule, RuleViolation } from '../types.js';

const MIN_LENGTH = 10;
const MAX_LENGTH = 1024;

export const ruleAs02: Rule = {
  id: 'R-AS-02',
  category: 'agentskills',
  severity: 'fail',
  profiles: ['agentskills'],
  description: `Frontmatter \`description\` must be ${MIN_LENGTH}-${MAX_LENGTH} chars, without XML tags.`,
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
    const violations: RuleViolation[] = [];
    if (trimmed.length < MIN_LENGTH) {
      violations.push({
        ruleId: this.id,
        severity: this.severity,
        message: `Frontmatter \`description\` is too short (${trimmed.length} chars). Say what the skill does and when to use it.`,
      });
    }
    if (trimmed.length > MAX_LENGTH) {
      violations.push({
        ruleId: this.id,
        severity: this.severity,
        message: `Frontmatter \`description\` has ${trimmed.length} chars (max ${MAX_LENGTH}).`,
      });
    }
    if (/<\/?[A-Za-z][\w-]*[^>]*>/.test(trimmed)) {
      violations.push({
        ruleId: this.id,
        severity: this.severity,
        message: 'Frontmatter `description` must not contain XML tags.',
      });
    }
    return violations;
  },
};
