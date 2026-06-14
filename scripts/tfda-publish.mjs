#!/usr/bin/env node
/**
 * tfda-publish.mjs — 醫藥監管週報「核可發布」helper（人工審閱後的最後一步）
 *
 * 做什麼：
 *   1. 驗證指定週報草稿（無待審 placeholder、無內部 QA 痕跡、有官方原文連結、無 LaTeX）。
 *   2. 把 frontmatter 的 review_status: needs_physician_review → physician_reviewed。
 *   3. 本地 git commit（**不 push、不 deploy**）。
 *
 * 不做什麼：不 push、不觸發 Vercel。上線（push）永遠是人工明確動作。
 *
 * 用法：
 *   node scripts/tfda-publish.mjs 2026-06-14-tfda-weekly            # 驗證→翻 status→本地 commit
 *   node scripts/tfda-publish.mjs 2026-06-14-tfda-weekly --dry-run  # 只驗證與預覽，不寫不 commit
 *   npm run tfda:publish -- 2026-06-14-tfda-weekly
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const slug = args.find((a) => !a.startsWith('--'));

if (!slug) {
	console.error('用法：node scripts/tfda-publish.mjs <slug> [--dry-run]');
	console.error('例：node scripts/tfda-publish.mjs 2026-06-14-tfda-weekly');
	process.exit(2);
}

const relPath = `src/content/regulatory/${slug}.md`;
const filePath = resolve(REPO_ROOT, relPath);
if (!existsSync(filePath)) {
	console.error(`❌ 找不到草稿：${relPath}`);
	process.exit(2);
}

const raw = readFileSync(filePath, 'utf8');

// ---- 驗證 gate -----------------------------------------------------------------
const problems = [];

if (!/review_status:\s*\w+/.test(raw)) problems.push('frontmatter 缺 review_status 欄位');
if (/review_status:\s*physician_reviewed/.test(raw)) {
	console.error(`ℹ️ ${slug} 已是 physician_reviewed，無需再核可。`);
	process.exit(0);
}

// 待審 placeholder（fetch 自動草稿留下的）— 必須先補完
const PLACEHOLDERS = ['（待審）', '（待醫師', '待醫師審閱補寫', '待醫師確認', 'TODO', '（待補', '<!-- '];
for (const p of PLACEHOLDERS) {
	if (raw.includes(p)) problems.push(`仍有待審 placeholder：「${p}」`);
}

// 內部 QA 痕跡 — 不得進 production
const INTERNAL_QA = [/Stage\s*[0-9C]/, /ChatGPT/i, /Codex/i, /NTUH/, /fact.?check/i, /✓✓✓/, /Skeleton/i, /外審/];
for (const re of INTERNAL_QA) {
	if (re.test(raw)) problems.push(`內部 QA 痕跡：${re}`);
}

// LaTeX — 全站 Unicode 政策
if (/\\\(|\\\)|\\\[|\\frac|\$\$/.test(raw)) problems.push('含 LaTeX（應改 Unicode）');

// 每篇至少要有官方原文連結
if (!/fda\.gov\.tw/.test(raw)) problems.push('找不到任何官方原文連結（fda.gov.tw）');

if (problems.length > 0) {
	console.error(`\n❌ ${slug} 未通過發布前驗證：`);
	for (const p of problems) console.error(`   - ${p}`);
	console.error('\n請先補完草稿再核可。');
	process.exit(1);
}

console.log(`✅ ${slug} 通過發布前驗證（無待審/內部QA/LaTeX、有官方連結）。`);

// ---- 翻 review_status ----------------------------------------------------------
const updated = raw.replace(/review_status:\s*needs_physician_review/, 'review_status: physician_reviewed');

if (dryRun) {
	console.log('\n[dry-run] 將執行：');
	console.log('  - review_status: needs_physician_review → physician_reviewed');
	console.log(`  - git add ${relPath}`);
	console.log(`  - git commit（不 push）`);
	console.log('\n（dry-run 未寫檔、未 commit。）');
	process.exit(0);
}

writeFileSync(filePath, updated);
console.log('✍️  已翻 review_status → physician_reviewed');

// ---- 本地 commit（不 push）------------------------------------------------------
try {
	execFileSync('git', ['-C', REPO_ROOT, 'add', relPath], { stdio: 'inherit' });
	execFileSync('git', ['-C', REPO_ROOT, 'commit', '-m',
		`醫藥監管週報上線核可：${slug}（review_status→physician_reviewed）`], { stdio: 'inherit' });
	console.log('\n✅ 已本地 commit（未 push）。');
	console.log('下一步：');
	console.log('  1. 最後看一次 rendered 頁面（npm run dev → /regulatory/）。');
	console.log('  2. 確認無誤後手動 push（git push）→ Vercel 才會部署上線。');
} catch (e) {
	console.error(`\n⚠️ git commit 失敗：${e.message}`);
	console.error('（review_status 已翻好，可手動 git add/commit。）');
	process.exit(1);
}
