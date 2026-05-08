/**
 * Deep merge para customize.toml.
 *
 * Regras (inspiradas em BMAD mas mais simples):
 * - Scalars (string/number/boolean/Date): override (later wins).
 * - Arrays de scalars: REPLACE (later wins).
 * - Arrays de tables (objetos): se itens têm chave `code` ou `id`, faz
 *   replace+append por chave; senão faz REPLACE.
 * - Tables (objetos): merge recursivo (deep).
 *
 * Imutável — não muta inputs.
 */

import type { TomlObject, TomlValue } from './types.js';

const KEYED_FIELDS = ['code', 'id', 'name'] as const;

export function deepMerge(base: TomlObject, override: TomlObject): TomlObject {
  // Clone base profundamente para garantir imutabilidade — nenhuma referência
  // compartilhada entre input e output, mesmo quando override é vazio.
  const result: TomlObject = {};
  for (const [key, val] of Object.entries(base)) {
    result[key] = cloneValue(val as TomlValue);
  }
  for (const [key, overrideVal] of Object.entries(override)) {
    if (!(key in result)) {
      result[key] = cloneValue(overrideVal);
      continue;
    }
    const baseVal = result[key];
    result[key] = mergeValue(baseVal as TomlValue, overrideVal);
  }
  return result;
}

function mergeValue(base: TomlValue, override: TomlValue): TomlValue {
  if (Array.isArray(base) && Array.isArray(override)) {
    return mergeArrays(base, override);
  }
  if (isPlainObject(base) && isPlainObject(override)) {
    return deepMerge(base as TomlObject, override as TomlObject);
  }
  return cloneValue(override);
}

function mergeArrays(base: TomlValue[], override: TomlValue[]): TomlValue[] {
  // Detecta se ambos são arrays-of-tables com chave identificadora.
  const baseKeyField = detectKeyField(base);
  const overrideKeyField = detectKeyField(override);
  if (
    baseKeyField !== null &&
    baseKeyField === overrideKeyField &&
    base.every(isPlainObject) &&
    override.every(isPlainObject)
  ) {
    return mergeKeyedArrays(
      base as TomlObject[],
      override as TomlObject[],
      baseKeyField
    );
  }
  // Caso contrário: REPLACE.
  return override.map(cloneValue);
}

function mergeKeyedArrays(
  base: TomlObject[],
  override: TomlObject[],
  keyField: string
): TomlObject[] {
  const baseByKey = new Map<unknown, TomlObject>();
  for (const item of base) {
    baseByKey.set(item[keyField], item);
  }
  const seen = new Set<unknown>();
  const result: TomlObject[] = [];
  // Itens de override (substituem baseByKey ou adicionam novos).
  for (const item of override) {
    const key = item[keyField];
    seen.add(key);
    const baseItem = baseByKey.get(key);
    if (baseItem !== undefined) {
      result.push(deepMerge(baseItem, item));
    } else {
      result.push(cloneValue(item) as TomlObject);
    }
  }
  // Itens de base que NÃO foram tocados em override: mantêm posição.
  // Estratégia: itens não-substituídos vêm DEPOIS dos substituídos/novos para
  // manter "última versão prevalece visualmente".
  for (const item of base) {
    if (!seen.has(item[keyField])) {
      result.push(cloneValue(item) as TomlObject);
    }
  }
  return result;
}

function detectKeyField(arr: TomlValue[]): string | null {
  if (arr.length === 0) return null;
  const first = arr[0];
  if (!isPlainObject(first)) return null;
  for (const field of KEYED_FIELDS) {
    if (field in (first as TomlObject)) return field;
  }
  return null;
}

function isPlainObject(v: unknown): v is TomlObject {
  return (
    typeof v === 'object' && v !== null && !Array.isArray(v) && !(v instanceof Date)
  );
}

function cloneValue(v: TomlValue): TomlValue {
  if (Array.isArray(v)) return v.map(cloneValue);
  if (v instanceof Date) return new Date(v.getTime());
  if (isPlainObject(v)) {
    const out: TomlObject = {};
    for (const [k, val] of Object.entries(v)) {
      out[k] = cloneValue(val as TomlValue);
    }
    return out;
  }
  return v;
}
