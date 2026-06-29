'use strict';

import * as esbuild from 'esbuild';
import { cp, rm, mkdir } from 'node:fs/promises';
import path from 'node:path';

const watch = process.argv.includes('--watch');
const srcDir = 'app';
const outDir = 'dist';

// app/ から dist/ へそのままコピーする静的アセット
const staticAssets = ['manifest.json', 'images', 'styles', '_locales'];

async function copyStatic() {
  await Promise.all(
    staticAssets.map((name) =>
      cp(path.join(srcDir, name), path.join(outDir, name), { recursive: true })
    )
  );
}

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });
await copyStatic();

const ctx = await esbuild.context({
  entryPoints: { 'scripts/contentscript': path.join(srcDir, 'scripts', 'contentscript.ts') },
  bundle: true,
  outdir: outDir,
  target: 'chrome88',
  format: 'iife',
  sourcemap: watch ? 'inline' : false,
  minify: !watch,
  logLevel: 'info',
});

if (watch) {
  await ctx.rebuild();
  await ctx.watch();
  console.log('watching for changes... (manifest や静的ファイルを変更した場合は再起動してください)');
} else {
  await ctx.rebuild();
  await ctx.dispose();
}
