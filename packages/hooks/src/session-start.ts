/**
 * SessionStart hook — disparado por Claude Code no início da sessão.
 *
 * Detecta projeto NMforge (existência de _nmforge/ ou .claude/skills/nmforge-*)
 * e exporta env vars para o resto da sessão via CLAUDE_ENV_FILE.
 */

import { appendFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { ClaudeEnv, HookOutput } from './types.js';

export async function sessionStartHook(env: ClaudeEnv): Promise<HookOutput> {
  const projectRoot = env.CLAUDE_PROJECT_DIR ?? process.cwd();
  const isNmforge = await detectNmforgeProject(projectRoot);

  if (!isNmforge) return {};

  const exports = [
    `NMFORGE_PROJECT=true`,
    `NMFORGE_PROJECT_ROOT=${projectRoot}`,
    `NMFORGE_SESSION_START=${new Date().toISOString()}`,
  ];

  if (env.CLAUDE_ENV_FILE !== undefined && env.CLAUDE_ENV_FILE !== '') {
    try {
      await appendFile(env.CLAUDE_ENV_FILE, exports.join('\n') + '\n', 'utf8');
    } catch {
      // env file write failure não deve quebrar a sessão
    }
  }

  return {
    systemReminder: `# NMforge detected\n\nProject root: \`${projectRoot}\`\n\nUse \`/nmforge-help\` to discover available skills.`,
  };
}

async function detectNmforgeProject(projectRoot: string): Promise<boolean> {
  // Sinal 1: _nmforge/ existe
  try {
    const entries = await readdir(join(projectRoot, '_nmforge'));
    if (entries.length > 0) return true;
  } catch {
    /* não existe */
  }

  // Sinal 2: .claude/skills/ tem alguma skill nmforge-*
  try {
    const entries = await readdir(join(projectRoot, '.claude', 'skills'));
    if (entries.some((e) => e.startsWith('nmforge-'))) return true;
  } catch {
    /* não existe */
  }

  return false;
}
