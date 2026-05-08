/**
 * @nmforge/core — CLI entry point.
 */

import { Command } from 'commander';
import { runDoctorCommand } from './commands/doctor.js';
import { runInstallCommand } from './commands/install.js';
import { runSkillCreateCommand } from './commands/skill.js';
import { runValidateCommand } from './commands/validate.js';

export async function main(argv: string[]): Promise<number> {
  const program = new Command();

  program
    .name('nmforge')
    .description('NMforge — Framework Node-nativo de orquestração de agentes para Claude Code 2.1.x')
    .version('0.1.0');

  program
    .command('install')
    .description('Install NMforge in current project')
    .option('--cwd <path>', 'Working directory', process.cwd())
    .option('--modules <list>', 'Comma-separated module list', (v) => v.split(','))
    .option('--yes', 'Non-interactive mode (CI)')
    .action(async (opts: { cwd: string; modules?: string[]; yes?: boolean }) => {
      const installOpts: Parameters<typeof runInstallCommand>[0] = { cwd: opts.cwd };
      if (opts.modules !== undefined) installOpts.modules = opts.modules;
      if (opts.yes !== undefined) installOpts.yes = opts.yes;
      const code = await runInstallCommand(installOpts);
      process.exitCode = code;
    });

  program
    .command('validate')
    .description('Validate skills against rules (R-DET-* + R-OP47-* hygiene)')
    .option('--cwd <path>', 'Working directory', process.cwd())
    .option('--strict', 'Treat warns as fails (CI mode)')
    .option('--skill <name>', 'Validate only one skill (by directory name)')
    .option('--rule <id>', 'Run only one rule by ID')
    .option('--json', 'Emit JSON for parsing')
    .action(
      async (opts: {
        cwd: string;
        strict?: boolean;
        skill?: string;
        rule?: string;
        json?: boolean;
      }) => {
        const validateOpts: Parameters<typeof runValidateCommand>[0] = { cwd: opts.cwd };
        if (opts.strict !== undefined) validateOpts.strict = opts.strict;
        if (opts.skill !== undefined) validateOpts.skill = opts.skill;
        if (opts.rule !== undefined) validateOpts.rule = opts.rule;
        if (opts.json !== undefined) validateOpts.json = opts.json;
        const code = await runValidateCommand(validateOpts);
        process.exitCode = code;
      }
    );

  program
    .command('doctor')
    .description('Audit current project for NMforge / Opus 4.7 hygiene')
    .option('--cwd <path>', 'Working directory', process.cwd())
    .option('--verbose', 'Show extra detail')
    .action(async (opts: { cwd: string; verbose?: boolean }) => {
      const doctorOpts: Parameters<typeof runDoctorCommand>[0] = { cwd: opts.cwd };
      if (opts.verbose !== undefined) doctorOpts.verbose = opts.verbose;
      const code = await runDoctorCommand(doctorOpts);
      process.exitCode = code;
    });

  const skillCmd = program
    .command('skill')
    .description('Skill scaffolding & operations');

  skillCmd
    .command('create <name>')
    .description('Scaffold a new skill (SKILL.md + checklist + steps-c/e/v)')
    .option('--cwd <path>', 'Working directory', process.cwd())
    .option('--module <name>', 'Place under modules/<name>/skills/ instead of skills/')
    .action(
      async (
        name: string,
        opts: { cwd: string; module?: string }
      ) => {
        const skillOpts: Parameters<typeof runSkillCreateCommand>[0] = { cwd: opts.cwd, name };
        if (opts.module !== undefined) skillOpts.module = opts.module;
        const code = await runSkillCreateCommand(skillOpts);
        process.exitCode = code;
      }
    );

  await program.parseAsync(argv);
  const exitCode = process.exitCode;
  return typeof exitCode === 'number' ? exitCode : 0;
}
