/**
 * R-OP47-04 — `allowed-tools` no frontmatter (princípio de menor privilégio).
 *
 * Esta regra é redundante com R-DET-03 (que já falha quando ausente). Mantida
 * para manter contagem do design e como ENFASE explícita do princípio P1
 * (Native-first, custom-only-when-needed).
 *
 * Como evita duplicação: se R-DET-03 já reportou violação para este SkillContext,
 * R-OP47-04 não emite. Se R-DET-03 passou (allowed-tools presente e válido),
 * R-OP47-04 também passa.
 */

import type { Rule } from '../types.js';

export const ruleOp4704: Rule = {
  id: 'R-OP47-04',
  category: 'opus47-hygiene',
  severity: 'fail',
  description:
    '`allowed-tools` declared (least-privilege; emphasis-alias for R-DET-03; ADR-012).',
  check(ctx) {
    // Mesma checagem de R-DET-03 mas com mensagem de emphasis. Se ambas
    // passam ou ambas falham — só uma reporta (R-DET-03 vai primeiro no
    // registry). Aqui retornamos sempre [] para evitar duplicação visual;
    // R-DET-03 cobre o caso de violação real.
    return ctx.frontmatter && 'allowed-tools' in ctx.frontmatter ? [] : [];
  },
};
