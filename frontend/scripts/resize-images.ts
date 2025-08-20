import path from 'path';

import fs from 'fs-extra';
import sharp from 'sharp';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// CLI 引数を定義
const argv = yargs(hideBin(process.argv))
  .option('input', {
    alias: 'i',
    type: 'string',
    demandOption: true,
    describe: '入力ディレクトリ',
  })
  .option('output', {
    alias: 'o',
    type: 'string',
    demandOption: true,
    describe: '出力ディレクトリ',
  })
  .option('size', {
    alias: 's',
    type: 'number',
    demandOption: true,
    describe: 'リサイズ後の幅(px)',
  })
  .help()
  .parseSync();

async function main() {
  const inputDir = path.resolve(argv.input);
  const outputDir = path.resolve(argv.output);
  const size = argv.size;

  // 出力ディレクトリを作成
  await fs.ensureDir(outputDir);

  // 入力ディレクトリのファイル一覧取得
  const files = await fs.readdir(inputDir);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const basename = path.basename(file, ext);

    // 対象は画像ファイルのみ
    if (!['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext)) continue;

    const inputPath = path.join(inputDir, file);
    const outputFile = `${basename}-${size.toString()}${ext}`;
    const outputPath = path.join(outputDir, outputFile);

    try {
      await sharp(inputPath)
        .resize(size) // 幅を size に、縦横比維持
        .png()
        .toFile(outputPath);

      console.log(`✔ ${outputFile}`);
    } catch (err) {
      console.error(`✘ Failed: ${file}`, err);
    }
  }
}

await main();
