// Safe evaluator for the small arithmetic formula language used by derived
// biomarkers (ratios / calculated values). It replaces a previous `new
// Function(...)` implementation so no formula string is ever executed as code.
//
// Supported grammar (standard precedence, left-associative):
//   expr   := term (('+' | '-') term)*
//   term   := factor (('*' | '/') factor)*
//   factor := ('+' | '-') factor | number | identifier | '(' expr ')'
//
// Identifiers are dependency roles resolved from `scope`. Any tokenization,
// parse, or evaluation problem (unknown identifier, division by zero, trailing
// input, non-finite result) yields `null` so the caller skips the value.

type Token =
  | { type: 'number'; value: number }
  | { type: 'ident'; value: string }
  | { type: 'op'; value: '+' | '-' | '*' | '/' }
  | { type: 'lparen' }
  | { type: 'rparen' };

const isDigit = (ch: string) => ch >= '0' && ch <= '9';
const isIdentStart = (ch: string) =>
  (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || ch === '_';
const isIdentPart = (ch: string) => isIdentStart(ch) || isDigit(ch);
const isSpace = (ch: string) => ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r';

function tokenize(input: string): Token[] | null {
  const tokens: Token[] = [];
  let i = 0;

  // `charAt` returns '' past the end, so indexing never yields `undefined`.
  while (i < input.length) {
    const ch = input.charAt(i);

    if (isSpace(ch)) {
      i++;
      continue;
    }

    if (ch === '+' || ch === '-' || ch === '*' || ch === '/') {
      tokens.push({ type: 'op', value: ch });
      i++;
      continue;
    }

    if (ch === '(') {
      tokens.push({ type: 'lparen' });
      i++;
      continue;
    }

    if (ch === ')') {
      tokens.push({ type: 'rparen' });
      i++;
      continue;
    }

    if (isDigit(ch) || ch === '.') {
      let num = '';
      let dots = 0;

      while (i < input.length && (isDigit(input.charAt(i)) || input.charAt(i) === '.')) {
        if (input.charAt(i) === '.' && ++dots > 1) return null;
        num += input.charAt(i);
        i++;
      }

      const value = Number(num);

      if (!Number.isFinite(value)) return null;
      tokens.push({ type: 'number', value });
      continue;
    }

    if (isIdentStart(ch)) {
      let id = '';

      while (i < input.length && isIdentPart(input.charAt(i))) {
        id += input.charAt(i);
        i++;
      }

      tokens.push({ type: 'ident', value: id });
      continue;
    }

    // Any other character is disallowed.
    return null;
  }

  return tokens;
}

/**
 * Evaluate an arithmetic formula against a role->value scope without executing
 * it as code. Returns `null` for any malformed or non-computable input.
 */
export function evaluateExpression(formula: string, scope: Record<string, number>): number | null {
  const tokens = tokenize(formula);

  if (!tokens || tokens.length === 0) return null;

  let pos = 0;

  const parseExpr = (): number | null => {
    let left = parseTerm();

    if (left === null) return null;

    while (pos < tokens.length) {
      const tok = tokens[pos];

      if (!tok || tok.type !== 'op' || (tok.value !== '+' && tok.value !== '-')) break;
      pos++;
      const right = parseTerm();

      if (right === null) return null;
      left = tok.value === '+' ? left + right : left - right;
    }

    return left;
  };

  const parseTerm = (): number | null => {
    let left = parseFactor();

    if (left === null) return null;

    while (pos < tokens.length) {
      const tok = tokens[pos];

      if (!tok || tok.type !== 'op' || (tok.value !== '*' && tok.value !== '/')) break;
      pos++;
      const right = parseFactor();

      if (right === null) return null;

      if (tok.value === '/') {
        if (right === 0) return null; // division by zero — not computable
        left = left / right;
      } else {
        left = left * right;
      }
    }

    return left;
  };

  const parseFactor = (): number | null => {
    const tok = tokens[pos];

    if (!tok) return null;

    if (tok.type === 'op' && (tok.value === '+' || tok.value === '-')) {
      pos++;
      const val = parseFactor();

      if (val === null) return null;

      return tok.value === '-' ? -val : val;
    }

    if (tok.type === 'number') {
      pos++;

      return tok.value;
    }

    if (tok.type === 'ident') {
      pos++;
      const v = scope[tok.value];

      return typeof v === 'number' && Number.isFinite(v) ? v : null;
    }

    if (tok.type === 'lparen') {
      pos++;
      const val = parseExpr();

      if (val === null) return null;

      const close = tokens[pos];

      if (!close || close.type !== 'rparen') return null;
      pos++;

      return val;
    }

    return null;
  };

  const result = parseExpr();

  if (result === null || pos !== tokens.length) return null; // malformed / trailing input

  return Number.isFinite(result) ? result : null;
}
