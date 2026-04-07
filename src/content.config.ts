import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const notes = defineCollection({
	loader: glob({ base: './src/content/notes', pattern: '**/*.{md,mdx}' }),
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

export const collections = { notes, patient, dialysis };
