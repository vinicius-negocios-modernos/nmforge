import { describe, expect, it } from 'vitest';
import { runValidation } from '../src/runner.js';
import type { SkillContext } from '../src/types.js';

function makeValidCtx(): SkillContext {
  return {
    skillRoot: '/tmp/sample',
    dirName: 'sample',
    raw: '',
    body: '',
    frontmatter: {
      name: 'sample',
      description: 'Sample skill that does X. Use when: condition Y is met.',
      'allowed-tools': ['Read', 'Write'],
    },
    files: ['SKILL.md', 'checklist.md'],
  };
}

describe('runValidation', () => {
  it('passes a fully valid skill', () => {
    const result = runValidation(makeValidCtx());
    expect(result.passed).toBe(true);
    expect(result.violations).toEqual([]);
  });

  it('reports multiple violations', () => {
    const ctx: SkillContext = {
      skillRoot: '/tmp/bad',
      dirName: 'bad',
      raw: '',
      body: '',
      frontmatter: {}, // missing name, description, allowed-tools
      files: ['SKILL.md'], // missing checklist.md
    };
    const result = runValidation(ctx);
    expect(result.passed).toBe(false);
    expect(result.violations.length).toBeGreaterThanOrEqual(4);
    const ids = result.violations.map((v) => v.ruleId);
    expect(ids).toContain('R-DET-01');
    expect(ids).toContain('R-DET-02');
    expect(ids).toContain('R-DET-03');
    expect(ids).toContain('R-DET-10');
  });

  it('respects ruleIds filter', () => {
    const ctx: SkillContext = {
      skillRoot: '/tmp/bad',
      dirName: 'bad',
      raw: '',
      body: '',
      frontmatter: {},
      files: ['SKILL.md'],
    };
    const result = runValidation(ctx, { ruleIds: ['R-DET-01'] });
    expect(result.violations).toHaveLength(1);
    expect(result.violations[0]?.ruleId).toBe('R-DET-01');
  });

  it('upgrades warns to fails in strict mode', () => {
    // Currently no warn-level rule exists in the MVP; this test reserves the
    // contract for when R-OP47-* warns are added. Simulates by verifying that
    // strict option does not change fail-level violations.
    const ctx: SkillContext = {
      skillRoot: '/tmp/bad',
      dirName: 'bad',
      raw: '',
      body: '',
      frontmatter: {},
      files: ['SKILL.md'],
    };
    const result = runValidation(ctx, { strict: true });
    expect(result.passed).toBe(false);
    // All current violations remain "fail"
    for (const v of result.violations) {
      expect(v.severity).toBe('fail');
    }
  });

  it('handles unknown ruleId gracefully (skips)', () => {
    const result = runValidation(makeValidCtx(), { ruleIds: ['R-DOES-NOT-EXIST'] });
    expect(result.passed).toBe(true);
    expect(result.violations).toEqual([]);
  });
});
