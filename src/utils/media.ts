/**
 * Resolve a featured_image value to a displayable image URL.
 * Handles both local (provider: "local") and external (provider: "external-url") images.
 */
export function resolveImageUrl(image: unknown): string | undefined {
	if (!image || typeof image !== "object") return undefined;
	const img = image as Record<string, unknown>;

	// External image: use previewUrl directly
	if (img.provider === "external-url") {
		const previewUrl = img.previewUrl;
		if (typeof previewUrl === "string" && previewUrl) {
			return previewUrl;
		}
	}

	// Local image: build from meta.storageKey
	const meta = img.meta as Record<string, unknown> | undefined;
	const storageKey =
		typeof meta?.storageKey === "string" && meta.storageKey
			? meta.storageKey
			: typeof img.id === "string" && img.id
				? img.id
					: undefined;
	if (storageKey) {
		return `/_emdash/api/media/file/${storageKey}`;
	}

	return undefined;
}

/**
 * Check if an image is an external (third-party) image.
 */
export function isExternalImage(image: unknown): boolean {
	if (!image || typeof image !== "object") return false;
	return (image as Record<string, unknown>).provider === "external-url";
}
