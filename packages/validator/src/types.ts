/**
 * NMforge Validator — Tipos comuns.
 */

export type Severity = 'fail' | 'warn' | 'info';

export type RuleCategory = 'deterministic' | 'opus47-hygiene' | 'inference';

export interface RuleViolation {
  ruleId: string;
  severity: Severity;
  message: string;
  /** Linha aproximada (1-indexed) onde a violação foi detectada, se aplicável. */
  line?: number;
  /** Caminho do arquivo onde a violação foi detectada. */
  file?: string;
}

export interface SkillContext {
  /** Caminho absoluto da pasta da skill. */
  skillRoot: string;
  /** Nome derivado do basename da pasta. */
  dirName: string;
  /** Conteúdo bruto do SKILL.md. */
  raw: string;
  /** Frontmatter parseado (YAML). null se inválido. */
  frontmatter: Record<string, unknown> | null;
  /** Erro de parse do frontmatter, se houver. */
  frontmatterError?: string;
  /** Body do SKILL.md (depois do frontmatter). */
  body: string;
  /** Lista de arquivos presentes na pasta da skill (basenames + subpaths). */
  files: string[];
}

export interface Rule {
  id: string;
  category: RuleCategory;
  severity: Severity;
  description: string;
  /** Roda a regra. Retorna lista vazia se passou; lista de violações se falhou. */
  check: (ctx: SkillContext) => RuleViolation[];
}

export interface ValidationResult {
  skill: string;
  skillRoot: string;
  violations: RuleViolation[];
  passed: boolean;
}

export interface ValidatorOptions {
  /** Se true, warns viram fails (modo CI estrito). */
  strict?: boolean;
  /** Se setado, roda apenas as regras com esses IDs. */
  ruleIds?: string[];
}
