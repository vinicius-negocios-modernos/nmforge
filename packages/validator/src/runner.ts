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

export function runValidation(ctx: SkillContext, options: ValidatorOptions = {}): ValidationResult {
  const profile = options.profile ?? 'nmforge';
  // Regra pedida por ID roda em qualquer perfil; sem IDs, o perfil decide.
  const explicit = options.ruleIds !== undefined && options.ruleIds.length > 0;
  const rulesToRun = selectRules(options.ruleIds).filter(
    (r) => explicit || !r.profiles || r.profiles.includes(profile)
  );
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
