import { describe, expect, it } from 'vitest';
import { runValidation } from '../src/runner.js';
import { parseAllowedTools } from '../src/rules/r-as-03-allowed-tools-optional.js';
import type { SkillContext } from '../src/types.js';

function makeOpenStandardCtx(overrides: Partial<SkillContext> = {}): SkillContext {
  return {
    skillRoot: '/tmp/buscar-leads',
    dirName: 'buscar-leads',
    raw: '',
    body: '# Buscar leads\n\nPasso a passo.\n',
    frontmatter: {
      name: 'buscar-leads',
      description:
        'Monta uma lista de empresas a partir do perfil de cliente ideal. Use quando o pedido for gerar uma lista de prospecção.',
    },
    files: ['SKILL.md', 'references/fontes.md'],
    ...overrides,
  };
}

const ids = (ctx: SkillContext, profile?: 'nmforge' | 'agentskills') =>
  runValidation(ctx, profile ? { profile } : {}).violations.map((v) => v.ruleId);

describe('profile agentskills', () => {
  it('accepts a skill with only name and description', () => {
    const result = runValidation(makeOpenStandardCtx(), { profile: 'agentskills' });
    expect(result.violations).toEqual([]);
    expect(result.passed).toBe(true);
  });

  it('keeps the nmforge profile as default and strict', () => {
    const result = runValidation(makeOpenStandardCtx());
    expect(result.passed).toBe(false);
    expect(result.violations.map((v) => v.ruleId)).toEqual(
      expect.arrayContaining(['R-DET-02', 'R-DET-03', 'R-DET-10'])
    );
  });

  it('does not run nmforge-only rules nor R-AS rules out of their profile', () => {
    expect(ids(makeOpenStandardCtx(), 'agentskills')).not.toContain('R-DET-02');
    const bad = makeOpenStandardCtx({
      frontmatter: { name: 'Bad_Name', description: 'x'.repeat(20) },
    });
    expect(ids(bad, 'nmforge')).not.toContain('R-AS-01');
  });

  it('runs a rule requested by ID regardless of profile', () => {
    const result = runValidation(makeOpenStandardCtx(), {
      ruleIds: ['R-DET-10'],
      profile: 'agentskills',
    });
    expect(result.violations.map((v) => v.ruleId)).toEqual(['R-DET-10']);
  });

  it('R-AS-01 rejects bad name formats and reserved words', () => {
    for (const name of [
      'Buscar-Leads',
      '-buscar',
      'buscar--leads',
      'buscar-',
      'claude-helper',
      'a'.repeat(65),
    ]) {
      const ctx = makeOpenStandardCtx({
        dirName: name,
        frontmatter: { name, description: 'Descrição suficiente.' },
      });
      expect(ids(ctx, 'agentskills'), name).toContain('R-AS-01');
    }
  });

  it('R-AS-02 checks description length and XML tags', () => {
    const cases = ['curta', 'x'.repeat(1025), 'Faz algo <tag>útil</tag> quando pedido.'];
    for (const description of cases) {
      const ctx = makeOpenStandardCtx({ frontmatter: { name: 'buscar-leads', description } });
      expect(ids(ctx, 'agentskills')).toContain('R-AS-02');
    }
    const missing = makeOpenStandardCtx({ frontmatter: { name: 'buscar-leads' } });
    expect(ids(missing, 'agentskills')).toContain('R-AS-02');
  });

  it('R-AS-03 accepts space-separated tools, patterns and MCP tools', () => {
    const ctx = makeOpenStandardCtx({
      frontmatter: {
        name: 'buscar-leads',
        description: 'Descrição suficiente para a skill.',
        'allowed-tools': 'Read Bash(git status) mcp__github__get_issue',
      },
    });
    expect(runValidation(ctx, { profile: 'agentskills' }).violations).toEqual([]);
  });

  it('R-AS-03 only warns on unknown tools', () => {
    const ctx = makeOpenStandardCtx({
      frontmatter: {
        name: 'buscar-leads',
        description: 'Descrição suficiente.',
        'allowed-tools': ['Read', 'Teleport'],
      },
    });
    const result = runValidation(ctx, { profile: 'agentskills' });
    expect(result.passed).toBe(true);
    expect(result.violations).toEqual([
      expect.objectContaining({ ruleId: 'R-AS-03', severity: 'warn' }),
    ]);
  });

  it('parseAllowedTools splits strings with spaces, commas and parentheses', () => {
    expect(parseAllowedTools('Read, Write Bash(npm run test:*)')).toEqual([
      'Read',
      'Write',
      'Bash(npm run test:*)',
    ]);
    expect(parseAllowedTools(['Read'])).toEqual(['Read']);
    expect(parseAllowedTools(42)).toBeNull();
  });
});
