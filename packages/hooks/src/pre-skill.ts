/**
 * PreSkill hook — disparado por Claude Code antes de invocar Skill tool.
 *
 * Lê env vars (CLAUDE_TOOL_NAME, CLAUDE_TOOL_INPUT, CLAUDE_PROJECT_DIR),
 * resolve customize.toml em 3 camadas, emite system-reminder via stdout.
 *
 * Falhas são soft (process exit 0, hook não bloqueia o modelo) — o
 * fallback é o modelo executar a skill sem customização resolvida.
 */

import { join } from 'node:path';
import { resolveCustomize } from '@nmforge/customize-resolver';
import { findSkillRoot } from './find-skill.js';
import type { ClaudeEnv, HookOutput, PreSkillResolution } from './types.js';

export async function preSkillHook(env: ClaudeEnv): Promise<HookOutput> {
  if (env.CLAUDE_TOOL_NAME !== 'Skill') {
    return {};
  }

  const resolution = await resolveSkill(env);

  if (resolution.skillName === null || resolution.skillRoot === null) {
    return {}; // não é skill nossa, deixa passar
  }

  const reminder = buildReminder(resolution);
  const output: HookOutput = {};
  if (reminder !== null) output.systemReminder = reminder;
  return output;
}

export async function resolveSkill(env: ClaudeEnv): Promise<PreSkillResolution> {
  const result: PreSkillResolution = {
    skillName: null,
    skillRoot: null,
    customizeMerged: null,
    layersUsed: [],
    errors: [],
  };

  const skillName = parseSkillName(env.CLAUDE_TOOL_INPUT);
  if (skillName === null) return result;

  // Apenas processa skills com prefixo nmforge- (ou subnamespace).
  if (!skillName.startsWith('nmforge-') && !skillName.includes('-nmforge-')) {
    return result;
  }
  result.skillName = skillName;

  const projectRoot = env.CLAUDE_PROJECT_DIR ?? process.cwd();
  const skillRoot = await findSkillRoot(projectRoot, skillName);
  if (skillRoot === null) {
    result.errors.push(`Skill folder not found for "${skillName}" under ${projectRoot}`);
    return result;
  }
  result.skillRoot = skillRoot;

  try {
    const resolved = await resolveCustomize({
      skillRoot,
      skillName,
      layers: [
        join(skillRoot, 'customize.toml'),
        join(projectRoot, '_nmforge', 'team.toml'),
        join(projectRoot, '_nmforge', 'user.toml'),
      ],
    });
    result.customizeMerged = resolved.merged;
    result.layersUsed = resolved.layersUsed;
    for (const e of resolved.errors) {
      result.errors.push(`${e.layer}: ${e.error}`);
    }
  } catch (err) {
    result.errors.push(`resolveCustomize failed: ${(err as Error).message}`);
  }

  return result;
}

function parseSkillName(rawInput: string | undefined): string | null {
  if (!rawInput) return null;
  try {
    const parsed = JSON.parse(rawInput) as { skill?: unknown; name?: unknown };
    if (typeof parsed.skill === 'string') return parsed.skill;
    if (typeof parsed.name === 'string') return parsed.name;
    return null;
  } catch {
    return null;
  }
}

function buildReminder(r: PreSkillResolution): string | null {
  if (
    r.customizeMerged === null ||
    Object.keys(r.customizeMerged).length === 0
  ) {
    if (r.errors.length === 0) return null;
    return `# NMforge — ${r.skillName}\n\n_(Customização vazia. Erros: ${r.errors.join('; ')})_`;
  }
  const lines: string[] = [
    `# NMforge — Customização resolvida para \`${r.skillName}\``,
    '',
    '```toml',
    formatToml(r.customizeMerged),
    '```',
    '',
    `_Camadas aplicadas: ${r.layersUsed.length}_`,
  ];
  if (r.errors.length > 0) {
    lines.push('', `_Erros não-fatais: ${r.errors.join('; ')}_`);
  }
  return lines.join('\n');
}

/** Formato TOML simplificado para system-reminder (não pretende ser canônico). */
function formatToml(obj: Record<string, unknown>, indent = ''): string {
  const lines: string[] = [];
  for (const [key, val] of Object.entries(obj)) {
    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      lines.push(`\n${indent}[${key}]`);
      lines.push(formatToml(val as Record<string, unknown>, indent));
    } else {
      lines.push(`${indent}${key} = ${JSON.stringify(val)}`);
    }
  }
  return lines.join('\n');
}
