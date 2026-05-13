// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkGfm from 'remark-gfm';
import { defineConfig } from 'astro/config';

const buildDate = new Date();

// rehype plugin: transform Shiki-rendered <pre data-language="mermaid"><code>...</code></pre>
// → <div class="mermaid" aria-label="Mermaid 臨床決策流程圖">flowchart TD ...</div>
// so the raw Mermaid source is NOT inside <pre><code> article-code-listing markup.
// Client-side Mermaid script (Footer.astro) then renders the <div> to SVG.
function rehypeMermaidPreToDiv() {
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
					// Extract text content (drop Shiki <span> wrapping, recover newlines)
					const text = extractText(child).replace(/\n+$/, '');
					node.children[i] = {
						type: 'element',
						tagName: 'div',
						properties: { className: ['mermaid'] },
						children: [{ type: 'text', value: text }],
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
