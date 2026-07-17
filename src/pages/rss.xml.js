import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET(context) {
	const sglt2i = await getCollection('sglt2i');
	const glp1ra = await getCollection('glp1ra');
	const finerenone = await getCollection('finerenone');
	const ckm = await getCollection('ckm');
	const pa = await getCollection('pa');
	const sexualHealth = await getCollection('sexualHealth');
	const patient = await getCollection('patient');
	const dialysis = await getCollection('dialysis');
	const ruralNephrology = await getCollection('ruralNephrology');
	const blog = await getCollection('blog');

	const allItems = [
		...sglt2i.map((note) => ({
			title: `${note.data.question_id} — ${note.data.title}`,
			pubDate: note.data.last_updated,
			link: `/sglt2i/${note.id}/`,
			description: note.data.description || note.data.title,
			categories: note.data.tags,
		})),
		...glp1ra.map((note) => ({
			title: `${note.data.question_id} — ${note.data.title}`,
			pubDate: note.data.last_updated,
			link: `/glp1ra/${note.id}/`,
			description: note.data.description || note.data.title,
			categories: note.data.tags,
		})),
		...finerenone.map((note) => ({
			title: `${note.data.question_id} — ${note.data.title}`,
			pubDate: note.data.last_updated,
			link: `/finerenone/${note.id}/`,
			description: note.data.description || note.data.title,
			categories: note.data.tags,
		})),
		...ckm.map((note) => ({
			title: `${note.data.question_id} — ${note.data.title}`,
			pubDate: note.data.last_updated,
			link: `/ckm/${note.id}/`,
			description: note.data.description || note.data.title,
			categories: note.data.tags,
		})),
		...pa.map((note) => ({
			title: `${note.data.question_id} — ${note.data.title}`,
			pubDate: note.data.last_updated,
			link: `/pa/${note.id}/`,
			description: note.data.description || note.data.title,
			categories: note.data.tags,
		})),
		...sexualHealth.map((note) => ({
			title: `${note.data.question_id} — ${note.data.title}`,
			pubDate: note.data.last_updated,
			link: `/sexual-health/${note.id}/`,
			description: note.data.title,
			categories: note.data.tags,
		})),
		...patient.filter((note) => !note.data.unlisted).map((note) => ({
			title: note.data.title,
			pubDate: note.data.last_updated,
			link: `/patient/${note.id}/`,
			description: note.data.description || note.data.title,
			categories: note.data.tags,
		})),
		...dialysis.map((note) => ({
			title: note.data.title,
			pubDate: note.data.last_updated,
			link: `/dialysis/${note.id}/`,
			description: note.data.description || note.data.title,
			categories: note.data.tags,
		})),
		...ruralNephrology.map((note) => ({
			title: note.data.title,
			pubDate: note.data.last_updated,
			link: `/rural-nephrology/${note.id}/`,
			description: note.data.description || note.data.title,
			categories: note.data.tags,
		})),
		...blog.map((post) => ({
			title: post.data.title,
			pubDate: post.data.last_updated,
			link: `/blog/${post.id}/`,
			description: post.data.description,
			categories: post.data.tags,
		})),
	];

	allItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: allItems,
	});
}
