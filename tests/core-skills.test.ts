/**
 * Teste de integracao das 5 skills core (Fase C).
 *
 * Confere que cada skill canonica:
 *  - existe em skills/<name>/
 *  - tem frontmatter parseavel
 *  - tem checklist.md
 *  - passa todas as 13 regras do validator (zero violacoes em modo strict)
 */

import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  discoverSkills,
  loadSkill,
  runValidation,
} from '../packages/validator/src/index.js';

const REPO_ROOT = resolve(__dirname, '..');
const SKILLS_ROOT = join(REPO_ROOT, 'skills');

const CORE_SKILLS = [
  'nmforge-help',
  'nmforge-doctor',
  'nmforge-customize',
  'nmforge-skill-create',
  'nmforge-validate',
] as const;

describe('Fase C — 5 skills core', () => {
  it('discoverSkills encontra todas as 5', async () => {
    const found = await discoverSkills(SKILLS_ROOT);
    const names = found.map((p) => p.split('/').pop());
    for (const name of CORE_SKILLS) {
      expect(names).toContain(name);
    }
  });

  for (const skillName of CORE_SKILLS) {
    describe(skillName, () => {
      const skillRoot = join(SKILLS_ROOT, skillName);

      it('frontmatter parseavel + body presente', async () => {
        const ctx = await loadSkill(skillRoot);
        expect(ctx.frontmatterError).toBeUndefined();
        expect(ctx.frontmatter).not.toBeNull();
        expect(ctx.frontmatter?.['name']).toBe(skillName);
        expect(ctx.body.length).toBeGreaterThan(0);
      });

      it('checklist.md presente', async () => {
        const ctx = await loadSkill(skillRoot);
        expect(ctx.files).toContain('checklist.md');
      });

      it('passa validator sem fails nem warns (strict)', async () => {
        const ctx = await loadSkill(skillRoot);
        const result = runValidation(ctx, { strict: true });
        expect(
          result.violations,
          `${skillName} violations: ${JSON.stringify(result.violations, null, 2)}`
        ).toEqual([]);
        expect(result.passed).toBe(true);
      });

      it('tem ao menos 1 step file (c/e/v) e customize.toml', async () => {
        const ctx = await loadSkill(skillRoot);
        const hasStepC = ctx.files.some((f) => f.startsWith('steps-c/'));
        const hasStepE = ctx.files.some((f) => f.startsWith('steps-e/'));
        const hasStepV = ctx.files.some((f) => f.startsWith('steps-v/'));
        expect(hasStepC, 'steps-c/').toBe(true);
        expect(hasStepE, 'steps-e/').toBe(true);
        expect(hasStepV, 'steps-v/').toBe(true);
        expect(ctx.files).toContain('customize.toml');
      });
    });
  }

  it('description de cada skill contem "Use when:"', async () => {
    for (const name of CORE_SKILLS) {
      const ctx = await loadSkill(join(SKILLS_ROOT, name));
      const desc = String(ctx.frontmatter?.['description'] ?? '');
      expect(desc, `${name}.description`).toMatch(/Use when:/);
    }
  });
});
