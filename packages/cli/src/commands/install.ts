/**
 * `nmforge install` — stub MVP. Versão completa virá em v0.2.
 */

import chalk from 'chalk';

export interface InstallOptions {
  cwd?: string;
  modules?: string[];
  yes?: boolean;
}

export async function runInstallCommand(options: InstallOptions = {}): Promise<number> {
  console.log(chalk.bold('NMforge install'));
  console.log(chalk.gray('(stub v0.1 — full installer arrives in v0.2)'));
  console.log('');
  console.log(`Target dir : ${chalk.cyan(options.cwd ?? process.cwd())}`);
  console.log(`Modules    : ${chalk.cyan((options.modules ?? ['core']).join(', '))}`);
  console.log(`Yes mode   : ${chalk.cyan(String(options.yes ?? false))}`);
  console.log('');
  console.log(
    chalk.yellow(
      'Para o MVP, configure manualmente .claude/settings.json e _nmforge/ por enquanto.'
    )
  );
  return 0;
}
