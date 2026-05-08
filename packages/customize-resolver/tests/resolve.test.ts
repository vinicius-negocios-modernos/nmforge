import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import { resolveCustomize } from '../src/resolve.js';

let tmpRoot: string;

beforeEach(async () => {
  tmpRoot = await mkdtemp(join(tmpdir(), 'nmforge-resolve-test-'));
});

describe('resolveCustomize', () => {
  it('lê e mescla 3 layers em ordem', async () => {
    const shipped = join(tmpRoot, 'customize.toml');
    const team = join(tmpRoot, 'team.toml');
    const user = join(tmpRoot, 'user.toml');
    await writeFile(shipped, 'language = "en"\nverbose = false\n');
    await writeFile(team, 'language = "pt-br"\n');
    await writeFile(user, 'verbose = true\n');

    const result = await resolveCustomize({
      skillRoot: tmpRoot,
      skillName: 'test-skill',
      layers: [shipped, team, user],
    });

    expect(result.merged).toEqual({ language: 'pt-br', verbose: true });
    expect(result.layersUsed).toHaveLength(3);
    expect(result.errors).toEqual([]);
  });

  it('layers ausentes são silenciosamente puladas', async () => {
    const shipped = join(tmpRoot, 'customize.toml');
    await writeFile(shipped, 'a = 1\n');

    const result = await resolveCustomize({
      skillRoot: tmpRoot,
      skillName: 'test-skill',
      layers: [shipped, join(tmpRoot, 'does-not-exist.toml')],
    });

    expect(result.merged).toEqual({ a: 1 });
    expect(result.layersUsed).toEqual([shipped]);
    expect(result.errors).toEqual([]);
  });

  it('TOML inválido é registrado como erro mas não bloqueia', async () => {
    const ok = join(tmpRoot, 'ok.toml');
    const bad = join(tmpRoot, 'bad.toml');
    await writeFile(ok, 'a = 1\n');
    await writeFile(bad, 'this is = not = valid = toml\n');

    const result = await resolveCustomize({
      skillRoot: tmpRoot,
      skillName: 'test-skill',
      layers: [ok, bad],
    });

    expect(result.merged).toEqual({ a: 1 });
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]?.error).toMatch(/toml parse error/i);
  });

  it('zero layers retorna objeto vazio', async () => {
    const result = await resolveCustomize({
      skillRoot: tmpRoot,
      skillName: 'test-skill',
      layers: [],
    });
    expect(result.merged).toEqual({});
    expect(result.layersUsed).toEqual([]);
  });

  it('mescla nested tables corretamente', async () => {
    const shipped = join(tmpRoot, 'customize.toml');
    const user = join(tmpRoot, 'user.toml');
    await writeFile(
      shipped,
      `[agent]
name = "John"
voice = "formal"

[output]
format = "md"
`
    );
    await writeFile(
      user,
      `[agent]
voice = "casual"

[output]
verbose = true
`
    );

    const result = await resolveCustomize({
      skillRoot: tmpRoot,
      skillName: 'test-skill',
      layers: [shipped, user],
    });

    expect(result.merged).toEqual({
      agent: { name: 'John', voice: 'casual' },
      output: { format: 'md', verbose: true },
    });
  });
});
