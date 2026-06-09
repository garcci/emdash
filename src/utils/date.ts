/**
 * Format a date to Chinese locale string.
 * @param date Date to format
 * @param opts.month 'long' (default) or 'short'
 * @returns formatted string or null if date is invalid
 */
export function formatDate(
	date: Date | null | undefined,
	{ month = "long" }: { month?: "long" | "short" } = {}
): string | null {
	if (!date) return null;
	return date.toLocaleDateString("zh-CN", {
		year: "numeric",
		month,
		day: "numeric",
	});
}
