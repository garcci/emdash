/**
 * Focus the search input when ⌘K / Ctrl+K is pressed.
 */
export function initSearchShortcut() {
	document.addEventListener("keydown", (e) => {
		if ((e.metaKey || e.ctrlKey) && e.key === "k") {
			e.preventDefault();
			const searchInput = document.querySelector(
				".site-search-input",
			) as HTMLInputElement;
			if (searchInput) {
				searchInput.focus();
			}
		}
	});
}
