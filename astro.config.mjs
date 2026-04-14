// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkGfm from 'remark-gfm';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://nephrodecisions.com',
	integrations: [mdx(), sitemap()],
	markdown: {
		remarkPlugins: [remarkGfm],
	},
});
