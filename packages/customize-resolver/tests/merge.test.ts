import { describe, expect, it } from 'vitest';
import { deepMerge } from '../src/merge.js';
import type { TomlObject } from '../src/types.js';

describe('deepMerge — scalars', () => {
  it('override wins for scalars', () => {
    const merged = deepMerge({ a: 1, b: 'x' }, { a: 2 });
    expect(merged).toEqual({ a: 2, b: 'x' });
  });

  it('adds new keys from override', () => {
    const merged = deepMerge({ a: 1 }, { b: 2 });
    expect(merged).toEqual({ a: 1, b: 2 });
  });

  it('preserves base when override is empty', () => {
    const merged = deepMerge({ a: 1 }, {});
    expect(merged).toEqual({ a: 1 });
  });

  it('does not mutate inputs', () => {
    const base: TomlObject = { a: 1 };
    const override: TomlObject = { a: 2 };
    deepMerge(base, override);
    expect(base.a).toBe(1);
    expect(override.a).toBe(2);
  });
});

describe('deepMerge — nested tables (deep merge)', () => {
  it('merges nested objects recursively', () => {
    const base = { agent: { name: 'foo', voice: 'formal' } };
    const override = { agent: { voice: 'casual' } };
    const merged = deepMerge(base, override);
    expect(merged).toEqual({ agent: { name: 'foo', voice: 'casual' } });
  });

  it('handles deeply nested override', () => {
    const base = { a: { b: { c: 1, d: 2 } } };
    const override = { a: { b: { c: 99 } } };
    expect(deepMerge(base, override)).toEqual({ a: { b: { c: 99, d: 2 } } });
  });
});

describe('deepMerge — arrays of scalars (REPLACE)', () => {
  it('replaces array of scalars', () => {
    const merged = deepMerge({ tools: ['Read'] }, { tools: ['Read', 'Write'] });
    expect(merged.tools).toEqual(['Read', 'Write']);
  });

  it('replaces with empty array', () => {
    const merged = deepMerge({ tools: ['Read'] }, { tools: [] });
    expect(merged.tools).toEqual([]);
  });
});

describe('deepMerge — arrays of tables with key field', () => {
  it('merges by `code` field (replace + append)', () => {
    const base = {
      menu: [
        { code: 'help', label: 'Help' },
        { code: 'doctor', label: 'Doctor' },
      ],
    };
    const override = {
      menu: [
        { code: 'doctor', label: 'Diagnose' }, // sobrescreve
        { code: 'new', label: 'New thing' }, // adiciona
      ],
    };
    const merged = deepMerge(base, override) as { menu: { code: string; label: string }[] };
    expect(merged.menu).toHaveLength(3);
    expect(merged.menu.find((m) => m.code === 'doctor')?.label).toBe('Diagnose');
    expect(merged.menu.find((m) => m.code === 'new')?.label).toBe('New thing');
    expect(merged.menu.find((m) => m.code === 'help')?.label).toBe('Help');
  });

  it('merges by `id` field', () => {
    const base = { items: [{ id: 1, x: 'a' }] };
    const override = { items: [{ id: 1, x: 'b' }] };
    expect(deepMerge(base, override)).toEqual({ items: [{ id: 1, x: 'b' }] });
  });

  it('falls back to REPLACE when no key field', () => {
    const base = { items: [{ x: 1 }, { x: 2 }] };
    const override = { items: [{ x: 99 }] };
    expect(deepMerge(base, override)).toEqual({ items: [{ x: 99 }] });
  });

  it('arrays of mixed types fall back to REPLACE', () => {
    const base = { mixed: ['string', { code: 'a' }] };
    const override = { mixed: ['other'] };
    expect(deepMerge(base, override)).toEqual({ mixed: ['other'] });
  });
});

describe('deepMerge — types/dates', () => {
  it('replaces Date scalar', () => {
    const d1 = new Date('2026-01-01');
    const d2 = new Date('2026-12-31');
    const merged = deepMerge({ when: d1 }, { when: d2 });
    expect(merged.when).toEqual(d2);
  });

  it('clones nested objects (no shared refs)', () => {
    const base: TomlObject = { x: { y: 1 } };
    const merged = deepMerge(base, {}) as { x: { y: number } };
    merged.x.y = 99;
    expect((base.x as { y: number }).y).toBe(1);
  });
});
