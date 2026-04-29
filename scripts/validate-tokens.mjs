import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cssPath = path.join(packageRoot, 'dist', 'ironvale.css');
const aetherTokensPath = path.resolve(packageRoot, '..', 'aether', 'tokens', 'tokens.css');

const hardcodedPatterns = [
  { label: 'hex color', pattern: /#[0-9a-fA-F]{3,8}\b/g },
  { label: 'rgb color', pattern: /\brgba?\(/g },
  { label: 'hsl color', pattern: /\bhsla?\(/g }
];
const pxLiteralPattern = /\b\d+(?:\.\d+)?px\b/g;

function lineNumberFor(source, index) {
  return source.slice(0, index).split('\n').length;
}

function collectHardcodedViolations(css) {
  const violations = [];

  for (const { label, pattern } of hardcodedPatterns) {
    for (const match of css.matchAll(pattern)) {
      violations.push({
        line: lineNumberFor(css, match.index ?? 0),
        label,
        value: match[0]
      });
    }
  }

  return violations;
}

function isInsideVarCall(source, index) {
  const before = source.slice(0, index);
  const lastVar = before.lastIndexOf('var(');

  if (lastVar === -1) {
    return false;
  }

  const closingParen = before.lastIndexOf(')');
  return closingParen < lastVar;
}

function collectPxViolations(css) {
  const violations = [];

  for (const match of css.matchAll(pxLiteralPattern)) {
    const index = match.index ?? 0;

    if (isInsideVarCall(css, index)) {
      continue;
    }

    violations.push({
      line: lineNumberFor(css, index),
      label: 'px literal',
      value: match[0]
    });
  }

  return violations;
}

function collectTokenNames(source) {
  const tokenNames = new Set();
  const declarationPattern = /(--ae-[\w-]+)\s*:/g;

  for (const match of source.matchAll(declarationPattern)) {
    tokenNames.add(match[1]);
  }

  return tokenNames;
}

function collectTokenReferences(css) {
  const tokenReferences = new Set();
  const referencePattern = /var\(\s*(--ae-[\w-]+)/g;

  for (const match of css.matchAll(referencePattern)) {
    tokenReferences.add(match[1]);
  }

  return tokenReferences;
}

const [css, aetherTokens] = await Promise.all([
  readFile(cssPath, 'utf8'),
  readFile(aetherTokensPath, 'utf8')
]);

const hardcodedViolations = [...collectHardcodedViolations(css), ...collectPxViolations(css)];
const definedAetherTokens = collectTokenNames(aetherTokens);
const tokenReferences = collectTokenReferences(css);
const danglingReferences = [...tokenReferences].filter((token) => !definedAetherTokens.has(token));

if (hardcodedViolations.length > 0 || danglingReferences.length > 0) {
  console.error('Ironvale token validation failed.');

  for (const violation of hardcodedViolations) {
    console.error(`- ${violation.label} at ${path.relative(packageRoot, cssPath)}:${violation.line}: ${violation.value}`);
  }

  for (const token of danglingReferences) {
    console.error(`- undefined Aether token reference: ${token}`);
  }

  process.exit(1);
}

console.log(`Ironvale token validation passed (${tokenReferences.size} Aether references checked).`);
