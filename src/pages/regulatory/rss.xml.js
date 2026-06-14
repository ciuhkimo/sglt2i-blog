import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

// 台灣醫藥監管週報專屬 feed，與主站臨床 /rss.xml 分流，避免高頻監管摘要稀釋臨床決策 feed。
// 只收已醫師審閱的週報；needs_physician_review 草稿不進 feed。
export async function GET(context) {
	const regulatory = await getCollection('regulatory');
	const items = regulatory
		.filter((p) => p.data.review_status === 'physician_reviewed')
		.sort((a, b) => b.data.last_updated.valueOf() - a.data.last_updated.valueOf())
		.map((p) => ({
			title: p.data.title,
			pubDate: p.data.last_updated,
			link: `/regulatory/${p.id}/`,
			description: p.data.description,
			categories: p.data.tags,
		}));

	return rss({
		title: '台灣醫藥監管週報｜Nephro Decisions',
		description: '每週整理 TFDA 與台灣醫藥監管中，和腎臟科、藥品、醫療器材、臨床試驗、查驗登記、GMP/GDP 與藥品安全相關的重點。AI 協助彙整、醫師審閱。',
		site: context.site,
		items,
	});
}
