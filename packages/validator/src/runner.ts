/**
 * Runner — aplica o registry de regras a uma SkillContext e retorna ValidationResult.
 */

import { RULES, findRule } from './registry.js';
import type {
  Rule,
  RuleViolation,
  SkillContext,
  ValidationResult,
  ValidatorOptions,
} from './types.js';

export function runValidation(
  ctx: SkillContext,
  options: ValidatorOptions = {}
): ValidationResult {
  const rulesToRun = selectRules(options.ruleIds);
  const violations: RuleViolation[] = [];

  for (const rule of rulesToRun) {
    const found = rule.check(ctx);
    for (const v of found) {
      violations.push(applyStrict(v, options.strict));
    }
  }

  const passed = violations.every((v) => v.severity !== 'fail');

  return {
    skill: ctx.dirName,
    skillRoot: ctx.skillRoot,
    violations,
    passed,
  };
}

function selectRules(ruleIds: string[] | undefined): Rule[] {
  if (!ruleIds || ruleIds.length === 0) return [...RULES];
  const selected: Rule[] = [];
  for (const id of ruleIds) {
    const rule = findRule(id);
    if (rule) selected.push(rule);
  }
  return selected;
}

function applyStrict(v: RuleViolation, strict: boolean | undefined): RuleViolation {
  if (strict && v.severity === 'warn') {
    return { ...v, severity: 'fail' };
  }
  return v;
}
