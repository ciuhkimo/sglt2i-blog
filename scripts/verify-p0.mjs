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

import { readFileSync, existsSync } from 'node:fs';
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
];

let failures = 0;
let passes = 0;

function readPage(url) {
	const rel = url.replace(/^\//, '').replace(/\/$/, '');
	const path = rel === '' ? resolve(DIST, 'index.html') : resolve(DIST, rel, 'index.html');
	if (!existsSync(path)) return null;
	return readFileSync(path, 'utf8');
}

// Strip <script>, <style>, <template>, and <noscript> content so that:
//   1. verbatim HTML strings inside JS / CSS don't trigger false-positive grep matches
//   2. inert content (template / noscript fallback) isn't counted as "visible article text"
function stripScriptsAndStyles(html) {
	return html
		.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
		.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
		.replace(/<template[\s\S]*?<\/template>/gi, '')
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

	// Container + template + noscript fallback must exist
	const container = countMatches(rawHtml, /<div[^>]*class="[^"]*\bmermaid-container\b[^"]*"/g);
	const template = countMatches(rawHtml, /<template[^>]*class="[^"]*\bmermaid-source\b[^"]*"/g);
	const noscript = countMatches(rawHtml, /本決策流程圖需要 JavaScript/g);
	if (container >= 1 && template >= 1 && noscript >= 1) {
		ok(`${url}: ${container} mermaid-container + ${template} <template> + ${noscript} <noscript> fallback (0 raw DSL in visible body)`);
	} else {
		fail(`${url}: container=${container}, template=${template}, noscript=${noscript} (all must be >=1)`);
	}
}
for (const url of MERMAID_RENDERER_SAMPLES) {
	const html = readPage(url);
	if (!html) continue;
	const hasScript = /mermaid@11/.test(html) && /Mermaid 臨床決策流程圖/.test(html);
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
