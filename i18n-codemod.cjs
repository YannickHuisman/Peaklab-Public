#!/usr/bin/env node
/**
 * i18n Codemod — Automatically replaces hardcoded Dutch strings with t() calls.
 *
 * Uses the NL translations as the single source of truth:
 *   1. Parses all NL key→value pairs from translations.ts
 *   2. Scans every .tsx file for those exact strings
 *   3. Replaces them contextually (JSX attrs, JSX children, string literals)
 *   4. Injects `useTranslation` import + hook where needed
 *
 * Usage:
 *   node i18n-codemod.js             # apply changes
 *   node i18n-codemod.js --dry-run   # preview only
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const TX_FILE = path.join(ROOT, 'apps/web/src/helpers/i18n/translations.ts');
const SRC_DIR = path.join(ROOT, 'apps/web/src');
const DRY = process.argv.includes('--dry-run');

// ─── 1. Parse NL translations ───────────────────────────────────────────────

const raw = fs.readFileSync(TX_FILE, 'utf-8');
const nlStart = raw.indexOf('nl: {');
const enStart = raw.indexOf('\n  en: {');

if (nlStart < 0 || enStart < 0) throw new Error('Cannot locate nl / en sections');
const nlBlock = raw.slice(nlStart, enStart);

const entries = [];
const kvRe = /'([a-zA-Z][a-zA-Z0-9_.]+)':\s*\n?\s*'((?:[^'\\]|\\.)*)'/g;
let m;

while ((m = kvRe.exec(nlBlock))) {
  const value = m[2].replace(/\\'/g, "'");

  if (value.length >= 3) {
    entries.push({
      key: m[1],
      value,
      esc: value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    });
  }
}
// Longest first → avoids partial matches (e.g. "Opslaan..." before "Opslaan")
entries.sort((a, b) => b.value.length - a.value.length);
console.log(`📖  ${entries.length} NL translation entries loaded\n`);

// ─── 2. Collect .tsx source files ────────────────────────────────────────────

function walk(dir) {
  const out = [];

  for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, d.name);

    if (d.isDirectory()) out.push(...walk(p));
    else if (/\.tsx$/.test(d.name)) out.push(p);
  }

  return out;
}

const files = walk(SRC_DIR).filter((f) => !f.includes('/i18n/'));

// ─── 3. Helpers ──────────────────────────────────────────────────────────────

/** Find function bodies (PascalCase = React component) with brace matching */
function findComponentBodies(src) {
  const bodies = [];
  const re = /function\s+([A-Z]\w*)\s*\([^)]*\)\s*\{/g;
  let fm;

  while ((fm = re.exec(src))) {
    const openIdx = fm.index + fm[0].length - 1; // position of `{`
    let depth = 1;
    let i = openIdx + 1;

    while (i < src.length && depth > 0) {
      if (src[i] === '{') depth++;
      else if (src[i] === '}') depth--;
      i++;
    }
    bodies.push({
      name: fm[1],
      bodyStart: openIdx + 1, // char after `{`
      bodyEnd: i - 1, // char before `}`
    });
  }

  return bodies;
}

/** Insert `const { t } = useTranslation();` into component bodies that use t( */
function injectHooks(src) {
  const bodies = findComponentBodies(src);

  // Process in reverse order so indices stay valid after insertions
  for (let i = bodies.length - 1; i >= 0; i--) {
    const { bodyStart, bodyEnd } = bodies[i];
    const body = src.slice(bodyStart, bodyEnd);

    if (body.includes("t('") && !body.includes('useTranslation()')) {
      src =
        src.slice(0, bodyStart) + '\n  const { t } = useTranslation();\n' + src.slice(bodyStart);
    }
  }

  return src;
}

/** Add import statement after the last existing import */
function addImport(src) {
  if (src.includes('useTranslation')) return src;
  const lines = src.split('\n');
  let insertAfter = 0;

  for (let i = 0; i < lines.length; i++) {
    if (/^import\s/.test(lines[i])) {
      let j = i;

      while (j < lines.length && !lines[j].includes(';')) j++;
      insertAfter = j;
    }
  }
  lines.splice(insertAfter + 1, 0, "import { useTranslation } from '@helpers/i18n';");

  return lines.join('\n');
}

// ─── 4. Process every file ───────────────────────────────────────────────────

let changedCount = 0;

for (const fp of files) {
  let src = fs.readFileSync(fp, 'utf-8');
  const orig = src;
  const used = new Set();

  for (const { key, value, esc } of entries) {
    if (!src.includes(value)) continue;

    // a) JSX attribute:  prop="value" | prop='value'  →  prop={t('key')}
    src = src.replace(new RegExp(`(=)(["'])${esc}\\2`, 'g'), () => {
      used.add(key);

      return `={t('${key}')}`;
    });

    // b) JSX child text:  >value<  →  >{t('key')}<
    src = src.replace(new RegExp(`>(\\s*)${esc}(\\s*)<`, 'g'), (_, ws1, ws2) => {
      used.add(key);

      return `>${ws1}{t('${key}')}${ws2}<`;
    });

    // c) Remaining string literals:  'value' | "value"  →  t('key')
    src = src.replace(new RegExp(`(["'])${esc}\\1`, 'g'), () => {
      used.add(key);

      return `t('${key}')`;
    });
  }

  if (src === orig) continue;

  // Inject import + hooks
  src = addImport(src);
  src = injectHooks(src);

  const rel = path.relative(ROOT, fp);

  console.log(`${DRY ? '🔍' : '✓ '} ${rel}  (${used.size} keys: ${[...used].join(', ')})`);

  if (!DRY) fs.writeFileSync(fp, src);
  changedCount++;
}

console.log(`\n${DRY ? '🔍 Dry run:' : '✅'} ${changedCount} file(s) would be updated`);
