/**
 * Uzbek Latin → Cyrillic transliteration.
 * Used so that users can search the (Cyrillic) database content using Latin input.
 *
 * Order matters: multi-letter combinations must be replaced first.
 */

// Multi-character (digraphs) — order matters
const DIGRAPHS: Array<[RegExp, string]> = [
  [/sh/gi, 'ш'],
  [/ch/gi, 'ч'],
  [/yo/gi, 'ё'],
  [/yu/gi, 'ю'],
  [/ya/gi, 'я'],
  [/o['ʻ`']/g, 'ў'],
  [/g['ʻ`']/g, 'ғ'],
  [/O['ʻ`']/g, 'Ў'],
  [/G['ʻ`']/g, 'Ғ'],
];

const SINGLES: Record<string, string> = {
  a: 'а',
  b: 'б',
  d: 'д',
  e: 'е',
  f: 'ф',
  g: 'г',
  h: 'ҳ',
  i: 'и',
  j: 'ж',
  k: 'к',
  l: 'л',
  m: 'м',
  n: 'н',
  o: 'о',
  p: 'п',
  q: 'қ',
  r: 'р',
  s: 'с',
  t: 'т',
  u: 'у',
  v: 'в',
  x: 'х',
  y: 'й',
  z: 'з',
  c: 'с',
  "'": 'ъ',
  ʼ: 'ъ',
};

/** Returns true if string has Latin (a-z) characters. */
export function hasLatin(text: string): boolean {
  return /[a-zA-Z]/.test(text);
}

/** Returns true if string has Cyrillic characters. */
export function hasCyrillic(text: string): boolean {
  return /[\u0400-\u04FF]/.test(text);
}

/**
 * Transliterate Latin (Uzbek) → Cyrillic. Non-letter characters pass through.
 * Leaves Cyrillic chars untouched.
 */
export function latinToCyrillicUz(text: string): string {
  if (!text || !hasLatin(text)) return text;

  let result = text;

  for (const [pattern, replacement] of DIGRAPHS) {
    result = result.replace(pattern, replacement);
  }

  result = result
    .split('')
    .map(ch => {
      const lower = ch.toLowerCase();
      const mapped = SINGLES[lower];
      if (!mapped) return ch;
      return ch === lower ? mapped : mapped.toUpperCase();
    })
    .join('');

  return result;
}
