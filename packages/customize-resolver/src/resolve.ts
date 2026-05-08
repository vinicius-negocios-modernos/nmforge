/**
 * Resolver — lê N camadas TOML, aplica deep merge, retorna resultado.
 */

import { readFile } from 'node:fs/promises';
import { parse as parseToml } from 'smol-toml';
import { deepMerge } from './merge.js';
import type { ResolveOptions, ResolveResult, TomlObject } from './types.js';

export async function resolveCustomize(options: ResolveOptions): Promise<ResolveResult> {
  let merged: TomlObject = {};
  const layersUsed: string[] = [];
  const errors: ResolveResult['errors'] = [];

  for (const layer of options.layers) {
    let raw: string;
    try {
      raw = await readFile(layer, 'utf8');
    } catch (err) {
      // Layer ausente é OK — silenciosamente pula.
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') continue;
      errors.push({ layer, error: `read error: ${(err as Error).message}` });
      continue;
    }
    let parsed: TomlObject;
    try {
      parsed = parseToml(raw) as TomlObject;
    } catch (err) {
      errors.push({ layer, error: `toml parse error: ${(err as Error).message}` });
      continue;
    }
    merged = deepMerge(merged, parsed);
    layersUsed.push(layer);
  }

  return { merged, layersUsed, errors };
}
