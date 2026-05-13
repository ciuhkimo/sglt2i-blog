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
// Check 5: Mermaid raw code blocks should not appear as-is in final pages
// (i.e., the mermaid renderer script should be present on every page)
// ============================================================
console.log('\n## Check 5: Mermaid renderer script injected globally\n');
const MERMAID_PAGES = [
	'/pa/q01-screening-indication/',
	'/pa/q06-ckd-pa-treatment/',
	'/sglt2i/',
];
for (const url of MERMAID_PAGES) {
	const html = readPage(url);
	if (!html) continue;
	// Footer.astro injects an inline <script> that does setAttribute('aria-label', 'Mermaid 臨床決策流程圖')
	// Astro/Vite may minify quotes, so accept either single or double quote
	const hasMermaidScript = /mermaid@11/.test(html) && /Mermaid 臨床決策流程圖/.test(html);
	if (hasMermaidScript) ok(`${url}: Mermaid renderer script + aria-label string present`);
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
