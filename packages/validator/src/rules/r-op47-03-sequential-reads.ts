/**
 * R-OP47-03 — Listas numeradas de Read/load ≥ 4 itens consecutivos sem dica
 * de paralelismo.
 *
 * Anti-pattern: "1. Read X 2. Read Y 3. Read Z 4. Read W" força o modelo a
 * serializar tool calls. Opus 4.7 paraleliza tool calls automaticamente
 * quando independentes — mas listas numeradas sinalizam ordem obrigatória.
 *
 * Heurística: detectar 4+ linhas consecutivas começando com `\d+\. (Read|Load|Carregue|Leia)`
 * dentro de uma janela de 8 linhas. Se janela próxima não menciona "parallel",
 * "in parallel", "single message", "concurrent" — emit warn.
 */

import type { Rule, RuleViolation } from '../types.js';

const NUMBERED_READ_RE = /^\s*\d+\.\s+(Read|Load|Carregue|Leia)\b/i;
const PARALLEL_HINT_RE = /\b(parallel|in parallel|single message|concurrent|paralel(o|amente)|em paralelo|simultane)/i;
const MIN_CONSECUTIVE = 4;
const HINT_WINDOW = 8; // linhas antes/depois pra procurar dica de paralelismo

export const ruleOp4703: Rule = {
  id: 'R-OP47-03',
  category: 'opus47-hygiene',
  severity: 'warn',
  description: `Numbered lists of ≥ ${MIN_CONSECUTIVE} consecutive Read/Load instructions should hint at parallelism (Opus 4.7 parallelizes independent tool calls).`,
  check(ctx) {
    const lines = ctx.body.split('\n');
    const violations: RuleViolation[] = [];
    let runStart = -1;
    let runCount = 0;

    const flushRun = (endLine: number): void => {
      if (runCount < MIN_CONSECUTIVE) return;
      // Procura dica de paralelismo na janela ao redor.
      const windowStart = Math.max(0, runStart - HINT_WINDOW);
      const windowEnd = Math.min(lines.length, endLine + HINT_WINDOW);
      const windowText = lines.slice(windowStart, windowEnd).join('\n');
      if (PARALLEL_HINT_RE.test(windowText)) return;
      violations.push({
        ruleId: 'R-OP47-03',
        severity: 'warn',
        message: `Lines ${runStart + 1}–${endLine}: ${runCount} consecutive numbered Read/Load calls without parallelism hint. Opus 4.7 parallelizes independent tool calls — add "(load in parallel)" or rephrase.`,
        line: runStart + 1,
      });
    };

    for (let i = 0; i < lines.length; i++) {
      if (NUMBERED_READ_RE.test(lines[i] ?? '')) {
        if (runCount === 0) runStart = i;
        runCount++;
      } else {
        flushRun(i);
        runCount = 0;
        runStart = -1;
      }
    }
    flushRun(lines.length);

    return violations;
  },
};
