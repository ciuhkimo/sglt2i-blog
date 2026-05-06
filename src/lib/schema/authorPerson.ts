/**
 * Canonical Person object for nephrodecisions.com (筆名「小鎮醫生」)
 * Used across all layouts (NoteLayout, PatientLayout, etc.) and pages
 * (about, index, editorial-policy) to maintain schema entity consistency.
 *
 * Decisions (2026-05-06)：
 * - 筆名維持「小鎮醫生」
 * - 不寫 affiliation（避免被誤判為現職機構關係）
 * - 學歷用 alumniOf（schema.org 正確語意）
 * - 腎臟科專科認證用 hasCredential（recognizedBy 台灣腎臟醫學會）
 * - 加 @id 讓多頁 Person 引用視為同一實體
 *
 * 完整 rationale 見 vault `docs/seo/nephrodecisions_analytics_setup.md`。
 */
export const authorPerson = {
	'@type': 'Person',
	'@id': 'https://nephrodecisions.com/about/#person',
	name: '小鎮醫生',
	jobTitle: ['腎臟科專科醫師', '內科專科醫師'],
	nationality: {
		'@type': 'Country',
		name: 'Taiwan',
	},
	alumniOf: {
		'@type': 'EducationalOrganization',
		name: '台灣大學醫學系',
	},
	hasCredential: {
		'@type': 'EducationalOccupationalCredential',
		credentialCategory: 'Professional Certification',
		name: '腎臟科專科醫師',
		recognizedBy: {
			'@type': 'Organization',
			name: '台灣腎臟醫學會',
		},
	},
	knowsAbout: [
		'慢性腎臟病',
		'血液透析',
		'腹膜透析',
		'SGLT2 inhibitors',
		'GLP-1 receptor agonists',
		'Finerenone',
		'電解質失衡',
		'高血壓',
	],
	description: '台灣腎臟科專科醫師、內科專科醫師。Nephro Decisions 創辦人，以實證為基礎的腎臟科臨床決策知識庫。',
	url: 'https://nephrodecisions.com/about/',
	worksFor: { '@id': 'https://nephrodecisions.com/#organization' },
} as const;

/**
 * Short reference to authorPerson, for use in Article schema's
 * author / reviewedBy fields when the full Person is defined elsewhere
 * on the page (typically in @graph).
 */
export const authorPersonRef = {
	'@id': authorPerson['@id'],
} as const;
