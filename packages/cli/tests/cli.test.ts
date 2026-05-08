import { mkdir, mkdtemp, readdir, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { runDoctorCommand } from '../src/commands/doctor.js';
import { runSkillCreateCommand } from '../src/commands/skill.js';

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
