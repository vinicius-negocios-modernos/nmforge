import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import { sessionStartHook } from '../src/session-start.js';

let projectRoot: string;
let envFile: string;

beforeEach(async () => {
  projectRoot = await mkdtemp(join(tmpdir(), 'nmforge-session-test-'));
  envFile = join(projectRoot, '.claude_env');
  await writeFile(envFile, ''); // arquivo vazio
});

describe('sessionStartHook', () => {
  it('retorna vazio em projeto não-NMforge', async () => {
    const out = await sessionStartHook({ CLAUDE_PROJECT_DIR: projectRoot });
    expect(out).toEqual({});
  });

  it('detecta via _nmforge/ e exporta env vars', async () => {
    await mkdir(join(projectRoot, '_nmforge'), { recursive: true });
    await writeFile(join(projectRoot, '_nmforge', 'team.toml'), 'a = 1\n');

    const out = await sessionStartHook({
      CLAUDE_PROJECT_DIR: projectRoot,
      CLAUDE_ENV_FILE: envFile,
    });

    expect(out.systemReminder).toBeDefined();
    expect(out.systemReminder).toContain('NMforge detected');

    const envContent = await readFile(envFile, 'utf8');
    expect(envContent).toContain('NMFORGE_PROJECT=true');
    expect(envContent).toContain('NMFORGE_PROJECT_ROOT=');
    expect(envContent).toContain('NMFORGE_SESSION_START=');
  });

  it('detecta via .claude/skills/nmforge-*', async () => {
    await mkdir(join(projectRoot, '.claude', 'skills', 'nmforge-help'), {
      recursive: true,
    });
    const out = await sessionStartHook({
      CLAUDE_PROJECT_DIR: projectRoot,
      CLAUDE_ENV_FILE: envFile,
    });
    expect(out.systemReminder).toBeDefined();
  });

  it('não falha quando CLAUDE_ENV_FILE não está setado', async () => {
    await mkdir(join(projectRoot, '_nmforge'), { recursive: true });
    await writeFile(join(projectRoot, '_nmforge', 'team.toml'), 'a = 1\n');

    const out = await sessionStartHook({
      CLAUDE_PROJECT_DIR: projectRoot,
    });
    expect(out.systemReminder).toBeDefined();
  });
});
