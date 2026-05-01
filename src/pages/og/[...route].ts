import { OGImageRoute } from 'astro-og-canvas';
import { getCollection } from 'astro:content';

const [sglt2i, glp1ra, finerenone, ckm, patient, dialysis, blog, sexualHealth] = await Promise.all([
	getCollection('sglt2i'),
	getCollection('glp1ra'),
	getCollection('finerenone'),
	getCollection('ckm'),
	getCollection('patient'),
	getCollection('dialysis'),
	getCollection('blog'),
	getCollection('sexualHealth'),
]);

type PageData = {
	title: string;
	section: string;
};

const clean = (s: string | undefined) => (s || '').replace(/\s+/g, ' ').trim();

const pages: Record<string, PageData> = {};

for (const e of sglt2i) pages[`sglt2i/${e.id}`] = { title: clean(e.data.title), section: 'SGLT2i 決策筆記 ｜ Nephro Decisions' };
for (const e of glp1ra) pages[`glp1ra/${e.id}`] = { title: clean(e.data.title), section: 'GLP-1 RA 決策筆記 ｜ Nephro Decisions' };
for (const e of finerenone) pages[`finerenone/${e.id}`] = { title: clean(e.data.title), section: 'Finerenone 決策筆記 ｜ Nephro Decisions' };
for (const e of ckm) pages[`ckm/${e.id}`] = { title: clean(e.data.title), section: 'CKM Syndrome 決策筆記 ｜ Nephro Decisions' };
for (const e of patient) pages[`patient/${e.id}`] = { title: clean(e.data.title), section: '病人衛教 ｜ Nephro Decisions' };
for (const e of dialysis) pages[`dialysis/${e.id}`] = { title: clean(e.data.title), section: '透析衛教 ｜ Nephro Decisions' };
for (const e of blog) pages[`blog/${e.id}`] = { title: clean(e.data.title), section: '臨床專題 ｜ Nephro Decisions' };
for (const e of sexualHealth) pages[`sexual-health/${e.id}`] = { title: clean(e.data.title), section: '腎友與性 ｜ Nephro Decisions' };

// Site-level pages
pages['index'] = { title: 'Nephro Decisions', section: '腎臟科臨床決策知識庫｜台灣' };
pages['about'] = { title: '關於本站', section: 'Nephro Decisions' };
pages['editorial-policy'] = { title: '編輯方針', section: 'Nephro Decisions' };
pages['subscribe'] = { title: '訂閱 Nephro Decisions', section: '每月 25 日一封｜3 分鐘讀完' };
pages['disclaimer'] = { title: '醫療免責聲明', section: 'Nephro Decisions' };
pages['privacy'] = { title: '隱私權政策', section: 'Nephro Decisions' };
pages['accessibility'] = { title: '無障礙聲明', section: 'Nephro Decisions' };
pages['listen'] = { title: '通勤收聽指南', section: 'Nephro Decisions' };

// Listing / hub pages
pages['sglt2i'] = { title: 'SGLT2i 決策筆記', section: 'Nephro Decisions' };
pages['glp1ra'] = { title: 'GLP-1 RA 決策筆記', section: 'Nephro Decisions' };
pages['finerenone'] = { title: 'Finerenone 決策筆記', section: 'Nephro Decisions' };
pages['ckm'] = { title: 'CKM Syndrome 決策筆記', section: 'Nephro Decisions' };
pages['patient'] = { title: '病人與家屬衛教', section: 'Nephro Decisions' };
pages['dialysis'] = { title: '透析衛教', section: 'Nephro Decisions' };
pages['blog'] = { title: '臨床專題', section: 'Nephro Decisions' };
pages['sexual-health'] = { title: '腎友與性', section: 'Nephro Decisions' };

export const prerender = true;

const route = await OGImageRoute({
	param: 'route',
	pages,
	getImageOptions: async (_path: string, page: PageData) => ({
		title: page.title,
		description: page.section,
		bgGradient: [
			[255, 255, 255],
			[240, 244, 243],
		],
		border: {
			color: [26, 107, 90],
			width: 24,
			side: 'inline-start',
		},
		padding: 70,
		font: {
			title: {
				size: 58,
				lineHeight: 1.3,
				weight: 'Bold',
				families: ['Noto Sans TC'],
				color: [31, 41, 55],
			},
			description: {
				size: 28,
				lineHeight: 1.4,
				families: ['Noto Sans TC'],
				color: [107, 114, 128],
			},
		},
		fonts: [
			'./src/assets/fonts/NotoSansTC-Regular.otf',
			'./src/assets/fonts/NotoSansTC-Bold.otf',
		],
	}),
});

export const getStaticPaths = route.getStaticPaths;
export const GET = route.GET;
