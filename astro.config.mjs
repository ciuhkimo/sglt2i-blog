// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkGfm from 'remark-gfm';
import { defineConfig } from 'astro/config';
import { readFileSync, readdirSync } from 'node:fs';

// unlisted 影片集數：已排除於 /patient/ 列表、首頁「最近更新」與主 RSS（見 index.astro、patient/index.astro），
// 代表站台自己認定它們不是主要目的地。sitemap 先前仍送出它們，等於同時對 Google 說「請收錄」
// 與「這不重要」。矛盾訊號會拉低整份 sitemap 的可信度，故一併排除，改以系列 hub 作為索引入口。
// 集數頁本身照常 build，仍可直接分享連結。
const unlistedPatientSlugs = new Set();
{
	const dir = new URL('./src/content/patient/', import.meta.url);
	for (const file of readdirSync(dir)) {
		if (!/\.mdx?$/.test(file)) continue;
		const raw = readFileSync(new URL(file, dir), 'utf-8');
		if (/^unlisted:\s*true\s*$/m.test(raw)) {
			unlistedPatientSlugs.add(file.replace(/\.mdx?$/, ''));
		}
	}
}

// sitemap lastmod：以內容 frontmatter 的 last_updated 為準。
// @astrojs/sitemap 不會替內容頁產生 lastmod，先前的 fallback 會把 build 時間蓋到全站每一頁，
// 等於每次部署都宣告全站都更新過。Google 明文：lastmod 不準確就整體忽略，
// 且會連帶壓低抓取優先度。故改為逐頁真實日期；查不到的頁面寧可不給，也不給假值。
const contentRoot = new URL('./src/content/', import.meta.url);
const lastmodByPath = new Map();
const lastmodByCollection = new Map();
for (const dirent of readdirSync(contentRoot, { withFileTypes: true })) {
	if (!dirent.isDirectory()) continue;
	const dir = new URL(`${dirent.name}/`, contentRoot);
	for (const file of readdirSync(dir)) {
		if (!/\.mdx?$/.test(file)) continue;
		const raw = readFileSync(new URL(file, dir), 'utf-8');
		const m = raw.match(/^last_updated:\s*['"]?(\d{4}-\d{2}-\d{2})/m);
		if (!m) continue;
		const iso = new Date(`${m[1]}T00:00:00Z`).toISOString();
		const slug = file.replace(/\.mdx?$/, '');
		lastmodByPath.set(`/${dirent.name}/${slug}/`, iso);
		// 列表頁的 lastmod ＝該 collection 內最新的一篇
		const prev = lastmodByCollection.get(dirent.name);
		if (!prev || iso > prev) lastmodByCollection.set(dirent.name, iso);
	}
}

// 未審 regulatory 草稿：getStaticPaths 仍 build 路由供醫師 URL 預覽（RegulatoryLayout 已加 noindex），
// 但必須排除於 sitemap，對齊「草稿不列入 sitemap / 列表 / RSS」政策。
// @astrojs/sitemap 不解析 HTML 的 noindex meta，故在 build 時依 frontmatter 算出草稿 slug 供 filter 排除。
const regulatoryDir = new URL('./src/content/regulatory/', import.meta.url);
const draftRegulatorySlugs = new Set();
for (const file of readdirSync(regulatoryDir)) {
	if (!/\.mdx?$/.test(file)) continue;
	const raw = readFileSync(new URL(file, regulatoryDir), 'utf-8');
	const m = raw.match(/^review_status:\s*['"]?([\w-]+)/m);
	const status = m ? m[1] : 'needs_physician_review'; // schema 預設＝未審
	if (status !== 'physician_reviewed') {
		draftRegulatorySlugs.add(file.replace(/\.mdx?$/, ''));
	}
}

// rehype plugin: transform Shiki-rendered <pre data-language="mermaid"><code>...</code></pre>
// → <div class="mermaid-container" data-mermaid-src="URL_ENCODED_DSL">
//     <noscript>fallback</noscript>
//   </div>
//
// Design intent: raw Mermaid DSL must NEVER appear as a literal substring anywhere in the
// final HTML except inside <noscript> (which all readability extractors strip).
//
// Why URL-encoded data attribute (not <template>, not <script type="text/plain">):
//   - 2026-05-14 ChatGPT pro audit pass 1: <template> tested → readability tools 仍抽 visible
//   - 2026-05-14 ChatGPT pro audit pass 2: <script type="text/plain"> tested → string match
//     仍 hit (web fetch tool searches raw HTML, not extracted article text)
//   - Final solution: encode DSL via encodeURIComponent → store in data-mermaid-src
//     attribute. The literal DSL keywords no longer exist anywhere in readable form in the
//     HTML (encoded with %XX hex). String-match audits cannot trigger on the DSL syntax.
//
// Client-side init (Footer.astro): read container.dataset.mermaidSrc → decodeURIComponent →
// materialize <div class="mermaid"> → mermaid.run() → SVG.
function rehypeMermaidPreToDiv() {
	const fallbackText = '本決策流程圖需要 JavaScript 才能顯示為圖形。內文已包含對應的文字決策說明。';
	return (tree) => {
		function walk(node) {
			if (!node || !node.children) return;
			for (let i = 0; i < node.children.length; i++) {
				const child = node.children[i];
				if (
					child &&
					child.type === 'element' &&
					child.tagName === 'pre' &&
					child.properties &&
					(child.properties.dataLanguage === 'mermaid' || child.properties['data-language'] === 'mermaid')
				) {
					// Extract Mermaid DSL text (drop Shiki <span> wrapping, recover newlines)
					const text = extractText(child).replace(/\n+$/, '');
					const encoded = encodeURIComponent(text);
					node.children[i] = {
						type: 'element',
						tagName: 'div',
						properties: {
							className: ['mermaid-container'],
							'data-mermaid-src': encoded,
						},
						children: [
							{
								type: 'element',
								tagName: 'noscript',
								properties: {},
								children: [{ type: 'text', value: fallbackText }],
							},
						],
					};
					continue;
				}
				walk(child);
			}
		}
		function extractText(node) {
			if (!node) return '';
			if (node.type === 'text') return node.value || '';
			if (!node.children) return '';
			let out = '';
			for (const c of node.children) {
				if (c.type === 'element' && c.tagName === 'span') out += extractText(c);
				else if (c.type === 'element' && c.tagName === 'br') out += '\n';
				else if (c.type === 'element') {
					out += extractText(c);
					// Shiki .line spans represent one line each
					if (Array.isArray(c.properties?.className) && c.properties.className.includes('line')) {
						out += '\n';
					}
				}
				else if (c.type === 'text') out += c.value || '';
			}
			return out;
		}
		walk(tree);
	};
}

// rehype plugin: wrap every <table> in <div class="table-wrapper"> + add scope="col" to <th>
// Build-time only; no client JS; responsive horizontal scroll via existing .table-wrapper CSS
function rehypeWrapTablesAndThScope() {
	return (tree) => {
		function walk(node) {
			if (!node || !node.children) return;
			for (let i = 0; i < node.children.length; i++) {
				const child = node.children[i];
				if (child && child.type === 'element' && child.tagName === 'table') {
					const isAlreadyWrapped =
						node.type === 'element' &&
						node.tagName === 'div' &&
						Array.isArray(node.properties?.className) &&
						node.properties.className.includes('table-wrapper');
					if (!isAlreadyWrapped) {
						// Astro/hast strips role + aria-label from rehype output;
						// these are added client-side by Footer.astro init script
						node.children[i] = {
							type: 'element',
							tagName: 'div',
							properties: { className: ['table-wrapper'] },
							children: [child],
						};
					}
				}
				if (child && child.type === 'element' && child.tagName === 'th') {
					child.properties = child.properties || {};
					if (!child.properties.scope) {
						child.properties.scope = 'col';
					}
				}
				walk(child);
			}
		}
		walk(tree);
	};
}

export default defineConfig({
	site: 'https://nephrodecisions.com',
	integrations: [
		mdx({
			rehypePlugins: [rehypeMermaidPreToDiv, rehypeWrapTablesAndThScope],
		}),
		sitemap({
			filter(page) {
				// 排除未審 regulatory 草稿（noindex、不對外公開）
				for (const slug of draftRegulatorySlugs) {
					if (page.includes(`/regulatory/${slug}`)) return false;
				}
				// 排除 unlisted 影片集數，與列表／首頁／RSS 的既有處置一致
				for (const slug of unlistedPatientSlugs) {
					if (page.endsWith(`/patient/${slug}/`)) return false;
				}
				return true;
			},
			serialize(item) {
				if (item.lastmod) return item;
				const path = new URL(item.url).pathname;
				const own = lastmodByPath.get(path);
				if (own) {
					item.lastmod = own;
					return item;
				}
				// collection 列表頁（/patient/、/sglt2i/ …）取該 collection 最新一篇
				const asCollection = path.replace(/^\/|\/$/g, '');
				const newest = lastmodByCollection.get(asCollection);
				if (newest) item.lastmod = newest;
				// 其餘（首頁、法律頁等）不給 lastmod，勝過給假值
				return item;
			},
		}),
	],
	markdown: {
		remarkPlugins: [remarkGfm],
		rehypePlugins: [rehypeMermaidPreToDiv, rehypeWrapTablesAndThScope],
	},
});
