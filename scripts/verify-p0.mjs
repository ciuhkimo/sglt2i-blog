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
