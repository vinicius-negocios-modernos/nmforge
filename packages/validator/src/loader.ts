/**
 * Loader — descobre skills no filesystem e monta SkillContext.
 */

import { readFile, readdir } from 'node:fs/promises';
import { basename, join, relative } from 'node:path';
import { parseSkillMarkdown } from './parse.js';
import type { SkillContext } from './types.js';

/** Lê o SKILL.md e monta o context completo de uma skill. */
export async function loadSkill(skillRoot: string): Promise<SkillContext> {
  const skillFile = join(skillRoot, 'SKILL.md');
  const raw = await readFile(skillFile, 'utf8');
  const parsed = parseSkillMarkdown(raw);
  const files = await listFilesRelative(skillRoot);

  const context: SkillContext = {
    skillRoot,
    dirName: basename(skillRoot),
    raw,
    frontmatter: parsed.frontmatter,
    body: parsed.body,
    files,
  };
  if (parsed.frontmatterError !== undefined) {
    context.frontmatterError = parsed.frontmatterError;
  }
  return context;
}

/**
 * Encontra todas as pastas de skill em um diretório raiz.
 * Considera "skill" qualquer pasta que contenha SKILL.md.
 */
export async function discoverSkills(rootDir: string): Promise<string[]> {
  const found: string[] = [];
  await walk(rootDir, found);
  return found.sort();
}

async function walk(dir: string, acc: string[]): Promise<void> {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  // Se este diretório contém SKILL.md, é uma skill — não desce mais.
  if (entries.some((e) => e.isFile() && e.name === 'SKILL.md')) {
    acc.push(dir);
    return;
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'dist') {
      continue;
    }
    await walk(join(dir, entry.name), acc);
  }
}

async function listFilesRelative(root: string): Promise<string[]> {
  const acc: string[] = [];
  await collect(root, root, acc);
  return acc.sort();
}

async function collect(root: string, dir: string, acc: string[]): Promise<void> {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const full = join(dir, entry.name);
    if (entry.isFile()) {
      acc.push(relative(root, full));
    } else if (entry.isDirectory()) {
      await collect(root, full, acc);
    }
  }
}

