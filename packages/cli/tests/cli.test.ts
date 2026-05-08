import { mkdir, mkdtemp, readdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { runDoctorCommand } from '../src/commands/doctor.js';
import { runInstallCommand } from '../src/commands/install.js';
import { runSkillCreateCommand } from '../src/commands/skill.js';
import { runValidateCommand } from '../src/commands/validate.js';
import { main } from '../src/index.js';

let tmpRoot: string;
let consoleLogSpy: ReturnType<typeof vi.spyOn>;
let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

beforeEach(async () => {
  tmpRoot = await mkdtemp(join(tmpdir(), 'nmforge-cli-test-'));
  consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  consoleLogSpy.mockRestore();
  consoleErrorSpy.mockRestore();
});

describe('runDoctorCommand', () => {
  it('roda em projeto vazio sem erros', async () => {
    const code = await runDoctorCommand({ cwd: tmpRoot });
    expect(code).toBe(0);
  });

  it('detecta presença de _nmforge/', async () => {
    await mkdir(join(tmpRoot, '_nmforge'), { recursive: true });
    const code = await runDoctorCommand({ cwd: tmpRoot });
    expect(code).toBe(0);
    const output = consoleLogSpy.mock.calls.flat().join('\n');
    expect(output).toContain('_nmforge/');
  });

  it('detecta .claude/ presente sem settings.json', async () => {
    await mkdir(join(tmpRoot, '.claude'), { recursive: true });
    const code = await runDoctorCommand({ cwd: tmpRoot });
    expect(code).toBe(0);
    const output = consoleLogSpy.mock.calls.flat().join('\n');
    expect(output).toContain('.claude/');
    expect(output).toContain('present');
  });

  it('warn quando settings.json sem ENABLE_PROMPT_CACHING_1H', async () => {
    await mkdir(join(tmpRoot, '.claude'), { recursive: true });
    await writeFile(join(tmpRoot, '.claude', 'settings.json'), JSON.stringify({ env: {} }));
    const code = await runDoctorCommand({ cwd: tmpRoot });
    expect(code).toBe(0);
    const output = consoleLogSpy.mock.calls.flat().join('\n');
    expect(output).toContain('ENABLE_PROMPT_CACHING_1H');
    expect(output).toContain('not set');
  });

  it('ok quando settings.json contem ENABLE_PROMPT_CACHING_1H', async () => {
    await mkdir(join(tmpRoot, '.claude'), { recursive: true });
    await mkdir(join(tmpRoot, '_nmforge'), { recursive: true });
    await writeFile(
      join(tmpRoot, '.claude', 'settings.json'),
      JSON.stringify({ env: { ENABLE_PROMPT_CACHING_1H: 'true' } })
    );
    const code = await runDoctorCommand({ cwd: tmpRoot });
    expect(code).toBe(0);
    const output = consoleLogSpy.mock.calls.flat().join('\n');
    expect(output).toContain('enabled');
    expect(output).toContain('All checks passed');
  });

  it('aceita flag verbose', async () => {
    const code = await runDoctorCommand({ cwd: tmpRoot, verbose: true });
    expect(code).toBe(0);
  });
});

describe('runSkillCreateCommand', () => {
  it('cria estrutura completa de skill', async () => {
    const code = await runSkillCreateCommand({ cwd: tmpRoot, name: 'my-test-skill' });
    expect(code).toBe(0);

    const skillDir = join(tmpRoot, 'skills', 'my-test-skill');
    const files = await readdir(skillDir);
    expect(files).toContain('SKILL.md');
    expect(files).toContain('checklist.md');
    expect(files).toContain('customize.toml');
    expect(files).toContain('steps-c');
    expect(files).toContain('steps-e');
    expect(files).toContain('steps-v');
    expect(files).toContain('resources');

    const skillContent = await readFile(join(skillDir, 'SKILL.md'), 'utf8');
    expect(skillContent).toContain('name: my-test-skill');
    expect(skillContent).toContain('Use when:');
  });

  it('aceita --module e cria sob modules/<module>/skills/', async () => {
    await runSkillCreateCommand({ cwd: tmpRoot, name: 'foo', module: 'analysis' });
    const expected = join(tmpRoot, 'modules', 'analysis', 'skills', 'foo', 'SKILL.md');
    const content = await readFile(expected, 'utf8');
    expect(content).toContain('name: foo');
  });
});

describe('runInstallCommand', () => {
  it('roda como stub e imprime mensagem v0.2', async () => {
    const code = await runInstallCommand({ cwd: tmpRoot });
    expect(code).toBe(0);
    const output = consoleLogSpy.mock.calls.flat().join('\n');
    expect(output).toContain('NMforge install');
    expect(output).toContain('stub');
  });

  it('aceita --modules + --yes', async () => {
    const code = await runInstallCommand({
      cwd: tmpRoot,
      modules: ['analysis', 'test'],
      yes: true,
    });
    expect(code).toBe(0);
    const output = consoleLogSpy.mock.calls.flat().join('\n');
    expect(output).toContain('analysis');
    expect(output).toContain('test');
  });

  it('default sem options funciona (cwd = process.cwd)', async () => {
    const code = await runInstallCommand();
    expect(code).toBe(0);
  });
});

describe('runValidateCommand', () => {
  async function scaffoldSkill(
    root: string,
    name: string,
    overrides: { skipChecklist?: boolean; badName?: boolean } = {}
  ): Promise<void> {
    const skillRoot = join(root, 'skills', name);
    await mkdir(skillRoot, { recursive: true });
    const declaredName = overrides.badName === true ? 'wrong-name' : name;
    const skillMd = `---
name: ${declaredName}
description: |
  Test skill for ${name}.
  Use when: testing CLI validate.
allowed-tools: Read
effort: low
token_budget: 500
phase: meta
persona-mode: minimal
language: pt-br
---

# ${name}

Body curto para validacao.
`;
    await writeFile(join(skillRoot, 'SKILL.md'), skillMd);
    if (overrides.skipChecklist !== true) {
      await writeFile(join(skillRoot, 'checklist.md'), `# Checklist ${name}\n\n- [ ] item\n`);
    }
  }

  it('reporta zero skills em projeto vazio (humano)', async () => {
    const code = await runValidateCommand({ cwd: tmpRoot });
    expect(code).toBe(0);
    const errOut = consoleErrorSpy.mock.calls.flat().join('\n');
    expect(errOut).toContain('No skills found');
  });

  it('reporta zero skills em projeto vazio (json)', async () => {
    const code = await runValidateCommand({ cwd: tmpRoot, json: true });
    expect(code).toBe(0);
    const output = consoleLogSpy.mock.calls.flat().join('\n');
    const parsed = JSON.parse(output) as { skills: unknown[]; passed: boolean };
    expect(parsed.skills).toEqual([]);
    expect(parsed.passed).toBe(true);
  });

  it('passa skill valida (humano + JSON)', async () => {
    await scaffoldSkill(tmpRoot, 'good-skill');

    const codeHuman = await runValidateCommand({ cwd: tmpRoot });
    expect(codeHuman).toBe(0);
    const human = consoleLogSpy.mock.calls.flat().join('\n');
    expect(human).toContain('good-skill');
    expect(human).toContain('OK');
    expect(human).toContain('PASS');

    consoleLogSpy.mockClear();

    const codeJson = await runValidateCommand({ cwd: tmpRoot, json: true });
    expect(codeJson).toBe(0);
    const jsonOut = consoleLogSpy.mock.calls.flat().join('\n');
    const parsed = JSON.parse(jsonOut) as {
      skills: Array<{ skill: string; passed: boolean }>;
      passed: boolean;
    };
    expect(parsed.passed).toBe(true);
    expect(parsed.skills).toHaveLength(1);
    expect(parsed.skills[0]?.skill).toBe('good-skill');
  });

  it('falha quando skill viola R-DET-10 (sem checklist.md)', async () => {
    await scaffoldSkill(tmpRoot, 'bad-skill', { skipChecklist: true });
    const code = await runValidateCommand({ cwd: tmpRoot });
    expect(code).toBe(1);
    const output = consoleLogSpy.mock.calls.flat().join('\n');
    expect(output).toContain('R-DET-10');
    expect(output).toContain('FAIL');
  });

  it('--skill filtra para uma skill especifica', async () => {
    await scaffoldSkill(tmpRoot, 'skill-a');
    await scaffoldSkill(tmpRoot, 'skill-b');
    const code = await runValidateCommand({ cwd: tmpRoot, skill: 'skill-a' });
    expect(code).toBe(0);
    const output = consoleLogSpy.mock.calls.flat().join('\n');
    expect(output).toContain('skill-a');
    expect(output).not.toContain('skill-b');
  });

  it('--rule filtra para uma regra so', async () => {
    await scaffoldSkill(tmpRoot, 'good-skill');
    const code = await runValidateCommand({ cwd: tmpRoot, rule: 'R-DET-01' });
    expect(code).toBe(0);
  });

  it('--strict reporta como estrito (zero violacoes)', async () => {
    await scaffoldSkill(tmpRoot, 'good-skill');
    const code = await runValidateCommand({ cwd: tmpRoot, strict: true });
    expect(code).toBe(0);
  });
});

describe('main() — Commander entry point', () => {
  it('install via main() retorna 0', async () => {
    const code = await main(['node', 'nmforge', 'install', '--cwd', tmpRoot, '--yes']);
    expect(code).toBe(0);
  });

  it('doctor via main() retorna 0', async () => {
    const code = await main(['node', 'nmforge', 'doctor', '--cwd', tmpRoot]);
    expect(code).toBe(0);
  });

  it('validate via main() em projeto vazio retorna 0', async () => {
    const code = await main(['node', 'nmforge', 'validate', '--cwd', tmpRoot, '--json']);
    expect(code).toBe(0);
  });

  it('skill create via main() cria pasta', async () => {
    const code = await main([
      'node',
      'nmforge',
      'skill',
      'create',
      'minha-skill',
      '--cwd',
      tmpRoot,
    ]);
    expect(code).toBe(0);
    const skillDir = join(tmpRoot, 'skills', 'minha-skill');
    const files = await readdir(skillDir);
    expect(files).toContain('SKILL.md');
  });
});
