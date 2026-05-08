/**
 * `nmforge doctor` — auditoria do projeto.
 *
 * MVP v0.1: relatório básico de presença de marcadores.
 * Será expandido com detecção de modelos legados, anti-patterns 4.7, refs órfãs.
 */

import { access } from 'node:fs/promises';
import { join } from 'node:path';
import chalk from 'chalk';
import { discoverSkills } from '@nmforge/validator';

export interface DoctorOptions {
  cwd?: string;
  verbose?: boolean;
}

export async function runDoctorCommand(options: DoctorOptions = {}): Promise<number> {
  const cwd = options.cwd ?? process.cwd();
  console.log(chalk.bold(`NMforge doctor — auditoria de ${cwd}\n`));

  const checks: Array<{ label: string; status: 'ok' | 'warn' | 'info'; detail?: string }> = [];

  // Check 1: NMforge instalado?
  const hasNmforgeDir = await exists(join(cwd, '_nmforge'));
  checks.push({
    label: '_nmforge/ directory',
    status: hasNmforgeDir ? 'ok' : 'info',
    detail: hasNmforgeDir ? 'present' : 'absent (run `nmforge install` to scaffold)',
  });

  // Check 2: .claude/ presente
  const hasClaudeDir = await exists(join(cwd, '.claude'));
  checks.push({
    label: '.claude/ directory',
    status: hasClaudeDir ? 'ok' : 'warn',
    detail: hasClaudeDir
      ? 'present'
      : 'absent (Claude Code project not initialized?)',
  });

  // Check 3: settings.json com prompt cache 1h
  const settingsPath = join(cwd, '.claude', 'settings.json');
  if (await exists(settingsPath)) {
    const { readFile } = await import('node:fs/promises');
    const content = await readFile(settingsPath, 'utf8');
    const hasCache = content.includes('ENABLE_PROMPT_CACHING_1H');
    checks.push({
      label: 'ENABLE_PROMPT_CACHING_1H in settings',
      status: hasCache ? 'ok' : 'warn',
      detail: hasCache ? 'enabled' : 'not set (recommended for skill-heavy sessions)',
    });
  }

  // Check 4: skills descobertas
  const skills = await discoverSkills(cwd);
  checks.push({
    label: 'Skills discovered',
    status: skills.length > 0 ? 'ok' : 'info',
    detail: `${skills.length} skill(s) found`,
  });

  // Print
  for (const c of checks) {
    const icon =
      c.status === 'ok'
        ? chalk.green('[✓]')
        : c.status === 'warn'
          ? chalk.yellow('[!]')
          : chalk.gray('[i]');
    console.log(`${icon} ${c.label.padEnd(40)} ${chalk.gray(c.detail ?? '')}`);
  }

  const warnings = checks.filter((c) => c.status === 'warn').length;
  console.log('');
  console.log(
    warnings === 0
      ? chalk.green('All checks passed.')
      : chalk.yellow(`${warnings} warning(s).`)
  );
  return 0;
}

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}
