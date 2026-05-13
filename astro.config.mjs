// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkGfm from 'remark-gfm';
import { defineConfig } from 'astro/config';

const buildDate = new Date();

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
			rehypePlugins: [rehypeWrapTablesAndThScope],
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
		rehypePlugins: [rehypeWrapTablesAndThScope],
	},
});
