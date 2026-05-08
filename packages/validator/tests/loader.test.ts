import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { discoverSkills, loadSkill } from '../src/loader.js';

let tmpRoot: string;

beforeAll(async () => {
  tmpRoot = await mkdtemp(join(tmpdir(), 'nmforge-validator-test-'));
  // Skill 1
  const s1 = join(tmpRoot, 'skill-one');
  await mkdir(s1, { recursive: true });
  await writeFile(
    join(s1, 'SKILL.md'),
    `---
name: skill-one
description: "Skill one. Use when: testing."
allowed-tools: [Read]
---
Body of skill one.`
  );
  await writeFile(join(s1, 'checklist.md'), '- [ ] item');

  // Skill 2 nested
  const s2 = join(tmpRoot, 'subdir', 'skill-two');
  await mkdir(s2, { recursive: true });
  await writeFile(
    join(s2, 'SKILL.md'),
    `---
name: skill-two
description: "Skill two. Use when: testing nested."
allowed-tools: [Read, Write]
---
Body two.`
  );

  // Não-skill (sem SKILL.md): deve ser ignorada
  await mkdir(join(tmpRoot, 'just-a-folder'), { recursive: true });
  await writeFile(join(tmpRoot, 'just-a-folder', 'README.md'), 'not a skill');
});

afterAll(async () => {
  // tmpdir cleanup é responsabilidade do OS; deixamos rastros mínimos
});

describe('discoverSkills', () => {
  it('encontra skills aninhadas', async () => {
    const found = await discoverSkills(tmpRoot);
    expect(found).toHaveLength(2);
    expect(found.some((p) => p.endsWith('skill-one'))).toBe(true);
    expect(found.some((p) => p.endsWith('skill-two'))).toBe(true);
  });

  it('ignora pastas sem SKILL.md', async () => {
    const found = await discoverSkills(tmpRoot);
    expect(found.some((p) => p.endsWith('just-a-folder'))).toBe(false);
  });

  it('retorna array vazio em diretório inexistente', async () => {
    const found = await discoverSkills('/tmp/nmforge-does-not-exist-xyz');
    expect(found).toEqual([]);
  });
});

describe('loadSkill', () => {
  it('carrega frontmatter, body, files', async () => {
    const found = await discoverSkills(tmpRoot);
    const skillOnePath = found.find((p) => p.endsWith('skill-one'))!;
    const ctx = await loadSkill(skillOnePath);
    expect(ctx.dirName).toBe('skill-one');
    expect(ctx.frontmatter?.['name']).toBe('skill-one');
    expect(ctx.body).toContain('Body of skill one');
    expect(ctx.files).toContain('SKILL.md');
    expect(ctx.files).toContain('checklist.md');
  });
});
