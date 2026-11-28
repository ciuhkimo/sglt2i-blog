// Nephro Decisions podcast：節目與單集資料（單一來源）。
// 所有連結已於 2026-11-28 對官方來源核對：
// - Firstory 單集 ID 取自官方 RSS（feed.firstory.me/rss/user/cmda93lh201rl01vcdaha5otp）
// - YouTube 影片 ID 取自頻道公開 feed（只列公開影片）
// 新增單集時：從 RSS / YouTube 後台複製，不要猜 URL。Spotify 待確認、SoundOn 暫緩。

export const PODCAST_SHOW = {
	name: 'Nephro Decisions｜腎臟科臨床決策',
	links: [
		{ label: 'Firstory', href: 'https://open.firstory.fm/user/nephrodecisions' },
		{ label: 'Apple Podcasts', href: 'https://podcasts.apple.com/tw/podcast/id6840243327' },
		{ label: 'YouTube', href: 'https://www.youtube.com/channel/UCiD-Rnav41gVk3T0SzFt5bA' },
		{ label: 'RSS', href: 'https://feed.firstory.me/rss/user/cmda93lh201rl01vcdaha5otp' },
	],
};

export type PodcastEpisode = {
	episode: string;
	title: string;
	firstoryStoryId: string;
	youtubeId: string;
};

// key = 文章路徑（含結尾斜線）
export const PODCAST_EPISODES: Record<string, PodcastEpisode> = {
	'/sglt2i/q01-ckd-start-timing/': {
		episode: 'EP01',
		title: '【臨床】CKD 何時開始 SGLT2 inhibitor？',
		firstoryStoryId: 'cmwzv5c4m00um01wz4xu20m6m',
		youtubeId: 'IbCHQszs2Yo',
	},
	'/blog/hd-hidden-phosphorus-additives/': {
		episode: 'EP02',
		title: '【腎友】洗腎血磷高，肉和蛋還能吃嗎？',
		firstoryStoryId: 'cmx016v6i057i01utdme97vxp',
		youtubeId: 'XD2ViNCAntY',
	},
	'/blog/rural-ckd5-vascular-access-timing/': {
		episode: 'EP03',
		title: '【腎友】做瘻管，就要開始洗腎了嗎？',
		firstoryStoryId: 'cmx0d8xuq06ao01vgba130pjv',
		youtubeId: 'FtkvY3rKsNI',
	},
};

export function episodeForPath(pathname: string): PodcastEpisode | undefined {
	const p = pathname.endsWith('/') ? pathname : `${pathname}/`;
	return PODCAST_EPISODES[p];
}
