/**
 * @nmforge/validator — Public API.
 */

export { discoverSkills, loadSkill } from './loader.js';
export { parseSkillMarkdown } from './parse.js';
export { findRule, RULES } from './registry.js';
export { runValidation } from './runner.js';
export { PROFILES } from './types.js';
export { parseAllowedTools } from './rules/r-as-03-allowed-tools-optional.js';
export type {
  Profile,
  Rule,
  RuleCategory,
  RuleViolation,
  Severity,
  SkillContext,
  ValidationResult,
  ValidatorOptions,
} from './types.js';
