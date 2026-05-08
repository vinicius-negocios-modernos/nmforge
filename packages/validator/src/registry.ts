/**
 * Registry de regras do validator.
 *
 * Para adicionar uma regra: importe e adicione ao array.
 * Convenção: regras determinísticas rodam primeiro (em especial R-DET-12 que
 * gateia o resto). Hygiene Opus 4.7 vem depois.
 */

import type { Rule } from './types.js';
import { ruleDet01 } from './rules/r-det-01-name-matches-dirname.js';
import { ruleDet02 } from './rules/r-det-02-description-has-use-when.js';
import { ruleDet03 } from './rules/r-det-03-allowed-tools-present.js';
import { ruleDet10 } from './rules/r-det-10-checklist-exists.js';
import { ruleDet12 } from './rules/r-det-12-frontmatter-parseable.js';
import { ruleOp4701 } from './rules/r-op47-01-critical-count.js';
import { ruleOp4702 } from './rules/r-op47-02-line-limit.js';
import { ruleOp4703 } from './rules/r-op47-03-sequential-reads.js';
import { ruleOp4704 } from './rules/r-op47-04-allowed-tools-emphasis.js';
import { ruleOp4705 } from './rules/r-op47-05-forbidden-strings.js';
import { ruleOp4706 } from './rules/r-op47-06-token-budget.js';
import { ruleOp4707 } from './rules/r-op47-07-must-count.js';
import { ruleOp4708 } from './rules/r-op47-08-activation-ritual.js';

/** Lista canônica de regras do MVP v0.1 + B+ (8 hygiene). Ordem importa: R-DET-12 primeiro. */
export const RULES: ReadonlyArray<Rule> = [
  // Determinísticas (5)
  ruleDet12,
  ruleDet01,
  ruleDet02,
  ruleDet03,
  ruleDet10,
  // Opus 4.7 hygiene (8)
  ruleOp4701,
  ruleOp4702,
  ruleOp4703,
  ruleOp4704,
  ruleOp4705,
  ruleOp4706,
  ruleOp4707,
  ruleOp4708,
];

export function findRule(id: string): Rule | undefined {
  return RULES.find((r) => r.id === id);
}
