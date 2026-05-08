import { describe, expect, it } from 'vitest';
import { parseSkillMarkdown } from '../src/parse.js';

describe('parseSkillMarkdown', () => {
  it('parses a valid frontmatter and body', () => {
    const raw = `---
name: foo
allowed-tools: [Read]
---
# Body content
hello
`;
    const result = parseSkillMarkdown(raw);
    expect(result.frontmatter).toEqual({ name: 'foo', 'allowed-tools': ['Read'] });
    expect(result.body.trim()).toBe('# Body content\nhello');
    expect(result.frontmatterError).toBeUndefined();
  });

  it('returns error when no delimiters', () => {
    const result = parseSkillMarkdown('just plain text');
    expect(result.frontmatter).toBeNull();
    expect(result.frontmatterError).toMatch(/no frontmatter delimiters/i);
  });

  it('returns error on invalid YAML', () => {
    const raw = `---
name: foo
  bad: indent: : yes
---
body
`;
    const result = parseSkillMarkdown(raw);
    expect(result.frontmatter).toBeNull();
    expect(result.frontmatterError).toMatch(/yaml parse error/i);
  });

  it('rejects array as frontmatter', () => {
    const raw = `---
- item1
- item2
---
body`;
    const result = parseSkillMarkdown(raw);
    expect(result.frontmatter).toBeNull();
    expect(result.frontmatterError).toMatch(/yaml mapping/i);
  });
});
