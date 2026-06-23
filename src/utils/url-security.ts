/**
 * Sanitize a search snippet from EmDash FTS to allow only <mark> tags.
 * Removes any other HTML tags and attributes to prevent XSS.
 */
export function sanitizeSearchSnippet(snippet: string): string {
	// First, temporarily encode any literal &lt; or &gt; to avoid issues
	let sanitized = snippet;

	// Allow only <mark> and </mark> tags — strip everything else
	// This approach: replace allowed tags with placeholders, strip all tags, restore allowed ones
	sanitized = sanitized
		.replace(/<mark\b[^>]*>/gi, "\x00MARK_OPEN\x00")
		.replace(/<\/mark>/gi, "\x00MARK_CLOSE\x00");

	// Strip any remaining HTML tags
	sanitized = sanitized.replace(/<[^>]+>/g, "");

	// Restore allowed tags
	sanitized = sanitized
		.replace(/\x00MARK_OPEN\x00/g, "<mark>")
		.replace(/\x00MARK_CLOSE\x00/g, "</mark>");

	return sanitized;
}

/**
 * Validate that a URL is safe for use in href/src attributes.
 * Blocks javascript:, data:, vbscript: and other dangerous pseudo-protocols.
 */
export function isSafeUrl(url: string): boolean {
	if (!url || typeof url !== "string") return false;
	const trimmed = url.trim().toLowerCase();
	if (!trimmed) return false;

	// Block dangerous pseudo-protocols
	const dangerousProtocols = [
		"javascript:",
		"data:",
		"vbscript:",
		"file:",
		"about:",
		"mocha:",
		"livescript:",
	];
	for (const protocol of dangerousProtocols) {
		if (trimmed.startsWith(protocol)) return false;
	}

	return true;
}

/**
 * Get a safe URL for use in href/src, returning a fallback if unsafe.
 */
export function safeUrl(url: string, fallback: string = "/"): string {
	return isSafeUrl(url) ? url : fallback;
}
