/**
 * R-DET-03 — `allowed-tools` deve estar presente e conter apenas tool names válidas
 * do Claude Code 2.1.x.
 *
 * Princípio do menor privilégio (ADR-012). Hook PreSkill aplica como permissions.allow.
 */

import type { Rule } from '../types.js';

/** Tool names nativas do Claude Code 2.1.x (incluindo deferred tools mais comuns). */
const VALID_TOOLS = new Set([
  'Read',
  'Write',
  'Edit',
  'Bash',
  'Glob',
  'Grep',
  'Skill',
  'Task',
  'TodoWrite',
  'NotebookEdit',
  'WebFetch',
  'WebSearch',
  'AskUserQuestion',
  'ExitPlanMode',
  'BashOutput',
]);

export const ruleDet03: Rule = {
  id: 'R-DET-03',
  category: 'deterministic',
  severity: 'fail',
  description:
    'Frontmatter `allowed-tools` must be present and list only valid Claude Code 2.1.x tool names.',
  check(ctx) {
    const raw = ctx.frontmatter?.['allowed-tools'];
    if (raw === undefined || raw === null) {
      return [
        {
          ruleId: this.id,
          severity: this.severity,
          message:
            'Frontmatter `allowed-tools` is required (least-privilege principle, ADR-012).',
        },
      ];
    }
    let tools: string[];
    if (Array.isArray(raw)) {
      tools = raw.map((t) => String(t).trim()).filter((t) => t.length > 0);
    } else if (typeof raw === 'string') {
      tools = raw
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
    } else {
      return [
        {
          ruleId: this.id,
          severity: this.severity,
          message:
            'Frontmatter `allowed-tools` must be an array or comma-separated string.',
        },
      ];
    }
    if (tools.length === 0) {
      return [
        {
          ruleId: this.id,
          severity: this.severity,
          message: 'Frontmatter `allowed-tools` must declare at least one tool.',
        },
      ];
    }
    const invalid = tools.filter((t) => !VALID_TOOLS.has(t));
    if (invalid.length > 0) {
      return [
        {
          ruleId: this.id,
          severity: this.severity,
          message: `Invalid tool name(s) in \`allowed-tools\`: ${invalid.join(', ')}. Valid tools: ${[...VALID_TOOLS].join(', ')}.`,
        },
      ];
    }
    return [];
  },
};
