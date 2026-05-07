<script lang="ts">
	import { postComponents } from "$lib/post-components";
	import type { Post } from "$lib/server/db/schema";

	interface Fragment {
		id: string;
		html?: string;
		component?: string;
	}

	interface Props {
		post: Post;
	}

	const { post }: Props = $props();

	const id = () => crypto.randomUUID();

	const fragments = $derived.by(() => {
		const regex = /<div\s+data-component="([^"]+)"\s*><\/div>/g;

		const result: Fragment[] = [];
		const content = post.content;

		let last = 0;
		let match: RegExpExecArray | null;

		while ((match = regex.exec(content))) {
			if (match.index > last) {
				result.push({
					id: id(),
					html: content.slice(last, match.index),
				});
			}

			result.push({ id: id(), component: match[1] });
			last = match.index + match[0].length;
		}

		if (last < content.length) {
			result.push({ id: id(), html: content.slice(last) });
		}

		return result;
	});
</script>

<div data-content data-category={post.category}>
	{#each fragments as fragment (fragment.id)}
		{@const Component = postComponents[fragment.component ?? "_null"]}

		{#if fragment.html}
			{@html fragment.html}
		{:else if Component}
			<Component {post} />
		{/if}
	{/each}
</div>
