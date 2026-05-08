/**
 * Localiza a pasta de uma skill no projeto.
 * Procura em locais convencionais:
 *   - $projectRoot/.claude/skills/$skillName/
 *   - $projectRoot/skills/$skillName/
 *   - $projectRoot/packages/&#42;/skills/$skillName/
 */

import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

export async function findSkillRoot(
  projectRoot: string,
  skillName: string
): Promise<string | null> {
  const candidates = [
    join(projectRoot, '.claude', 'skills', skillName),
    join(projectRoot, 'skills', skillName),
  ];

  for (const candidate of candidates) {
    if (await isSkillDir(candidate)) return candidate;
  }

  // Procura em packages/* (monorepo).
  try {
    const packagesDir = join(projectRoot, 'packages');
    const entries = await readdir(packagesDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const nested = join(packagesDir, entry.name, 'skills', skillName);
      if (await isSkillDir(nested)) return nested;
    }
  } catch {
    // packages/ pode não existir
  }

  return null;
}

async function isSkillDir(path: string): Promise<boolean> {
  try {
    const s = await stat(join(path, 'SKILL.md'));
    return s.isFile();
  } catch {
    return false;
  }
}
