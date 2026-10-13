/**
 * R-AS-03 — `allowed-tools` opcional (campo experimental do padrão aberto).
 *
 * Ausente: ok. Presente: aceita lista YAML, string separada por espaço ou por
 * vírgula, padrões com argumentos (`Bash(git:*)`) e ferramentas MCP (`mcp__*`).
 * Nome desconhecido gera warn, porque cada agente tem o próprio conjunto.
 */

import type { Rule } from '../types.js';
import { VALID_TOOLS } from './r-det-03-allowed-tools-present.js';

const TOKEN = /[^\s,()]+(\([^)]*\))?/g;

export function parseAllowedTools(raw: unknown): string[] | null {
  if (Array.isArray(raw)) return raw.map((t) => String(t).trim()).filter((t) => t.length > 0);
  if (typeof raw === 'string') return raw.match(TOKEN) ?? [];
  return null;
}

export const ruleAs03: Rule = {
  id: 'R-AS-03',
  category: 'agentskills',
  severity: 'warn',
  profiles: ['agentskills'],
  description: 'Frontmatter `allowed-tools` is optional; when present, tool names should be known.',
  check(ctx) {
    const raw = ctx.frontmatter?.['allowed-tools'];
    if (raw === undefined || raw === null) return [];
    const tools = parseAllowedTools(raw);
    if (tools === null) {
      return [
        {
          ruleId: this.id,
          severity: 'fail',
          message: 'Frontmatter `allowed-tools` must be a list or a space/comma-separated string.',
        },
      ];
    }
    const unknown = tools.filter((t) => {
      const base = t.replace(/\(.*\)$/, '');
      return !VALID_TOOLS.has(base) && !base.startsWith('mcp__');
    });
    if (unknown.length === 0) return [];
    return [
      {
        ruleId: this.id,
        severity: this.severity,
        message: `Unknown tool name(s) in \`allowed-tools\`: ${unknown.join(', ')}.`,
      },
    ];
  },
};
