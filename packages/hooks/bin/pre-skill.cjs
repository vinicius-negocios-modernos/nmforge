#!/usr/bin/env node
/**
 * NMforge PreSkill hook — wrapper CJS executável pelo Claude Code.
 *
 * Lê env vars via process.env, chama preSkillHook(), emite resultado via stdout JSON.
 * Soft-fail: erros vão para stderr e exit 0 (não bloqueia o modelo).
 */

(async () => {
  try {
    const { preSkillHook } = await import('../dist/index.js');
    const output = await preSkillHook(process.env);
    if (output && Object.keys(output).length > 0) {
      process.stdout.write(JSON.stringify(output) + '\n');
    }
    process.exit(0);
  } catch (err) {
    process.stderr.write(
      `[nmforge pre-skill] ${err && err.message ? err.message : String(err)}\n`
    );
    process.exit(0);
  }
})();
