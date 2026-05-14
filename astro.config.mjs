// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkGfm from 'remark-gfm';
import { defineConfig } from 'astro/config';

const buildDate = new Date();

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
			serialize(item) {
				if (!item.lastmod) {
					item.lastmod = buildDate.toISOString();
				}
				return item;
			},
		}),
	],
	markdown: {
		remarkPlugins: [remarkGfm],
		rehypePlugins: [rehypeMermaidPreToDiv, rehypeWrapTablesAndThScope],
	},
});
