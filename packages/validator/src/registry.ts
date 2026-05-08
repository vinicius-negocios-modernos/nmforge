/**
 * Registry de regras do validator.
 *
 * Para adicionar uma regra: importe e adicione ao array.
 * Convenção: regras determinísticas rodam primeiro (em especial R-DET-12 que
 * gateia o resto).
 */

import type { Rule } from './types.js';
import { ruleDet01 } from './rules/r-det-01-name-matches-dirname.js';
import { ruleDet02 } from './rules/r-det-02-description-has-use-when.js';
import { ruleDet03 } from './rules/r-det-03-allowed-tools-present.js';
import { ruleDet10 } from './rules/r-det-10-checklist-exists.js';
import { ruleDet12 } from './rules/r-det-12-frontmatter-parseable.js';

/** Lista canônica de regras do MVP v0.1. Ordem importa: R-DET-12 primeiro. */
export const RULES: ReadonlyArray<Rule> = [
  ruleDet12,
  ruleDet01,
  ruleDet02,
  ruleDet03,
  ruleDet10,
];

export function findRule(id: string): Rule | undefined {
  return RULES.find((r) => r.id === id);
}
