/**
 * `nmforge skill create <name>` — gera scaffolding para nova skill.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import chalk from 'chalk';

export interface SkillCreateOptions {
  cwd?: string;
  name: string;
  module?: string;
}

const SKILL_MD_TEMPLATE = (name: string) => `---
name: ${name}
description: |
  TODO — describe what this skill does.
  Use when: TODO — describe the trigger condition.
allowed-tools: Read
effort: medium
token_budget: 1500
phase: meta
persona-mode: minimal
language: auto
---

# ${name}

TODO — overview of the skill (max 200 lines per R-OP47-02).

## Steps

See \`steps-c/\` (Create), \`steps-e/\` (Edit), \`steps-v/\` (Validate).

## Resources

- \`checklist.md\` — acceptance criteria.
`;

const CHECKLIST_TEMPLATE = (name: string) => `# Checklist — ${name}

Acceptance criteria. Each item must be verifiable in steps-v/.

- [ ] TODO — first criterion
- [ ] TODO — second criterion
- [ ] All steps in \`steps-c/\` produced expected outputs
`;

const STEP_C_TEMPLATE = `# Step 01 — TODO

TODO — primeiro step do modo Create.
`;

const STEP_E_TEMPLATE = `# Step 01 — TODO assess

TODO — assess mudanças no modo Edit.
`;

const STEP_V_TEMPLATE = `# Step 01 — Evaluate checklist

Compare current state against \`../checklist.md\`. For each unchecked item:
1. Verify the criterion holds.
2. Mark it \`[x]\` if true, \`[!]\` with reason if false.

Report summary at the end.
`;

export async function runSkillCreateCommand(options: SkillCreateOptions): Promise<number> {
  const cwd = options.cwd ?? process.cwd();
  const skillsDir = options.module
    ? join(cwd, 'modules', options.module, 'skills')
    : join(cwd, 'skills');
  const skillRoot = join(skillsDir, options.name);

  await mkdir(join(skillRoot, 'steps-c'), { recursive: true });
  await mkdir(join(skillRoot, 'steps-e'), { recursive: true });
  await mkdir(join(skillRoot, 'steps-v'), { recursive: true });
  await mkdir(join(skillRoot, 'resources'), { recursive: true });

  await writeFile(join(skillRoot, 'SKILL.md'), SKILL_MD_TEMPLATE(options.name));
  await writeFile(join(skillRoot, 'checklist.md'), CHECKLIST_TEMPLATE(options.name));
  await writeFile(join(skillRoot, 'customize.toml'), `# Customization for ${options.name}\n`);
  await writeFile(join(skillRoot, 'steps-c', '01-todo.md'), STEP_C_TEMPLATE);
  await writeFile(join(skillRoot, 'steps-e', '01-assess.md'), STEP_E_TEMPLATE);
  await writeFile(join(skillRoot, 'steps-v', '01-evaluate.md'), STEP_V_TEMPLATE);

  console.log(chalk.green(`✓ Skill scaffolded at ${skillRoot}`));
  console.log('');
  console.log('Next steps:');
  console.log(`  1. Edit ${chalk.cyan(`${skillRoot}/SKILL.md`)} (frontmatter + overview)`);
  console.log(`  2. Edit ${chalk.cyan(`${skillRoot}/checklist.md`)} (acceptance criteria)`);
  console.log(`  3. Run ${chalk.cyan('nmforge validate')} to confirm it passes`);
  return 0;
}
