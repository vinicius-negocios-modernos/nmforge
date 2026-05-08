/**
 * Tipos para input/output de hooks Claude Code 2.1.x.
 */

/** Env vars que o Claude Code expõe a hooks (subset relevante para NMforge). */
export interface ClaudeEnv {
  CLAUDE_CODE_SESSION_ID?: string;
  CLAUDE_PROJECT_DIR?: string;
  CLAUDE_TOOL_NAME?: string;
  /** JSON serializado do input da tool. */
  CLAUDE_TOOL_INPUT?: string;
  /** Caminho do arquivo de env vars (para SessionStart export). */
  CLAUDE_ENV_FILE?: string;
  /** Effort level: low | medium | high */
  CLAUDE_EFFORT?: string;
}

/** Decisão que um hook pode comunicar ao Claude Code via stdout JSON. */
export interface HookOutput {
  /** Se "approve", deixa a tool seguir; "block" para bloquear. */
  decision?: 'approve' | 'block';
  /** Razão (mostrada ao usuário ou modelo). */
  reason?: string;
  /** Conteúdo a injetar como system-reminder. */
  systemReminder?: string;
}

/** Resultado da resolução de uma skill no PreSkill hook. */
export interface PreSkillResolution {
  skillName: string | null;
  skillRoot: string | null;
  customizeMerged: Record<string, unknown> | null;
  layersUsed: string[];
  errors: string[];
}
