import { describe, expect, it } from 'vitest';
import { ruleOp4701 } from '../src/rules/r-op47-01-critical-count.js';
import { ruleOp4702 } from '../src/rules/r-op47-02-line-limit.js';
import { ruleOp4703 } from '../src/rules/r-op47-03-sequential-reads.js';
import { ruleOp4704 } from '../src/rules/r-op47-04-allowed-tools-emphasis.js';
import { ruleOp4705 } from '../src/rules/r-op47-05-forbidden-strings.js';
import { ruleOp4706 } from '../src/rules/r-op47-06-token-budget.js';
import { ruleOp4707 } from '../src/rules/r-op47-07-must-count.js';
import { ruleOp4708 } from '../src/rules/r-op47-08-activation-ritual.js';
import type { SkillContext } from '../src/types.js';

function ctx(overrides: Partial<SkillContext> = {}): SkillContext {
  return {
    skillRoot: '/tmp/sample',
    dirName: 'sample',
    raw: '',
    body: '',
    frontmatter: {},
    files: ['SKILL.md'],
    ...overrides,
  };
}

describe('R-OP47-01 critical count', () => {
  it('passa com 0–5 occurrences', () => {
    const body = '# Title\n\nCRITICAL: one\nCRITICAL: two\n<critical>three</critical>';
    expect(ruleOp4701.check(ctx({ body }))).toEqual([]);
  });

  it('falha com 6 ou mais', () => {
    const lines = Array.from({ length: 7 }, (_, i) => `CRITICAL: ${i}`).join('\n');
    const violations = ruleOp4701.check(ctx({ body: lines }));
    expect(violations).toHaveLength(1);
    expect(violations[0]?.message).toMatch(/7 occurrences/);
  });

  it('conta CRITICAL: e <critical> juntos', () => {
    const body = 'CRITICAL: a\nCRITICAL: b\nCRITICAL: c\n<critical>d</critical>\n<critical>e</critical>\n<critical>f</critical>';
    const v = ruleOp4701.check(ctx({ body }));
    expect(v).toHaveLength(1);
    expect(v[0]?.message).toMatch(/6 occurrences/);
  });
});

describe('R-OP47-02 line limit', () => {
  it('passa com ≤ 200 linhas', () => {
    const body = Array.from({ length: 100 }, () => 'line').join('\n');
    expect(ruleOp4702.check(ctx({ body }))).toEqual([]);
  });

  it('falha com > 200 linhas', () => {
    const body = Array.from({ length: 250 }, () => 'line').join('\n');
    const v = ruleOp4702.check(ctx({ body }));
    expect(v[0]?.message).toMatch(/250 lines/);
  });
});

describe('R-OP47-03 sequential reads', () => {
  it('passa com 3 ou menos Read consecutivos', () => {
    const body = `1. Read foo.md
2. Read bar.md
3. Read baz.md`;
    expect(ruleOp4703.check(ctx({ body }))).toEqual([]);
  });

  it('falha com 4 Read sem hint paralelo', () => {
    const body = `1. Read foo.md
2. Read bar.md
3. Read baz.md
4. Read qux.md`;
    const v = ruleOp4703.check(ctx({ body }));
    expect(v).toHaveLength(1);
    expect(v[0]?.message).toMatch(/4 consecutive/);
  });

  it('passa quando há hint de paralelismo próximo', () => {
    const body = `Load these in parallel (single message):
1. Read foo.md
2. Read bar.md
3. Read baz.md
4. Read qux.md`;
    expect(ruleOp4703.check(ctx({ body }))).toEqual([]);
  });

  it('aceita variantes PT (Carregue/Leia)', () => {
    const body = `1. Leia foo.md
2. Leia bar.md
3. Leia baz.md
4. Leia qux.md`;
    const v = ruleOp4703.check(ctx({ body }));
    expect(v).toHaveLength(1);
  });
});

describe('R-OP47-04 allowed-tools emphasis (alias)', () => {
  it('é noop não-fail (delega para R-DET-03)', () => {
    expect(ruleOp4704.check(ctx({ frontmatter: {} }))).toEqual([]);
    expect(ruleOp4704.check(ctx({ frontmatter: { 'allowed-tools': ['Read'] } }))).toEqual(
      []
    );
  });
});

describe('R-OP47-05 forbidden strings', () => {
  it('passa com body limpo', () => {
    expect(ruleOp4705.check(ctx({ body: 'Just a normal description.' }))).toEqual([]);
  });

  it('falha em STAY IN CHARACTER', () => {
    const v = ruleOp4705.check(ctx({ body: 'And remember: STAY IN CHARACTER!' }));
    expect(v).toHaveLength(1);
    expect(v[0]?.message).toMatch(/STAY IN CHARACTER/);
  });

  it('falha em NO LYING e DO NOT skip steps independentemente', () => {
    const body = `Rule one: NO LYING.
Rule two: DO NOT skip steps.`;
    const v = ruleOp4705.check(ctx({ body }));
    expect(v).toHaveLength(2);
    expect(v.map((x) => x.line)).toEqual([1, 2]);
  });

  it('é case-insensitive', () => {
    const v = ruleOp4705.check(ctx({ body: 'Stay In Character please' }));
    expect(v).toHaveLength(1);
  });

  it('reporta apenas uma violação por linha', () => {
    // Linha que tem 2 strings proibidas → só 1 violação
    const v = ruleOp4705.check(
      ctx({ body: 'STAY IN CHARACTER and NO LYING' })
    );
    expect(v).toHaveLength(1);
  });
});

describe('R-OP47-06 token budget', () => {
  it('skipped quando token_budget ausente', () => {
    expect(ruleOp4706.check(ctx({ frontmatter: {}, body: 'x'.repeat(100000) }))).toEqual([]);
  });

  it('skipped quando token_budget é 0 ou inválido', () => {
    expect(
      ruleOp4706.check(ctx({ frontmatter: { token_budget: 0 }, body: 'x'.repeat(100000) }))
    ).toEqual([]);
    expect(
      ruleOp4706.check(ctx({ frontmatter: { token_budget: 'big' }, body: 'x'.repeat(100000) }))
    ).toEqual([]);
  });

  it('passa quando body cabe no budget × 1.2', () => {
    // budget 1000, limit 1200 tokens → 4800 chars
    expect(
      ruleOp4706.check(ctx({ frontmatter: { token_budget: 1000 }, body: 'x'.repeat(4000) }))
    ).toEqual([]);
  });

  it('falha quando body excede budget × 1.2', () => {
    // budget 1000 → limit 1200 tokens → 4800 chars; usamos 6000 → 1500 tokens
    const v = ruleOp4706.check(
      ctx({ frontmatter: { token_budget: 1000 }, body: 'x'.repeat(6000) })
    );
    expect(v).toHaveLength(1);
    expect(v[0]?.message).toMatch(/~1500 tokens/);
  });
});

describe('R-OP47-07 MUST count', () => {
  it('passa com ≤ 5 MUST', () => {
    const body = 'You MUST do A. The system MUST handle B.';
    expect(ruleOp4707.check(ctx({ body }))).toEqual([]);
  });

  it('falha com > 5 MUST', () => {
    const body = Array.from({ length: 7 }, (_, i) => `Rule ${i}: this MUST happen.`).join('\n');
    const v = ruleOp4707.check(ctx({ body }));
    expect(v[0]?.message).toMatch(/7 occurrences/);
  });

  it('é case-sensitive (must minúsculo OK)', () => {
    const body = Array.from({ length: 10 }, () => 'this must be done').join('\n');
    expect(ruleOp4707.check(ctx({ body }))).toEqual([]);
  });

  it('respeita word boundary (Mustang não conta)', () => {
    const body = Array.from({ length: 10 }, () => 'I have a Mustang and Customer').join('\n');
    expect(ruleOp4707.check(ctx({ body }))).toEqual([]);
  });
});

describe('R-OP47-08 activation ritual', () => {
  it('passa quando primeiro header está nas primeiras 30 linhas', () => {
    const lines = Array.from({ length: 10 }, () => 'intro line');
    lines.push('## First section');
    expect(ruleOp4708.check(ctx({ body: lines.join('\n') }))).toEqual([]);
  });

  it('falha quando primeiro header está depois de 30 linhas', () => {
    const lines = Array.from({ length: 50 }, () => 'ritual line');
    lines.push('## First section');
    const v = ruleOp4708.check(ctx({ body: lines.join('\n') }));
    expect(v).toHaveLength(1);
    expect(v[0]?.message).toMatch(/50 lines/);
  });

  it('passa (skip) quando body não tem header algum', () => {
    const body = 'no headers at all\njust paragraphs\nand lines';
    expect(ruleOp4708.check(ctx({ body }))).toEqual([]);
  });

  it('aceita ## como header válido (não h1 ou h3)', () => {
    const lines = Array.from({ length: 35 }, () => 'pre');
    lines.push('# H1 não conta');
    lines.push('### H3 também não');
    lines.push('## H2 sim');
    const v = ruleOp4708.check(ctx({ body: lines.join('\n') }));
    expect(v).toHaveLength(1);
    expect(v[0]?.message).toMatch(/37 lines/);
  });
});
