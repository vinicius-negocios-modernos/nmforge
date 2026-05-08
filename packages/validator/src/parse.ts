/**
 * Parser de SKILL.md — separa frontmatter (YAML) do body.
 */

import { parse as parseYaml } from 'yaml';

export interface ParsedSkill {
  frontmatter: Record<string, unknown> | null;
  frontmatterError?: string;
  body: string;
}

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

export function parseSkillMarkdown(raw: string): ParsedSkill {
  const match = FRONTMATTER_RE.exec(raw);
  if (!match) {
    return {
      frontmatter: null,
      frontmatterError: 'No frontmatter delimiters (--- ... ---) found',
      body: raw,
    };
  }
  const [, yamlContent, body = ''] = match;
  try {
    const parsed = parseYaml(yamlContent ?? '');
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {
        frontmatter: null,
        frontmatterError: 'Frontmatter must be a YAML mapping (key: value)',
        body,
      };
    }
    return {
      frontmatter: parsed as Record<string, unknown>,
      body,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      frontmatter: null,
      frontmatterError: `YAML parse error: ${msg}`,
      body,
    };
  }
}
