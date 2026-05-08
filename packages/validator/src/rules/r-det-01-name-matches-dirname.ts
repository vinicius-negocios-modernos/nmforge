/**
 * R-DET-01 — `name` no frontmatter casa com basename do diretório (kebab-case).
 *
 * Falha se: name ausente, name não é string, name não é kebab-case válido,
 * ou name diferente do basename do diretório da skill.
 */

import type { Rule } from '../types.js';

const KEBAB_CASE = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

export const ruleDet01: Rule = {
  id: 'R-DET-01',
  category: 'deterministic',
  severity: 'fail',
  description: 'Frontmatter `name` must be kebab-case and match the skill directory basename.',
  check(ctx) {
    const name = ctx.frontmatter?.['name'];
    if (typeof name !== 'string' || name.length === 0) {
      return [
        {
          ruleId: this.id,
          severity: this.severity,
          message: 'Frontmatter `name` is missing or not a string.',
        },
      ];
    }
    if (!KEBAB_CASE.test(name)) {
      return [
        {
          ruleId: this.id,
          severity: this.severity,
          message: `Frontmatter \`name\` "${name}" is not valid kebab-case (lowercase letters, digits, hyphens; must start with a letter).`,
        },
      ];
    }
    if (name !== ctx.dirName) {
      return [
        {
          ruleId: this.id,
          severity: this.severity,
          message: `Frontmatter \`name\` "${name}" does not match the directory basename "${ctx.dirName}".`,
        },
      ];
    }
    return [];
  },
};
