#!/usr/bin/env node
/**
 * NMforge SessionStart hook — wrapper CJS executável pelo Claude Code.
 *
 * Detecta projeto NMforge, exporta env vars via $CLAUDE_ENV_FILE, emite
 * system-reminder.
 */

(async () => {
  try {
    const { sessionStartHook } = await import('../dist/index.js');
    const output = await sessionStartHook(process.env);
    if (output && Object.keys(output).length > 0) {
      process.stdout.write(JSON.stringify(output) + '\n');
    }
    process.exit(0);
  } catch (err) {
    process.stderr.write(
      `[nmforge session-start] ${err && err.message ? err.message : String(err)}\n`
    );
    process.exit(0);
  }
})();
