/**
 * sync-assets.mjs - 跨平台素材同步脚本
 * 功能等价于 sync-assets.sh，但在 Windows/Mac/Linux 均可运行
 *
 * 将 assets/ 目录下的素材复制到 public/ 对应位置：
 *   assets/design/*   → public/works/
 *   assets/panorama/* → public/works/
 *   assets/avatar/*   → public/
 */
import { copyFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectDir = join(__dirname, '..');
const assetsDir = join(projectDir, 'assets');
const publicDir = join(projectDir, 'public');
const publicWorksDir = join(publicDir, 'works');

// 确保目标目录存在
mkdirSync(publicWorksDir, { recursive: true });

let totalCopied = 0;

/**
 * 复制目录中的文件（仅一层，不覆盖已有文件）
 */
function syncDir(srcDir, destDir, { overwrite = false } = {}) {
  if (!existsSync(srcDir)) return;

  const entries = readdirSync(srcDir);
  for (const entry of entries) {
    // 跳过隐藏文件 (.DS_Store 等)
    if (entry.startsWith('.')) continue;

    const srcPath = join(srcDir, entry);
    const destPath = join(destDir, entry);

    // 只复制文件，跳过子目录
    if (!statSync(srcPath).isFile()) continue;

    if (!overwrite && existsSync(destPath)) continue;

    copyFileSync(srcPath, destPath);
    totalCopied++;
  }
}

// 执行同步
syncDir(join(assetsDir, 'design'), publicWorksDir);
syncDir(join(assetsDir, 'panorama'), publicWorksDir);
syncDir(join(assetsDir, 'avatar'), publicDir);

console.log(`✓ 素材同步完成 → public/works/`);
console.log(`  共复制 ${totalCopied} 个新文件`);

// 统计 public/works 下的文件总数
if (existsSync(publicWorksDir)) {
  const total = readdirSync(publicWorksDir).filter(f => !f.startsWith('.')).length;
  console.log(`  public/works/ 目录共 ${total} 个文件`);
}
