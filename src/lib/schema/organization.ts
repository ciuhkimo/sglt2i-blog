/**
 * Canonical Organization object for nephrodecisions.com
 *
 * Used in:
 * - WebSite.publisher (homepage)
 * - Article.publisher (each Article page via @id reference)
 * - Person.worksFor (in authorPerson.ts)
 *
 * Decisions (2026-05-06)：
 * - publisher 改為 Organization 不是 Person（Google Article structured data 偏好）
 * - 透過 @id 跨頁建立統一實體
 * - founder 反向連回 authorPerson 形成 graph 完整性
 */
export const organization = {
	'@type': 'Organization',
	'@id': 'https://nephrodecisions.com/#organization',
	name: 'Nephro Decisions',
	url: 'https://nephrodecisions.com/',
	description: '腎臟科臨床決策知識庫——從實證到實務，涵蓋藥物決策、透析照護與病人衛教。',
	founder: { '@id': 'https://nephrodecisions.com/about/#person' },
	publishingPrinciples: 'https://nephrodecisions.com/editorial-policy/',
} as const;

/**
 * Short reference to Organization, for use in @graph or as a property value
 * where the full Organization is defined elsewhere on the page.
 */
export const organizationRef = {
	'@id': organization['@id'],
} as const;
