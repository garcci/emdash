/**
 * Build table of contents from article headings and set up scroll-based highlighting.
 */
export function buildToc() {
	const content = document.querySelector(".article-content");
	const tocContainer = document.getElementById("toc-content");
	if (!content || !tocContainer) return;

	const headings = content.querySelectorAll("h2, h3");
	if (headings.length === 0) {
		const toc = document.querySelector(".toc") as HTMLElement | null;
		if (toc) toc.style.display = "none";
		return;
	}

	const list = document.createElement("ul");
	list.className = "toc-list";

	headings.forEach((heading, index) => {
		if (!heading.id) {
			heading.id = `heading-${index}`;
		}

		const li = document.createElement("li");
		li.className =
			heading.tagName === "H3" ? "toc-item toc-item--nested" : "toc-item";

		const link = document.createElement("a");
		link.href = `#${heading.id}`;
		link.className = "toc-link";
		link.textContent = heading.textContent;

		li.appendChild(link);
		list.appendChild(li);
	});

	tocContainer.appendChild(list);

	// Highlight current section on scroll
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				const id = entry.target.id;
				const link = tocContainer.querySelector(`a[href="#${id}"]`);
				if (link) {
					if (entry.isIntersecting) {
						tocContainer
							.querySelectorAll(".toc-link")
							.forEach((l) => l.classList.remove("active"));
						link.classList.add("active");
					}
				}
			});
		},
		{ rootMargin: "-80px 0px -80% 0px" },
	);

	headings.forEach((heading) => observer.observe(heading));
}
