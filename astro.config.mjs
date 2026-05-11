// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkGfm from 'remark-gfm';
import { defineConfig } from 'astro/config';

// https://astro.build/config
const buildDate = new Date();

export default defineConfig({
	site: 'https://nephrodecisions.com',
	integrations: [
		mdx(),
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
	},
});
