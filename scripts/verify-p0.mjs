#!/usr/bin/env node
/**
 * verify-p0.mjs — Re-runnable P0/P0.5 verification against built dist/ output.
 *
 * Usage:
 *   npm run build && node scripts/verify-p0.mjs
 *
 * Exit code 0 = all pass; non-zero = at least one failure.
 *
 * Designed to be extended: add new check sections as new P0.5 items arrive.
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, '..', 'dist');

const URLS_TO_CHECK = [
	'/sglt2i/',
	'/pa/',
	'/patient/',
	'/dialysis/',
	'/pa/q01-screening-indication/',
	'/pa/q11-taiwan-nhi-coverage/',
	'/pa/q06-ckd-pa-treatment/',
	'/ckm/q03-cardiorenal-syndrome-types/',
	'/patient/travel-dialysis-transplant/',
	'/blog/rural-ckd5-vascular-access-timing/',
	'/regulatory/',
];

let failures = 0;
let passes = 0;

function readPage(url) {
	const rel = url.replace(/^\//, '').replace(/\/$/, '');
	const path = rel === '' ? resolve(DIST, 'index.html') : resolve(DIST, rel, 'index.html');
	if (!existsSync(path)) return null;
	return readFileSync(path, 'utf8');
}

// Strip <script>, <style>, and <noscript> content. We DELIBERATELY do NOT strip <template>
// here anymore: the new Mermaid hardening stores DSL in <script type="text/plain">, not
// <template>. By only stripping <script>/<style>/<noscript>, our verify mirrors what
// readability extractors (Mozilla Readability, ChatGPT web reader) actually do — anything
// they would treat as visible article text remains in the stripped HTML and gets checked.
function stripScriptsAndStyles(html) {
	return html
		.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
		.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
		.replace(/<noscript[\s\S]*?<\/noscript>/gi, '');
}

function countMatches(html, pattern) {
	return (html.match(pattern) || []).length;
}

function ok(msg) { console.log(`  ✅ ${msg}`); passes++; }
function fail(msg) { console.log(`  ❌ ${msg}`); failures++; }

function extractHeader(html) {
	const m = html.match(/<header[\s\S]*?<\/header>/i);
	return m ? m[0] : '';
}

console.log('🔍 P0.5 Verification — Nephro Decisions site\n');
console.log(`Dist root: ${DIST}\n`);

// ============================================================
// Check 1: H1 unique (each URL should have exactly 1 <h1>)
// ============================================================
console.log('## Check 1: H1 unique (each page = exactly 1 <h1>)\n');
for (const url of URLS_TO_CHECK) {
	const html = readPage(url);
	if (!html) { fail(`${url}: dist HTML not found`); continue; }
	const count = countMatches(html, /<h1[\s>]/g);
	if (count === 1) ok(`${url}: 1 <h1>`);
	else fail(`${url}: ${count} <h1> (expected 1)`);
}

// ============================================================
// Check 2: Header brand uses <a class="site-brand">, no heading tag in <header>
// ============================================================
console.log('\n## Check 2: Header brand uses <a class="site-brand">, no heading tag in <header>\n');
for (const url of URLS_TO_CHECK) {
	const html = readPage(url);
	if (!html) continue;
	const headerHtml = extractHeader(html);
	const hasSiteBrand = /<a[^>]*class="[^"]*\bsite-brand\b[^"]*"/i.test(headerHtml);
	const hasHeadingInHeader = /<h[1-6][\s>]/i.test(headerHtml);
	if (hasSiteBrand && !hasHeadingInHeader) {
		ok(`${url}: <a class="site-brand"> present, no <h1-6> inside <header>`);
	} else {
		if (!hasSiteBrand) fail(`${url}: missing <a class="site-brand"> in <header>`);
		if (hasHeadingInHeader) fail(`${url}: <header> still contains a heading tag`);
	}
}

// ============================================================
// Check 3: <nav aria-label="Primary navigation"> exists in <header>
// ============================================================
console.log('\n## Check 3: <nav aria-label="Primary navigation"> in <header>\n');
for (const url of URLS_TO_CHECK) {
	const html = readPage(url);
	if (!html) continue;
	const headerHtml = extractHeader(html);
	const hasPrimaryNav = /<nav[^>]*aria-label="Primary navigation"/i.test(headerHtml);
	if (hasPrimaryNav) ok(`${url}: <nav aria-label="Primary navigation"> present`);
	else fail(`${url}: missing <nav aria-label="Primary navigation"> in <header>`);
}

// ============================================================
// Check 4: Markdown tables wrapped in <div class="table-wrapper" role="region" aria-label="...">
// ============================================================
console.log('\n## Check 4: table-wrapper present + a11y init script injects role/aria/tabindex\n');
const TABLE_PAGES = [
	'/pa/q11-taiwan-nhi-coverage/',
	'/ckm/q03-cardiorenal-syndrome-types/',
	'/pa/q06-ckd-pa-treatment/',
];
for (const url of TABLE_PAGES) {
	const html = readPage(url);
	if (!html) { fail(`${url}: dist HTML not found`); continue; }
	const wrapperCount = countMatches(html, /<div[^>]*class="[^"]*\btable-wrapper\b[^"]*"/g);
	if (wrapperCount === 0) {
		fail(`${url}: no .table-wrapper found`);
		continue;
	}
	// Static role/aria check (in case it's present at HTML level for older pages)
	const staticRole = countMatches(html, /<div[^>]*class="[^"]*\btable-wrapper\b[^"]*"[^>]*role="region"/g);
	// a11y init script injected globally via Footer.astro
	const hasInitScript = /\.table-wrapper/.test(html) &&
		/setAttribute\(['"]role['"],\s*['"]region['"]\)/.test(html) &&
		/setAttribute\(['"]aria-label['"],\s*['"]表格可水平捲動['"]\)/.test(html);
	if (staticRole === wrapperCount) {
		ok(`${url}: ${wrapperCount} wrapper(s), all have static role="region"`);
	} else if (hasInitScript) {
		ok(`${url}: ${wrapperCount} wrapper(s) + global a11y init script (runtime role/aria)`);
	} else {
		fail(`${url}: ${wrapperCount} wrappers, ${staticRole} static role, no runtime init script`);
	}
}

// Check that <th scope="col"> still in place (P0-4 regression check)
console.log('\n## Check 4b: <th scope="col"> regression check\n');
for (const url of TABLE_PAGES) {
	const html = readPage(url);
	if (!html) continue;
	const thTotal = countMatches(html, /<th[\s>]/g);
	const thScopeCol = countMatches(html, /<th[^>]*\bscope="col"/g);
	if (thTotal > 0 && thScopeCol === thTotal) ok(`${url}: ${thTotal} <th>, all have scope="col"`);
	else if (thTotal === 0) ok(`${url}: no <th> elements (skipped)`);
	else fail(`${url}: ${thTotal} <th> but only ${thScopeCol} have scope="col"`);
}

// ============================================================
// Check 5: Mermaid DSL must NOT appear as ordinary article text.
//          Source is stored in <template class="mermaid-source"> (inert),
//          <noscript> provides fallback, client init builds <div class="mermaid"> at runtime.
// ============================================================
console.log('\n## Check 5: Mermaid source isolated in <template> + <noscript> fallback (no raw flowchart in visible body)\n');
const MERMAID_PAGES_WITH_DIAGRAM = [
	'/pa/q01-screening-indication/',
	'/pa/q05-surgery-vs-mra-treatment/',
	'/pa/q06-ckd-pa-treatment/',
];
const MERMAID_RENDERER_SAMPLES = ['/sglt2i/', '/index.html', '/pa/q06-ckd-pa-treatment/'];

for (const url of MERMAID_PAGES_WITH_DIAGRAM) {
	const rawHtml = readPage(url);
	if (!rawHtml) { fail(`${url}: dist HTML not found`); continue; }
	const visible = stripScriptsAndStyles(rawHtml);

	// Visible body must NOT contain raw Mermaid DSL
	const flowchartInVisible = countMatches(visible, /flowchart\s+(TD|LR|TB|BT|RL)/g);
	if (flowchartInVisible !== 0) {
		fail(`${url}: ${flowchartInVisible} raw 'flowchart XX' in visible article body (must be 0)`);
		continue;
	}

	// Must NOT have <pre data-language="mermaid"> anywhere (old Shiki output)
	const preMermaid = countMatches(rawHtml, /<pre[^>]*data-language="mermaid"/g);
	if (preMermaid !== 0) {
		fail(`${url}: ${preMermaid} <pre data-language="mermaid"> in full HTML (must be 0)`);
		continue;
	}

	// Container with data-mermaid-src (URL-encoded DSL) + noscript fallback must exist
	const container = countMatches(rawHtml, /<div[^>]*class="[^"]*\bmermaid-container\b[^"]*"/g);
	const dataAttr = countMatches(rawHtml, /<div[^>]*data-mermaid-src="[^"]+"/g);
	const noscript = countMatches(rawHtml, /本決策流程圖需要 JavaScript/g);
	// Strict: no literal DSL syntax anywhere in readability-visible body
	const flowchartLiteralVisible = countMatches(visible, /flowchart\s+(TD|LR|TB|BT|RL)/g);
	if (container >= 1 && dataAttr >= 1 && noscript >= 1 && flowchartLiteralVisible === 0) {
		ok(`${url}: ${container} mermaid-container + ${dataAttr} data-mermaid-src + ${noscript} <noscript> (0 literal DSL syntax in readability-visible body)`);
	} else {
		fail(`${url}: container=${container}, dataAttr=${dataAttr}, noscript=${noscript}, visible flowchart literal=${flowchartLiteralVisible} (last must be 0)`);
	}
}
for (const url of MERMAID_RENDERER_SAMPLES) {
	const html = readPage(url);
	if (!html) continue;
	// 驗「renderer 存在」的不變量，不綁實作來源。
	// 2026-08-23 兩次調整：
	//  ① 原本測 /mermaid@11/ —— 那其實是在測 jsdelivr CDN 網址字串，自 host 後消失。
	//  ② renderer 改由 Astro/Vite 打包成外部 chunk，標記不再出現在 HTML 內。
	// 故改為：跟著頁面引用的 Footer script chunk 進去，驗容器選取器 + a11y aria-label，
	// 並額外確認沒有殘留無法被瀏覽器解析的 bare specifier（import('mermaid')）。
	const scriptRefs = [...html.matchAll(/src="(\/_astro\/[^"]+\.js)"/g)].map((m) => m[1]);
	let rendererSrc = '';
	for (const ref of scriptRefs) {
		const f = resolve(DIST, ref.replace(/^\//, ''));
		if (existsSync(f)) rendererSrc += readFileSync(f, 'utf8');
	}
	const probe = html + rendererSrc;
	const bareSpecifier = /import\(\s*['"]mermaid['"]\s*\)/.test(probe);
	const hasScript =
		/mermaid-container\[data-mermaid-src\]/.test(probe) &&
		/Mermaid 臨床決策流程圖/.test(probe) &&
		!bareSpecifier;
	if (bareSpecifier) {
		fail(`${url}: renderer 殘留 bare specifier import('mermaid')，瀏覽器無法解析（圖會靜默失敗）`);
		continue;
	}
	if (hasScript) ok(`${url}: Mermaid renderer script + aria-label string present`);
	else fail(`${url}: Mermaid renderer script or aria-label missing`);
}

// ============================================================
// Check 6: RSS feed exists in dist + is valid XML + lists multiple collections
// ============================================================
console.log('\n## Check 6: /rss.xml exists + valid XML + multi-collection items\n');
const rssPath = resolve(DIST, 'rss.xml');
if (!existsSync(rssPath)) {
	fail('dist/rss.xml not found');
} else {
	const rss = readFileSync(rssPath, 'utf8');
	if (!rss.startsWith('<?xml')) fail('rss.xml does not start with <?xml declaration');
	else ok('rss.xml starts with valid <?xml declaration');

	const itemCount = countMatches(rss, /<item>/g);
	if (itemCount >= 60) ok(`rss.xml has ${itemCount} <item> entries`);
	else fail(`rss.xml only has ${itemCount} <item> entries (expected >= 60)`);

	const requiredClusters = ['/sglt2i/', '/pa/', '/ckm/', '/patient/', '/dialysis/', '/blog/'];
	for (const cluster of requiredClusters) {
		const hasCluster = rss.includes(`nephrodecisions.com${cluster}`);
		if (hasCluster) ok(`rss.xml contains items from ${cluster}`);
		else fail(`rss.xml missing items from ${cluster}`);
	}
}

// ============================================================
// Check 7: sitemap exists + has lastmod
// ============================================================
console.log('\n## Check 7: /sitemap-0.xml exists + URLs have lastmod\n');
const sitemapPath = resolve(DIST, 'sitemap-0.xml');
if (!existsSync(sitemapPath)) {
	fail('dist/sitemap-0.xml not found');
} else {
	const sitemap = readFileSync(sitemapPath, 'utf8');
	const locCount = countMatches(sitemap, /<loc>/g);
	const lastmodCount = countMatches(sitemap, /<lastmod>/g);
	if (locCount > 0 && lastmodCount === locCount) {
		ok(`sitemap-0.xml has ${locCount} URLs, all with <lastmod>`);
	} else {
		fail(`sitemap-0.xml: ${locCount} <loc>, ${lastmodCount} <lastmod> (mismatch)`);
	}
}

// ============================================================
// Check 8: No raw Markdown pipe table leak (broken separator → paragraph)
// ============================================================
console.log('\n## Check 8: No raw "| col1 | col2 |" Markdown pipe rows leaked as paragraph text\n');
const PIPE_LEAK_PAGES = [
	'/pa/q11-taiwan-nhi-coverage/',
	'/ckm/q01-ckm-definition-staging/',
	'/pa/q06-ckd-pa-treatment/',
];
for (const url of PIPE_LEAK_PAGES) {
	const html = readPage(url);
	if (!html) { fail(`${url}: dist HTML not found`); continue; }
	// Look for `| 中文 | 中文 |` or `| word | word |` patterns inside <p> or directly in <article>
	// crude but effective: search for "| 藥物 | 給付" specifically (was the known leak)
	// + general "<p>| " heuristic
	const knownLeak = /\|\s*藥物\s*\|\s*給付狀態\s*\|/.test(html);
	const pParaPipe = /<p[^>]*>\s*\|[^<]{10,}\|/.test(html);
	if (!knownLeak && !pParaPipe) ok(`${url}: no raw pipe-table paragraph leak`);
	else fail(`${url}: raw Markdown pipe leak detected${knownLeak ? ' (known: 藥物/給付狀態)' : ''}${pParaPipe ? ' (generic <p>|...|)' : ''}`);
}

// ============================================================
// Check 9: 醫藥監管週報 — 動態判定 draft/published（讀 content frontmatter）+ 專屬 RSS feed
//   draft（needs_physician_review）：noindex + 草稿 banner + 不列入列表/feed
//   published（physician_reviewed）：無 noindex + 在列表 + 在 feed
// ============================================================
console.log('\n## Check 9: /regulatory/ 動態 draft/published gate + dedicated RSS\n');
{
	// 9a: 專屬 feed 存在且為合法 XML
	const regRssPath = resolve(DIST, 'regulatory', 'rss.xml');
	const regRssRaw = existsSync(regRssPath) ? readFileSync(regRssPath, 'utf8') : '';
	if (!regRssRaw) {
		fail('dist/regulatory/rss.xml not found');
	} else if (regRssRaw.startsWith('<?xml')) {
		ok('/regulatory/rss.xml exists + valid <?xml declaration');
	} else {
		fail('/regulatory/rss.xml does not start with <?xml');
	}

	// 9b: 依 content frontmatter 的 review_status 動態驗證每期 gate
	const listingHtml = readPage('/regulatory/') || '';
	const REG_DIR = resolve(__dirname, '..', 'src', 'content', 'regulatory');
	const files = existsSync(REG_DIR) ? readdirSync(REG_DIR).filter((f) => f.endsWith('.md') || f.endsWith('.mdx')) : [];
	for (const f of files) {
		const slug = f.replace(/\.(md|mdx)$/, '');
		const url = `/regulatory/${slug}/`;
		const fm = readFileSync(resolve(REG_DIR, f), 'utf8');
		const isDraft = /review_status:\s*needs_physician_review/.test(fm);
		const html = readPage(url);
		if (!html) { fail(`${url}: dist HTML not found`); continue; }

		const hasNoindex = /name="robots"\s+content="noindex/i.test(html);
		const inListing = listingHtml.includes(`href="${url}"`);
		const inFeed = regRssRaw.includes(url);

		if (isDraft) {
			const hasDraftBanner = /尚未經醫師審閱/.test(html);
			if (hasNoindex && hasDraftBanner && !inListing && !inFeed) {
				ok(`${url}: [draft] noindex + 草稿 banner + 未列入列表 + 未進 feed`);
			} else {
				if (!hasNoindex) fail(`${url}: [draft] 缺 noindex`);
				if (!hasDraftBanner) fail(`${url}: [draft] 缺草稿 banner`);
				if (inListing) fail(`${url}: [draft] 不應出現在已發布列表`);
				if (inFeed) fail(`${url}: [draft] 不應出現在 feed`);
			}
		} else {
			if (!hasNoindex && inListing && inFeed) {
				ok(`${url}: [published] 無 noindex + 在列表 + 在 feed`);
			} else {
				if (hasNoindex) fail(`${url}: [published] 不應有 noindex`);
				if (!inListing) fail(`${url}: [published] 應出現在列表`);
				if (!inFeed) fail(`${url}: [published] 應出現在 feed`);
			}
		}
	}
}

// ============================================================
// Check 10: 內部連結 slug 對得上 dist 路由（死連結 hard-fail）
//   每個 content 內部連結 slug 必須對應一個 dist 路由。
//   死連結 = reader 404 + 醫療站 E-E-A-T 傷害 → 擋 build。
//   ALLOWLIST：蓄意排程、尚未上線的兄弟 Q-note（標記後不視為死連結）。
// ============================================================
console.log('\n## Check 10: 內部連結 slug 對得上 dist 路由（死連結 hard-fail）\n');
{
	// 列舉所有 dist 路由（含尾斜線）
	const routes = new Set(['/']);
	(function walk(dir) {
		for (const e of readdirSync(dir, { withFileTypes: true })) {
			const p = resolve(dir, e.name);
			if (e.isDirectory()) walk(p);
			else if (e.name === 'index.html') {
				const rel = p.slice(DIST.length).replace(/\/index\.html$/, '').replace(/\\/g, '/');
				routes.add(rel === '' ? '/' : rel + '/');
			}
		}
	})(DIST);

	// 蓄意排程、尚未上線的前向連結（標記後不擋）。Q13 上線後移除對應項。
	const ALLOWLIST = new Set([
		// '/pa/q13-macs-pa-overlap/',  // 範例：PA Q13 規劃中、尚未上線
	]);

	const CONTENT_DIR = resolve(__dirname, '..', 'src', 'content');
	const mdFiles = [];
	(function walkMd(dir) {
		for (const e of readdirSync(dir, { withFileTypes: true })) {
			const p = resolve(dir, e.name);
			if (e.isDirectory()) walkMd(p);
			else if (/\.(md|mdx)$/.test(e.name)) mdFiles.push(p);
		}
	})(CONTENT_DIR);

	const linkRe = /(?:\]\(|href=["'])(\/[a-zA-Z0-9\-_/]+\/?)(?:[)"'])/g;
	let brokenCount = 0;
	const brokenByFile = {};
	for (const f of mdFiles) {
		const txt = readFileSync(f, 'utf8');
		const relFile = f.slice(CONTENT_DIR.length + 1).replace(/\\/g, '/');
		const seen = new Set();
		let m;
		while ((m = linkRe.exec(txt))) {
			let u = m[1];
			if (u.includes('.') || u.startsWith('/_') || u.startsWith('/#')) continue;
			if (!u.endsWith('/')) u += '/';
			if (routes.has(u) || ALLOWLIST.has(u) || seen.has(u)) continue;
			seen.add(u);
			(brokenByFile[relFile] ??= []).push(u);
			brokenCount++;
		}
	}
	if (brokenCount === 0) {
		ok(`內部連結全對得上 dist 路由（掃 ${mdFiles.length} 檔 / ${routes.size} 路由，0 死連結）`);
	} else {
		for (const [file, urls] of Object.entries(brokenByFile)) {
			fail(`${file}: 死連結 slug → ${urls.join(', ')}（修正或加 ALLOWLIST）`);
		}
	}
}

// ============================================================
// Check 11: stale trial-status 候選（warn-only，不擋 build）
//   grep 仍寫 topline/待發表 的 trial 提及，列為候選提示。
//   修復端是人工：對照 vault trial-status-watchlist + PubMed 親驗。
//   warn-only：合法前向/歷史敘述/baxdrostat 類別例不該擋 build。
// ============================================================
console.log('\n## Check 11: stale trial-status 候選（warn-only）\n');
{
	const CONTENT_DIR = resolve(__dirname, '..', 'src', 'content');
	const mdFiles = [];
	(function walkMd(dir) {
		for (const e of readdirSync(dir, { withFileTypes: true })) {
			const p = resolve(dir, e.name);
			if (e.isDirectory()) walkMd(p);
			else if (/\.(md|mdx)$/.test(e.name)) mdFiles.push(p);
		}
	})(CONTENT_DIR);

	const staleRe = /(topline|待發表|待刊|尚未發表|全文待|positive topline|pending publication)/i;
	const trialish = /[A-Z][A-Z0-9-]{2,}|試驗|phase ?3|RCT|NCT\d/;
	const exclude = /已正式發表|已發表|歷史|先前 topline|未發表來源|press release|watchlist-ok/;
	let warnCount = 0;
	for (const f of mdFiles) {
		const rel = f.slice(CONTENT_DIR.length + 1).replace(/\\/g, '/');
		readFileSync(f, 'utf8').split('\n').forEach((ln, i) => {
			if (staleRe.test(ln) && trialish.test(ln) && !exclude.test(ln)) {
				console.log(`  ⚠️  ${rel}:${i + 1}  ${ln.trim().replace(/\s+/g, ' ').slice(0, 120)}`);
				warnCount++;
			}
		});
	}
	if (warnCount === 0) console.log('  ✅ 無 stale trial-status 候選');
	else console.log(`  → ${warnCount} 個候選；對照 trial-status-watchlist + PubMed 親驗（warn-only，不擋 build）`);
}

// ============================================================
// Check 12: llms.txt 時效與覆蓋率（warn-only，不擋 build）
//   緣起：llms.txt 於 2026-07-14 audit 修過時效，2026-08-23 audit 再次發現停在舊日期，
//   且完全未收 29 個新內容檔。手動維護已連續兩期失守 → 機械化為檢核。
//   warn-only（零誤殺優先）：llms.txt 是人工策展摘要，不是完整索引，
//   「某頁沒被列」本來就可能是刻意的；只在「整個 collection 掛零」或「日期落後」時提示。
// ============================================================
console.log('\n## Check 12: llms.txt 時效與覆蓋率（warn-only）\n');
{
	const llmsPath = resolve(DIST, 'llms.txt');
	if (!existsSync(llmsPath)) {
		console.log('  ⚠️  dist/llms.txt 不存在');
	} else {
		const llms = readFileSync(llmsPath, 'utf8');
		const CONTENT_DIR = resolve(__dirname, '..', 'src', 'content');
		const dm = llms.match(/Last updated:\s*(\d{4}-\d{2}-\d{2})/);
		const llmsDate = dm ? dm[1] : null;

		let newest = null;
		let newestFile = '';
		const missingCollections = [];
		for (const c of readdirSync(CONTENT_DIR, { withFileTypes: true })) {
			if (!c.isDirectory() || c.name.startsWith('_')) continue;
			const dir = resolve(CONTENT_DIR, c.name);
			let represented = llms.includes(`nephrodecisions.com/${c.name}/`);
			let published = 0;
			for (const e of readdirSync(dir, { withFileTypes: true })) {
				if (!e.isFile() || !/\.(md|mdx)$/.test(e.name) || e.name.startsWith('_')) continue;
				const raw = readFileSync(resolve(dir, e.name), 'utf8');
				const rs = raw.match(/^review_status:\s*(\S+)/m);
				if (rs && rs[1].replace(/['"]/g, '') !== 'physician_reviewed') continue; // 未審草稿不算公開
				published++;
				const lu = raw.match(/^last_updated:\s*['"]?(\d{4}-\d{2}-\d{2})/m);
				if (lu && (!newest || lu[1] > newest)) { newest = lu[1]; newestFile = `${c.name}/${e.name}`; }
			}
			if (published > 0 && !represented) missingCollections.push(`${c.name} (${published} 篇)`);
		}

		let warn = 0;
		if (!llmsDate) {
			console.log('  ⚠️  llms.txt 找不到 "Last updated: YYYY-MM-DD" 欄位'); warn++;
		} else if (newest && llmsDate < newest) {
			console.log(`  ⚠️  llms.txt 時效落後：標示 ${llmsDate}，但最新內容為 ${newest}（${newestFile}）`); warn++;
		}
		if (missingCollections.length) {
			console.log(`  ⚠️  llms.txt 完全未收錄的 collection：${missingCollections.join('、')}`); warn++;
		}
		if (warn === 0) console.log(`  ✅ llms.txt 時效 ${llmsDate} 不落後於最新內容 ${newest}；所有 collection 皆有收錄`);
		else console.log('  → 手動更新 public/llms.txt（warn-only，不擋 build）');
	}
}

// ============================================================
// Final summary
// ============================================================
console.log('\n---');
console.log(`Passed: ${passes}    Failed: ${failures}`);
if (failures === 0) {
	console.log('\n✅ All P0.5 checks passed.');
	process.exit(0);
} else {
	console.log(`\n❌ ${failures} check(s) failed.`);
	process.exit(1);
}
