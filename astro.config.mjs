// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkGfm from 'remark-gfm';
import { defineConfig } from 'astro/config';

const buildDate = new Date();

// rehype plugin: transform Shiki-rendered <pre data-language="mermaid"><code>...</code></pre>
// → <div class="mermaid-container">
//     <script type="text/plain" class="mermaid-source">flowchart TD ...</script>
//     <noscript>fallback</noscript>
//   </div>
//
// Design intent: raw Mermaid DSL must NOT appear as ordinary article text so crawlers /
// readability extractors (Mozilla Readability, ChatGPT web reader, etc.) don't index DSL
// fragments as visible content.
//
// We use <script type="text/plain"> because:
//   1. Readability libraries reliably strip <script> elements before extracting article text
//      (HTML spec inert <template> is theoretically the same but tool support is inconsistent;
//      ChatGPT pro 2026-05-14 audit confirmed <template> content still leaked into "visible
//      text" — switched to script[type=text/plain] for parity with readability standards).
//   2. type="text/plain" is a documented "data block" pattern (HTML spec §4.12.1): browsers
//      do NOT execute the content as JavaScript. The content remains accessible via DOM.
//   3. Client-side init (Footer.astro) reads .mermaid-source content, materializes a
//      <div class="mermaid">, runs Mermaid to produce SVG, replaces container children.
//   4. <noscript> provides text fallback for users with JavaScript disabled.
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
					node.children[i] = {
						type: 'element',
						tagName: 'div',
						properties: { className: ['mermaid-container'] },
						children: [
							{
								type: 'element',
								tagName: 'script',
								properties: { type: 'text/plain', className: ['mermaid-source'] },
								children: [{ type: 'text', value: text }],
							},
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
