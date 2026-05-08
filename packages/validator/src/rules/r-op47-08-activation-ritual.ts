/**
 * R-OP47-08 — "Activation ritual" no início do body ≤ 30 linhas.
 *
 * Anti-pattern: BMAD-METHOD agents têm activation ritual de ~57 linhas
 * idêntico em todos (subprocess Python obrigatório, persona greeting,
 * "do not break character", etc.). Boilerplate gigante antes de qualquer
 * conteúdo útil.
 *
 * Heurística: contar linhas do body antes do primeiro `## ` (header de
 * seção). Se mais de 30 linhas de "intro/ritual" antes de qualquer
 * subseção, warn. Linhas em branco contam.
 */

import type { Rule } from '../types.js';

const SECTION_HEADER_RE = /^##\s+/;
const MAX_RITUAL_LINES = 30;

export const ruleOp4708: Rule = {
  id: 'R-OP47-08',
  category: 'opus47-hygiene',
  severity: 'warn',
  description: `Pre-section content (intro/ritual) should be ≤ ${MAX_RITUAL_LINES} lines (Opus 4.7 hygiene; activation rituals are boilerplate).`,
  check(ctx) {
    const lines = ctx.body.split('\n');
    let firstHeaderLine = -1;
    for (let i = 0; i < lines.length; i++) {
      if (SECTION_HEADER_RE.test(lines[i] ?? '')) {
        firstHeaderLine = i;
        break;
      }
    }
    // Se não há header, considera o body inteiro como "ritual" — outro warn
    // separado (R-OP47-02) cobre tamanho global, então só reportamos se há
    // header e o ritual antes dele excede o limite.
    if (firstHeaderLine === -1) return [];
    if (firstHeaderLine <= MAX_RITUAL_LINES) return [];
    return [
      {
        ruleId: this.id,
        severity: this.severity,
        message: `Pre-section content is ${firstHeaderLine} lines before the first \`## \` header (limit: ${MAX_RITUAL_LINES}). Move boilerplate to a hook (e.g. PreSkill resolves customize.toml) or split into a separate skill.`,
      },
    ];
  },
};
