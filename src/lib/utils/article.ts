export function getFirstParagraphs(html: string, count: number): string {
	const matches = html.match(/<p[\s\S]*?<\/p>/gi) ?? [];
	return matches.slice(0, count).join('');
}
