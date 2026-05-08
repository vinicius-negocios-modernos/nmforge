/**
 * `nmforge validate` — roda validator em todas as skills do projeto.
 */

import chalk from 'chalk';
import { discoverSkills, loadSkill, runValidation } from '@nmforge/validator';
import type { ValidationResult } from '@nmforge/validator';

export interface ValidateOptions {
  cwd?: string;
  strict?: boolean;
  skill?: string;
  rule?: string;
  json?: boolean;
}

export async function runValidateCommand(options: ValidateOptions = {}): Promise<number> {
  const cwd = options.cwd ?? process.cwd();
  const skillRoots = await discoverSkills(cwd);

  const filtered = options.skill
    ? skillRoots.filter((p) => p.endsWith(`/${options.skill}`) || p.endsWith(`\\${options.skill}`))
    : skillRoots;

  if (filtered.length === 0) {
    if (!options.json) {
      console.error(chalk.yellow(`No skills found under ${cwd}`));
    } else {
      console.log(JSON.stringify({ skills: [], passed: true }));
    }
    return 0;
  }

  const validatorOptions: { strict?: boolean; ruleIds?: string[] } = {};
  if (options.strict !== undefined) validatorOptions.strict = options.strict;
  if (options.rule !== undefined) validatorOptions.ruleIds = [options.rule];

  const results: ValidationResult[] = [];
  for (const root of filtered) {
    const ctx = await loadSkill(root);
    results.push(runValidation(ctx, validatorOptions));
  }

  const allPassed = results.every((r) => r.passed);

  if (options.json) {
    console.log(JSON.stringify({ skills: results, passed: allPassed }, null, 2));
  } else {
    printHumanResults(results);
  }

  return allPassed ? 0 : 1;
}

function printHumanResults(results: ValidationResult[]): void {
  for (const r of results) {
    if (r.passed && r.violations.length === 0) {
      console.log(`${chalk.green('[✓]')} ${r.skill.padEnd(30)} OK`);
      continue;
    }
    const fails = r.violations.filter((v) => v.severity === 'fail').length;
    const warns = r.violations.filter((v) => v.severity === 'warn').length;
    const summary = [
      fails > 0 ? chalk.red(`${fails} fail`) : null,
      warns > 0 ? chalk.yellow(`${warns} warn`) : null,
    ]
      .filter(Boolean)
      .join(', ');
    const icon = fails > 0 ? chalk.red('[✗]') : chalk.yellow('[!]');
    console.log(`${icon} ${r.skill.padEnd(30)} ${summary}`);
    for (const v of r.violations) {
      const sevIcon =
        v.severity === 'fail' ? chalk.red(v.severity) : chalk.yellow(v.severity);
      console.log(`    ${chalk.gray(v.ruleId)}  ${sevIcon}: ${v.message}`);
    }
  }

  const totalFails = results.flatMap((r) =>
    r.violations.filter((v) => v.severity === 'fail')
  ).length;
  const totalWarns = results.flatMap((r) =>
    r.violations.filter((v) => v.severity === 'warn')
  ).length;
  const okCount = results.filter((r) => r.passed && r.violations.length === 0).length;

  console.log('');
  console.log(
    `Summary: ${chalk.green(`${okCount} OK`)}, ${chalk.yellow(`${totalWarns} warns`)}, ${chalk.red(`${totalFails} fails`)}.`
  );
  console.log(
    `Build: ${totalFails === 0 ? chalk.green('PASS') : chalk.red('FAIL')}.`
  );
}
