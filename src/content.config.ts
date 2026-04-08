import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const sglt2i = defineCollection({
	loader: glob({ base: './src/content/sglt2i', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		question_id: z.string(),
		title: z.string(),
		category: z.string(),
		version: z.string(),
		status: z.string(),
		last_updated: z.coerce.date(),
		next_review: z.coerce.date(),
		tags: z.array(z.string()),
		description: z.string().optional(),
		quick_answer: z.string().optional(),
		seo_title: z.string().optional(),
	}),
});

const patient = defineCollection({
	loader: glob({ base: './src/content/patient', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		source_note: z.string(),
		last_updated: z.coerce.date(),
		tags: z.array(z.string()),
		seo_title: z.string().optional(),
	}),
});

const dialysis = defineCollection({
	loader: glob({ base: './src/content/dialysis', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		chapter: z.string(),
		category: z.string(),
		target_audience: z.string(),
		sources: z.array(z.string()),
		last_updated: z.coerce.date(),
		tags: z.array(z.string()),
	}),
});

const glp1ra = defineCollection({
	loader: glob({ base: './src/content/glp1ra', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		question_id: z.string(),
		title: z.string(),
		category: z.string(),
		version: z.string(),
		status: z.string(),
		last_updated: z.coerce.date(),
		next_review: z.coerce.date(),
		tags: z.array(z.string()),
		description: z.string().optional(),
		quick_answer: z.string().optional(),
		seo_title: z.string().optional(),
	}),
});

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		category: z.string(),
		target_audience: z.string(),
		last_updated: z.coerce.date(),
		tags: z.array(z.string()),
		seo_title: z.string().optional(),
	}),
});

export const collections = { sglt2i, patient, dialysis, blog, glp1ra };
