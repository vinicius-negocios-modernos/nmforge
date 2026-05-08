/**
 * @nmforge/customize-resolver — Types.
 */

export type TomlValue =
  | string
  | number
  | boolean
  | Date
  | TomlValue[]
  | { [key: string]: TomlValue };

export type TomlObject = { [key: string]: TomlValue };

export interface ResolveOptions {
  /** Caminho da pasta da skill (usado p/ logging). */
  skillRoot: string;
  /**
   * Lista ordenada de caminhos de TOML para mesclar.
   * Convenção: shipped → team → user (cada layer sobrescreve o anterior).
   * Layers ausentes são silenciosamente ignorados.
   */
  layers: string[];
  /** Nome da skill (usado p/ logging). */
  skillName: string;
}

export interface ResolveResult {
  /** Objeto resultante após merge profundo. */
  merged: TomlObject;
  /** Caminhos efetivamente lidos (na ordem). */
  layersUsed: string[];
  /** Erros de parse (não-fatais; layer pulada). */
  errors: Array<{ layer: string; error: string }>;
}
