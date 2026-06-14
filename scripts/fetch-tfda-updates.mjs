#!/usr/bin/env node
/**
 * fetch-tfda-updates.mjs — 台灣醫藥監管週報：TFDA 官方 RSS 抓取與初整草稿產生器
 *
 * 用途：每日／每週抓取食藥署官方 RSS，依日期區間篩選，做「初步」分類與重要度標記，
 *      輸出內部草稿（items.json / digest.md / weekly-draft.md）。
 *
 * 設計界線（對應 nephro-tfda-weekly 計畫書第 9 節）：
 *   - 只用官方來源（食藥署 RSS）。
 *   - 不自動 commit、不自動 publish、不寫進 src/content/。
 *   - 分類與重要度只是「初步」提示，臨床意義與是否公開由醫師審閱定稿。
 *   - 不轉載公告全文：description 僅保留純文字摘要前段。
 *
 * 用法：
 *   node scripts/fetch-tfda-updates.mjs --from 2026-06-08 --to 2026-06-14
 *   node scripts/fetch-tfda-updates.mjs --weekly          # 最近 7 天
 *   node scripts/fetch-tfda-updates.mjs                    # 預設最近 7 天
 *
 * 輸出：work/tfda/<to-date>/{items.json, digest.md, weekly-draft.md}
 *
 * 注意：RSS feed 僅保留最近約 20–60 則；公告量大或回溯較舊區間時可能漏抓，
 *      腳本會在 stderr 提示觸及 feed 視窗邊界的 feed。
 */

import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');

// 已驗證可解析、含 pubDate 的官方時序型 / 警訊型 feed。
// 法規條文庫型 feed（rssLawMedical 等 lawContent）非時序流，刻意不納入週報掃描。
const FEEDS = [
	{ key: 'announcement', label: '本署公告', url: 'https://www.fda.gov.tw/TC/rssAnnouncement.ashx' },
	{ key: 'news', label: '本署新聞', url: 'https://www.fda.gov.tw/TC/rssNews.ashx' },
	{ key: 'light_drug', label: '國外消費紅綠燈—藥品', url: 'https://www.fda.gov.tw/TC/rssLight_Drug.ashx' },
	{ key: 'light_device', label: '國外消費紅綠燈—醫療器材', url: 'https://www.fda.gov.tw/TC/rssLight_MedicalDevice.ashx' },
	{ key: 'law_amending', label: '修法專區', url: 'https://www.fda.gov.tw/TC/rssLawAmending.ashx' },
	{ key: 'controlled', label: '管制藥品類', url: 'https://www.fda.gov.tw/TC/rssLawControlled.ashx' },
];

const UA = 'Mozilla/5.0 (compatible; NephroDecisions-RegulatoryWeekly/0.1; +https://nephrodecisions.com)';

// ---- 分類關鍵字（初步；非權威）----------------------------------------------
const EXCLUDE_KW = ['食品', '食安', '餐飲', '營養', '化粧品', '橄欖油', '外送員', '徵才', '甄選', '替代役', '招標', '標案', '活動', '謠言', '闢謠', '研習', '研討會'];
const CATEGORY_RULES = [
	['clinical_trial', ['臨床試驗', 'IRB', '受試者', '試驗計畫', '人體試驗']],
	['safety', ['回收', '警訊', '不良反應', '不良品', '下架', '風險', '安全監視', '停產', '禁用']],
	['supply', ['短缺', '供應', '專案輸入', '缺貨', '停止供應']],
	['controlled_drug', ['管制藥品', '毒品', '先驅化學']],
	['medical_device', ['醫療器材', '醫材', '器材']],
	['gmp_gdp', ['GMP', 'GDP', '製造管理', '藥廠', '優良製造']],
	['registration', ['查驗登記', '審查基準', '送審', '許可證', '變更登記', '核准']],
	['drug', ['藥品', '藥事', '學名藥', '指示藥', '處方藥', '生物相似性', '仿單', '藥證', '藥物']],
	['law_policy', ['預告', '草案', '修正', '辦法', '規定', '公告']],
];
const KIDNEY_KW = ['腎', '透析', '血液透析', '腹膜透析', 'CKD', '尿毒', '糖尿病', 'SGLT2', 'finerenone', '心腎', '球形吸附', '活性碳', 'AST-120', 'kremezin', '克裏美淨', '克裡美淨', '降磷', '磷結合', '鉀離子', '高血鉀', '紅血球生成', '達貝泊', '鐵劑', 'tacrolimus', '環孢', '排斥', '免疫抑制', '移植'];

// ---- CLI 參數 -----------------------------------------------------------------
function parseArgs(argv) {
	const a = { from: null, to: null, weekly: false, promote: false };
	for (let i = 0; i < argv.length; i++) {
		if (argv[i] === '--from') a.from = argv[++i];
		else if (argv[i] === '--to') a.to = argv[++i];
		else if (argv[i] === '--weekly') a.weekly = true;
		else if (argv[i] === '--promote') a.promote = true;
	}
	return a;
}
function isoDate(d) { return d.toISOString().split('T')[0]; }
function resolveRange(a) {
	if (a.from && a.to) return { from: a.from, to: a.to };
	// 預設 / --weekly：最近 7 天（含今日）
	const today = new Date();
	const from = new Date(today.getTime() - 6 * 86400000);
	return { from: isoDate(from), to: isoDate(today) };
}

// ---- 極簡 RSS 解析（無外部相依；針對食藥署 well-formed RSS 2.0）-----------------
function decodeEntities(s) {
	return (s || '')
		.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
		.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'")
		.replace(/&amp;/g, '&');
}
function stripHtml(s) {
	return decodeEntities(s)
		.replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/[\s　]+/g, ' ')
		.trim();
}
function tag(block, name) {
	const m = block.match(new RegExp(`<${name}>([\\s\\S]*?)<\\/${name}>`, 'i'));
	return m ? m[1] : '';
}
function parseRss(xml) {
	const items = [];
	const re = /<item>([\s\S]*?)<\/item>/gi;
	let m;
	while ((m = re.exec(xml)) !== null) {
		const block = m[1];
		const title = decodeEntities(tag(block, 'title')).trim();
		const linkRaw = decodeEntities(tag(block, 'link')).trim();
		const pub = tag(block, 'pubDate').trim();
		const descText = stripHtml(tag(block, 'description'));
		let cid = null, id = null, link = linkRaw;
		try {
			const u = new URL(linkRaw);
			cid = u.searchParams.get('cid');
			id = u.searchParams.get('id');
			// 去除 utm 追蹤參數，保留 cid/id（與 mid）
			for (const k of [...u.searchParams.keys()]) if (k.startsWith('utm')) u.searchParams.delete(k);
			u.protocol = 'https:';
			link = u.toString();
		} catch { /* 保留原始 link */ }
		const date = pub ? new Date(pub) : null;
		items.push({ title, link, pubDate: pub, date, cid, id, descExcerpt: descText.slice(0, 240) });
	}
	return items;
}

// ---- 分類 / 重要度（初步）-----------------------------------------------------
// 機關名噪音：「食品藥物管理署」本身含「藥物」「藥」，會誤觸 drug 關鍵字、
// 破壞食品類排除（例：世界食品安全日）。分類前先剝除機關名。
const AGENCY_NOISE = ['衛生福利部食品藥物管理署', '食品藥物管理署', '食品藥物管理局', '食藥署', '本署', '衛福部', '衛生福利部'];
function denoise(s) {
	let o = s || '';
	for (const n of AGENCY_NOISE) o = o.split(n).join('');
	return o;
}
function classify(item) {
	const title = denoise(item.title);
	const hay = denoise(`${item.title} ${item.descExcerpt}`);
	const excluded = EXCLUDE_KW.some((k) => hay.includes(k)) &&
		!CATEGORY_RULES.slice(0, 8).some(([, kws]) => kws.some((k) => title.includes(k)));
	let category = 'other';
	for (const [cat, kws] of CATEGORY_RULES) {
		if (kws.some((k) => hay.includes(k))) { category = cat; break; }
	}
	const kidney = KIDNEY_KW.some((k) => hay.toLowerCase().includes(k.toLowerCase()));
	const safetyOrDeadline = ['safety', 'supply'].includes(category) || /回收|警訊|短缺|截止|期限|生效/.test(hay);
	let importance = 'medium';
	if (excluded || category === 'other') importance = 'low';
	else if (safetyOrDeadline || kidney) importance = 'high';
	return {
		category_primary: category,
		kidney_relevance: kidney ? 'high' : 'low',
		importance,
		include_in_public_weekly: !excluded && category !== 'other',
		review_status: 'needs_physician_review',
	};
}

// ---- 主流程 -------------------------------------------------------------------
async function fetchFeed(feed) {
	try {
		const res = await fetch(feed.url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(25000) });
		if (!res.ok) { console.error(`[warn] ${feed.label} HTTP ${res.status}`); return { feed, items: [] }; }
		const xml = await res.text();
		return { feed, items: parseRss(xml) };
	} catch (e) {
		console.error(`[warn] ${feed.label} fetch 失敗：${e.message}`);
		return { feed, items: [] };
	}
}

function inRange(date, from, to) {
	if (!date || isNaN(date)) return false;
	const d = isoDate(date);
	return d >= from && d <= to;
}

function buildDigest(range, rows) {
	const lines = [`# TFDA 監管掃描 digest｜${range.from} 至 ${range.to}`, '', `掃描來源 ${FEEDS.length} 個官方 RSS；區間內收錄候選 ${rows.filter((r) => r.cls.include_in_public_weekly).length} 則、排除 ${rows.filter((r) => !r.cls.include_in_public_weekly).length} 則。`, ''];
	const byCat = {};
	for (const r of rows) (byCat[r.cls.category_primary] ??= []).push(r);
	for (const [cat, list] of Object.entries(byCat)) {
		lines.push(`## ${cat}（${list.length}）`, '');
		for (const r of list) {
			lines.push(`- [${r.cls.importance}${r.cls.kidney_relevance === 'high' ? '・腎臟相關' : ''}${r.cls.include_in_public_weekly ? '' : '・建議排除'}] ${isoDate(r.date)} ${r.title}`);
			lines.push(`  - ${r.feedLabel}｜原文：${r.link}`);
			if (r.descExcerpt) lines.push(`  - 摘要：${r.descExcerpt}`);
		}
		lines.push('');
	}
	return lines.join('\n');
}

function buildWeeklyDraft(range, rows) {
	const inScope = rows.filter((r) => r.cls.include_in_public_weekly).sort((a, b) => b.date - a.date);
	const excluded = rows.filter((r) => !r.cls.include_in_public_weekly);
	const fm = [
		'---',
		`title: 台灣醫藥監管週報｜${range.from} 至 ${range.to}`,
		'description: （待醫師審閱補寫）',
		`last_updated: ${range.to}`,
		`week_start: ${range.from}`,
		`week_end: ${range.to}`,
		'content_type: regulatory_weekly',
		'review_status: needs_physician_review',
		'ai_assisted: true',
		'tags:\n  - TFDA\n  - 醫藥監管',
		'audience:\n  - clinician\n  - pharmacist\n  - nurse\n  - researcher',
		'source_scope:\n' + FEEDS.map((f) => `  - 食藥署 ${f.label} RSS`).join('\n'),
		'---',
		'',
		`# 台灣醫藥監管週報｜${range.from} 至 ${range.to}`,
		'',
		'## 本週重點（一眼掃描）',
		'',
		'| 要點 | 類別 | 重要度 | 你可能要做的事 |',
		'|---|---|---|---|',
		...inScope.slice(0, 6).map((r) => `| ${r.title} | ${r.cls.category_primary} | ${r.cls.importance}${r.cls.kidney_relevance === 'high' ? '・腎臟相關' : ''} | （待審） |`),
		'',
		'## 需要追蹤的期限',
		'',
		'| 期程 | 事項 | 主要對象 | 原文 |',
		'|---|---|---|---|',
		'| | | | |',
		'',
	];
	const body = [];
	for (const r of inScope) {
		body.push(`## ［${r.cls.category_primary}／${r.cls.importance}］${r.title}`, '');
		body.push(`- **發布日期**：${isoDate(r.date)}`);
		body.push(`- **來源**：${r.feedLabel}`);
		body.push(`- **重要度（初判）**：${r.cls.importance}${r.cls.kidney_relevance === 'high' ? '（腎臟科相關）' : ''}`);
		body.push(`- **一句話摘要**：（待醫師確認）${r.descExcerpt}`);
		body.push('- **可能影響**：（待醫師審閱補寫，僅寫「可能／需確認」）');
		body.push('- **建議追蹤**：');
		body.push(`- **原文**：${r.link}`, '');
	}
	const tail = [
		'## 本週掃描但未收錄',
		'',
		`掃描 ${FEEDS.length} 個官方 RSS；以下為非目標範圍、初判排除（${excluded.length} 則）：`,
		'',
		...excluded.slice(0, 20).map((r) => `- ${isoDate(r.date)} ${r.title}（${r.feedLabel}）`),
		'',
		'> 本檔為腳本自動初整草稿，分類與重要度僅供參考，所有「可能影響」與是否公開均待醫師審閱定稿。',
	];
	return [...fm, ...body, ...tail].join('\n');
}

async function main() {
	const args = parseArgs(process.argv.slice(2));
	const range = resolveRange(args);
	console.error(`抓取區間：${range.from} 至 ${range.to}`);

	const results = await Promise.all(FEEDS.map(fetchFeed));
	const rows = [];
	for (const { feed, items } of results) {
		const windowed = items.filter((it) => inRange(it.date, range.from, range.to));
		// feed 視窗邊界提示：若最舊一則仍落在區間內，可能有更舊項目被截斷
		const oldest = items[items.length - 1];
		if (oldest?.date && isoDate(oldest.date) >= range.from && items.length >= 20) {
			console.error(`[note] ${feed.label}：最舊一則(${isoDate(oldest.date)})仍在區間內，feed 視窗(${items.length})可能截斷更舊項目`);
		}
		for (const it of windowed) rows.push({ ...it, feedKey: feed.key, feedLabel: feed.label, cls: classify(it) });
	}
	// 依 (cid,id) 或 link 去重
	const seen = new Set();
	const deduped = rows.filter((r) => {
		const k = r.cid && r.id ? `${r.cid}:${r.id}` : r.link;
		if (seen.has(k)) return false;
		seen.add(k); return true;
	}).sort((a, b) => b.date - a.date);

	const outDir = resolve(REPO_ROOT, 'work', 'tfda', range.to);
	mkdirSync(outDir, { recursive: true });
	writeFileSync(resolve(outDir, 'items.json'), JSON.stringify(deduped.map((r) => ({
		title: r.title, link: r.link, published_date: isoDate(r.date), source_feed: r.feedLabel,
		cid: r.cid, id: r.id, ...r.cls, summary_excerpt: r.descExcerpt,
	})), null, 2));
	writeFileSync(resolve(outDir, 'digest.md'), buildDigest(range, deduped));
	writeFileSync(resolve(outDir, 'weekly-draft.md'), buildWeeklyDraft(range, deduped));

	const inScope = deduped.filter((r) => r.cls.include_in_public_weekly).length;
	console.error(`完成：${deduped.length} 則（區間內、去重後）；收錄候選 ${inScope} 則。`);
	console.error(`輸出：${outDir}/{items.json,digest.md,weekly-draft.md}`);

	// --promote：把週報草稿直接落到 content collection（review_status: needs_physician_review），
	// 供 GitHub Actions 開 PR 審閱。只在「有 in-scope 項目且檔案不存在」時寫，
	// 避免覆蓋手改稿或產生空週報。檔案是草稿狀態，即使誤 merge 也因 gate 而不公開。
	if (args.promote) {
		const contentPath = resolve(REPO_ROOT, 'src', 'content', 'regulatory', `${range.to}-tfda-weekly.md`);
		if (inScope === 0) {
			console.error('[promote] 本週無 in-scope 項目，略過 content 草稿（不產生空週報）。');
		} else if (existsSync(contentPath)) {
			console.error(`[promote] 已存在，未覆蓋：${contentPath}`);
		} else {
			writeFileSync(contentPath, buildWeeklyDraft(range, deduped));
			console.error(`[promote] 已寫入草稿（needs_physician_review）：${contentPath}`);
		}
	}

	console.error('提醒：本腳本不自動 commit、不自動 publish。草稿須經醫師審閱、將 review_status 改為 physician_reviewed 後，才會公開。');
}

main();
