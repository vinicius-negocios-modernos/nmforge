/**
 * @nmforge/validator — Public API.
 */

export { discoverSkills, loadSkill } from './loader.js';
export { parseSkillMarkdown } from './parse.js';
export { findRule, RULES } from './registry.js';
export { runValidation } from './runner.js';
export type {
  Rule,
  RuleCategory,
  RuleViolation,
  Severity,
  SkillContext,
  ValidationResult,
  ValidatorOptions,
} from './types.js';
