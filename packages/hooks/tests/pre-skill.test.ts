import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import { preSkillHook, resolveSkill } from '../src/pre-skill.js';

let projectRoot: string;

beforeEach(async () => {
  projectRoot = await mkdtemp(join(tmpdir(), 'nmforge-hooks-test-'));
  // Cria skill nmforge-help fake
  const skillDir = join(projectRoot, '.claude', 'skills', 'nmforge-help');
  await mkdir(skillDir, { recursive: true });
  await writeFile(join(skillDir, 'SKILL.md'), '---\nname: nmforge-help\n---\nbody');
  await writeFile(join(skillDir, 'customize.toml'), 'language = "en"\n');
  // Camada team
  const teamDir = join(projectRoot, '_nmforge');
  await mkdir(teamDir, { recursive: true });
  await writeFile(join(teamDir, 'team.toml'), 'language = "pt-br"\n');
});

describe('preSkillHook', () => {
  it('retorna vazio se não é Skill tool', async () => {
    const out = await preSkillHook({ CLAUDE_TOOL_NAME: 'Read' });
    expect(out).toEqual({});
  });

  it('retorna vazio se input é inválido', async () => {
    const out = await preSkillHook({
      CLAUDE_TOOL_NAME: 'Skill',
      CLAUDE_TOOL_INPUT: 'not-json',
    });
    expect(out).toEqual({});
  });

  it('ignora skills que não são nmforge', async () => {
    const out = await preSkillHook({
      CLAUDE_TOOL_NAME: 'Skill',
      CLAUDE_TOOL_INPUT: JSON.stringify({ skill: 'bmad-help' }),
      CLAUDE_PROJECT_DIR: projectRoot,
    });
    expect(out).toEqual({});
  });

  it('resolve customize de skill nmforge-* e emite system-reminder', async () => {
    const out = await preSkillHook({
      CLAUDE_TOOL_NAME: 'Skill',
      CLAUDE_TOOL_INPUT: JSON.stringify({ skill: 'nmforge-help' }),
      CLAUDE_PROJECT_DIR: projectRoot,
    });
    expect(out.systemReminder).toBeDefined();
    expect(out.systemReminder).toContain('nmforge-help');
    expect(out.systemReminder).toContain('pt-br'); // user override venceu
  });
});

describe('resolveSkill', () => {
  it('retorna null skillName se input não tem skill', async () => {
    const r = await resolveSkill({
      CLAUDE_TOOL_NAME: 'Skill',
      CLAUDE_TOOL_INPUT: '{}',
      CLAUDE_PROJECT_DIR: projectRoot,
    });
    expect(r.skillName).toBeNull();
  });

  it('reporta erro se skill folder não existe', async () => {
    const r = await resolveSkill({
      CLAUDE_TOOL_NAME: 'Skill',
      CLAUDE_TOOL_INPUT: JSON.stringify({ skill: 'nmforge-nonexistent' }),
      CLAUDE_PROJECT_DIR: projectRoot,
    });
    expect(r.skillName).toBe('nmforge-nonexistent');
    expect(r.skillRoot).toBeNull();
    expect(r.errors[0]).toMatch(/not found/i);
  });

  it('mescla layers corretamente', async () => {
    const r = await resolveSkill({
      CLAUDE_TOOL_NAME: 'Skill',
      CLAUDE_TOOL_INPUT: JSON.stringify({ skill: 'nmforge-help' }),
      CLAUDE_PROJECT_DIR: projectRoot,
    });
    expect(r.skillName).toBe('nmforge-help');
    expect(r.skillRoot).toContain('nmforge-help');
    expect(r.customizeMerged).toEqual({ language: 'pt-br' });
    expect(r.layersUsed.length).toBeGreaterThanOrEqual(2);
  });
});
