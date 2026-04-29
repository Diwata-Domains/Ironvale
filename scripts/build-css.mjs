import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = path.join(packageRoot, 'src', 'ironvale.css');
const outputPath = path.join(packageRoot, 'dist', 'ironvale.css');

const importPattern = /^\s*@import\s+["'](?<specifier>[^"']+)["'];\s*$/gm;

async function bundleCss(filePath, seen = new Set()) {
  const resolvedPath = path.resolve(filePath);

  if (seen.has(resolvedPath)) {
    return '';
  }

  seen.add(resolvedPath);

  const source = await readFile(resolvedPath, 'utf8');
  let output = '';
  let cursor = 0;

  for (const match of source.matchAll(importPattern)) {
    output += source.slice(cursor, match.index);
    cursor = match.index + match[0].length;

    const specifier = match.groups?.specifier;
    if (!specifier) {
      continue;
    }

    if (!specifier.startsWith('.')) {
      throw new Error(`Only relative CSS imports are supported: ${specifier}`);
    }

    const importedPath = path.resolve(path.dirname(resolvedPath), specifier);
    output += await bundleCss(importedPath, seen);
  }

  output += source.slice(cursor);
  return `${output.trim()}\n`;
}

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, await bundleCss(sourcePath), 'utf8');
