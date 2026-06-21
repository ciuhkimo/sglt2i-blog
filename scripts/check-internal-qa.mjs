#!/usr/bin/env node
/**
 * check-internal-qa.mjs — production internal-QA leak gate
 *
 * 掃描 src/content/ 的 .md/.mdx，攔截「內部 QA / 工作流程 artifact」洩漏到上線內容。
 * 由 .githooks/pre-push 在 push（→ Vercel 上線）前自動執行；也可手動 `npm run check:content`。
 *
 * 兩層設計（2026-06-21 校準，對齊 memory feedback_no_internal_qa_in_production）：
 *   BLOCK → 阻擋 push（exit 1）。只放「明確內部 artifact + 零誤殺 + 當前 0 命中」的 pattern。
 *           ⚠️ 新增 BLOCK pattern 前務必先確認當前內容 0 命中，否則會擋掉正常 push。
 *   WARN  → 印出但不阻擋（exit 0）。判斷題 / 待清理的 reader-facing 殘留 / 需逐句人工判斷者。
 *           清乾淨後可把對應 pattern 從 WARN 升到 BLOCK。
 *
 * 刻意【不】納入（校準確認為合法用法，避免誤殺）：
 *   - "Stage 4/5"（臨床 CKD 分期）、"Stage A/B/C"（ACC/AHA HF 分期）
 *   - "consensus"（KDIGO/國際共識）、"synthesis"（evidence synthesis 臨床用語）
 *   - "NTUH"（pa/q11 為合法轉介資源 + 研究引用，非冒充）
 *   - 方法學透明聲明（「整合 ChatGPT/Claude/Gemini Deep Research + Consensus」「人工校閱」）
 *   - 散在 prose 的「不宜寫成X」（多為合法作者 caveat → 放 WARN 逐句判斷）
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const CONTENT_DIR = fileURLToPath(new URL('../src/content/', import.meta.url));

const BLOCK = [
  { re: /✓✓✓/, label: '驗證勾記 ✓✓✓' },
  { re: /\bSkeleton\b/i, label: 'Skeleton（草稿佔位）' },
  { re: /Stage\s*\d\s*\+\s*\d/, label: 'workflow 階段串（Stage 1+2…，非臨床分期）' },
  { re: /\bsynthesis\.md\b/i, label: '內部檔名 synthesis.md' },
  { re: /\bdecision-note\.md\b/i, label: '內部檔名 decision-note.md' },
  { re: /\bAgent\.md\b/, label: '內部檔名 Agent.md' },
  { re: /\bevidence-\d+\b/i, label: '內部 evidence-NN 引用' },
  { re: /auto\d+\s*新增/, label: '自動化 run 標記（autoN 新增）' },
  { re: /下輪人工校稿|建議下輪|待人工審閱|人工校稿/, label: 'workflow 校稿 TODO' },
  { re: /校正自/, label: '審稿語言「校正自」' },
  { re: /Claude\s*立場/, label: '審稿語言「Claude 立場」' },
  { re: /自行更新此|請核對後/, label: '審稿語言（請讀者自行更新/核對後）' },
  { re: /\[(TODO|FIXME|待查|待補|待確認)/i, label: '編輯佔位 [TODO]/[待查]…' },
];

const WARN = [
  { re: /^status:\s*['"]?(已定稿|草稿|已發布|查核修訂版|已修訂)/, label: 'frontmatter status 內部值（listing 頁會顯示給讀者）' },
  { re: /查核修訂|查核版/, label: '內部狀態標籤「查核修訂/查核版」（reader-facing，清乾淨後可升 BLOCK）' },
  { re: /未能(直接)?核實|無法核實|本次查核|本輪[^。\n]{0,8}核實/, label: '審稿過程語言（未能核實/本次查核 → 清乾淨後可升 BLOCK）' },
  { re: /待核實/, label: '「待核實」（逐句判斷：reader caveat vs 內部 QA 狀態）' },
  { re: /不宜(寫成|標成|標為|描述成|混列|掛在)/, label: '「不宜寫成X」（多為合法作者 caveat，逐句確認非 bracketed 編輯註）' },
];

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (/\.mdx?$/.test(name)) out.push(p);
  }
  return out;
}

const files = walk(CONTENT_DIR);
const blockHits = [];
const warnHits = [];

for (const file of files) {
  const rel = file.slice(CONTENT_DIR.length);
  const lines = readFileSync(file, 'utf-8').split('\n');
  lines.forEach((line, i) => {
    for (const { re, label } of BLOCK) {
      const m = line.match(re);
      if (m) blockHits.push({ rel, ln: i + 1, label, hit: m[0], line: line.trim().slice(0, 90) });
    }
    for (const { re, label } of WARN) {
      const m = line.match(re);
      if (m) warnHits.push({ rel, ln: i + 1, label, hit: m[0], line: line.trim().slice(0, 90) });
    }
  });
}

const fmt = (h) => `  ${h.rel}:${h.ln}  [${h.label}]\n      ↳ 命中「${h.hit}」: ${h.line}`;
const verbose = process.argv.includes('--verbose');

if (warnHits.length) {
  const byLabel = {};
  for (const h of warnHits) byLabel[h.label] = (byLabel[h.label] || 0) + 1;
  console.warn(`\n⚠️  internal-QA WARN：${warnHits.length} 處（不阻擋 push；建議人工清理，清乾淨後可升 BLOCK）`);
  for (const [label, n] of Object.entries(byLabel).sort((a, b) => b[1] - a[1])) {
    console.warn(`   ${String(n).padStart(3)} × ${label}`);
  }
  if (verbose) { console.warn(''); for (const h of warnHits) console.warn(fmt(h)); }
  else console.warn('   （逐行明細：npm run check:content）');
}

if (blockHits.length) {
  console.error(`\n❌ internal-QA BLOCK（${blockHits.length} 處）— push 已阻擋。請清除後再 push：`);
  for (const h of blockHits) console.error(fmt(h));
  console.error('\n（緊急繞過：git push --no-verify。但 production 上線請勿輕用。）\n');
  process.exit(1);
}

console.log(`✓ internal-QA BLOCK 檢查通過（掃 ${files.length} 檔；WARN ${warnHits.length} 處不阻擋）。`);
process.exit(0);
