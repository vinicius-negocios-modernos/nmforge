import { describe, expect, it } from 'vitest';
import { ruleDet01 } from '../src/rules/r-det-01-name-matches-dirname.js';
import { ruleDet02 } from '../src/rules/r-det-02-description-has-use-when.js';
import { ruleDet03 } from '../src/rules/r-det-03-allowed-tools-present.js';
import { ruleDet10 } from '../src/rules/r-det-10-checklist-exists.js';
import { ruleDet12 } from '../src/rules/r-det-12-frontmatter-parseable.js';
import type { SkillContext } from '../src/types.js';

function makeCtx(overrides: Partial<SkillContext> = {}): SkillContext {
  return {
    skillRoot: '/tmp/fake-skill',
    dirName: 'fake-skill',
    raw: '',
    frontmatter: {},
    body: '',
    files: ['SKILL.md'],
    ...overrides,
  };
}

describe('R-DET-01 name matches dirname', () => {
  it('passes when name matches dirname and is kebab-case', () => {
    const ctx = makeCtx({ frontmatter: { name: 'fake-skill' } });
    expect(ruleDet01.check(ctx)).toEqual([]);
  });

  it('fails when name is missing', () => {
    const ctx = makeCtx({ frontmatter: {} });
    const violations = ruleDet01.check(ctx);
    expect(violations).toHaveLength(1);
    expect(violations[0]?.message).toMatch(/missing or not a string/);
  });

  it('fails when name is not kebab-case', () => {
    const ctx = makeCtx({ frontmatter: { name: 'FakeSkill' } });
    const violations = ruleDet01.check(ctx);
    expect(violations[0]?.message).toMatch(/kebab-case/);
  });

  it('fails when name does not match dirname', () => {
    const ctx = makeCtx({
      dirName: 'fake-skill',
      frontmatter: { name: 'other-skill' },
    });
    const violations = ruleDet01.check(ctx);
    expect(violations[0]?.message).toMatch(/does not match the directory basename/);
  });

  it('fails when name starts with digit', () => {
    const ctx = makeCtx({
      dirName: '1bad',
      frontmatter: { name: '1bad' },
    });
    const violations = ruleDet01.check(ctx);
    expect(violations[0]?.message).toMatch(/kebab-case/);
  });
});

describe('R-DET-02 description has Use when', () => {
  it('passes with valid description containing Use when', () => {
    const ctx = makeCtx({
      frontmatter: {
        description: 'Generates a PRD from a brief. Use when: a brief exists.',
      },
    });
    expect(ruleDet02.check(ctx)).toEqual([]);
  });

  it('fails when description is missing', () => {
    const ctx = makeCtx({ frontmatter: {} });
    const violations = ruleDet02.check(ctx);
    expect(violations[0]?.message).toMatch(/missing or empty/);
  });

  it('fails when description is too short', () => {
    const ctx = makeCtx({ frontmatter: { description: 'short' } });
    const violations = ruleDet02.check(ctx);
    expect(violations[0]?.message).toMatch(/too short/);
  });

  it('fails when description lacks "Use when:"', () => {
    const ctx = makeCtx({
      frontmatter: { description: 'A useful skill that does things really well.' },
    });
    const violations = ruleDet02.check(ctx);
    expect(violations[0]?.message).toMatch(/use when/i);
  });

  it('accepts Use when in any case', () => {
    const ctx = makeCtx({
      frontmatter: { description: 'A skill. USE WHEN: some condition is met.' },
    });
    expect(ruleDet02.check(ctx)).toEqual([]);
  });
});

describe('R-DET-03 allowed-tools present and valid', () => {
  it('passes with valid array', () => {
    const ctx = makeCtx({
      frontmatter: { 'allowed-tools': ['Read', 'Write', 'Edit'] },
    });
    expect(ruleDet03.check(ctx)).toEqual([]);
  });

  it('passes with comma-separated string', () => {
    const ctx = makeCtx({
      frontmatter: { 'allowed-tools': 'Read, Write, Edit' },
    });
    expect(ruleDet03.check(ctx)).toEqual([]);
  });

  it('fails when allowed-tools is missing', () => {
    const ctx = makeCtx({ frontmatter: {} });
    const violations = ruleDet03.check(ctx);
    expect(violations[0]?.message).toMatch(/required/);
  });

  it('fails on invalid tool name', () => {
    const ctx = makeCtx({
      frontmatter: { 'allowed-tools': ['Read', 'NotARealTool'] },
    });
    const violations = ruleDet03.check(ctx);
    expect(violations[0]?.message).toMatch(/NotARealTool/);
  });

  it('fails on empty list', () => {
    const ctx = makeCtx({ frontmatter: { 'allowed-tools': [] } });
    const violations = ruleDet03.check(ctx);
    expect(violations[0]?.message).toMatch(/at least one/);
  });

  it('fails when type is wrong (number)', () => {
    const ctx = makeCtx({ frontmatter: { 'allowed-tools': 42 } });
    const violations = ruleDet03.check(ctx);
    expect(violations[0]?.message).toMatch(/array or comma-separated/);
  });
});

describe('R-DET-10 checklist exists', () => {
  it('passes when checklist.md present', () => {
    const ctx = makeCtx({ files: ['SKILL.md', 'checklist.md'] });
    expect(ruleDet10.check(ctx)).toEqual([]);
  });

  it('fails when checklist.md absent', () => {
    const ctx = makeCtx({ files: ['SKILL.md'] });
    const violations = ruleDet10.check(ctx);
    expect(violations[0]?.message).toMatch(/checklist\.md.*not found/i);
  });

  it('finds checklist.md case-insensitively', () => {
    const ctx = makeCtx({ files: ['SKILL.md', 'CHECKLIST.MD'] });
    expect(ruleDet10.check(ctx)).toEqual([]);
  });
});

describe('R-DET-12 frontmatter parseable', () => {
  it('passes when frontmatter is parsed successfully', () => {
    const ctx = makeCtx({ frontmatter: { name: 'foo' } });
    expect(ruleDet12.check(ctx)).toEqual([]);
  });

  it('fails when frontmatter is null', () => {
    const ctx = makeCtx({
      frontmatter: null,
      frontmatterError: 'YAML parse error: unexpected token',
    });
    const violations = ruleDet12.check(ctx);
    expect(violations[0]?.message).toMatch(/yaml parse error/i);
  });

  it('uses default message when frontmatterError absent', () => {
    const ctx = makeCtx({ frontmatter: null });
    const violations = ruleDet12.check(ctx);
    expect(violations[0]?.message).toMatch(/invalid or missing/);
  });
});
