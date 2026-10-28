<script lang="ts">
	import dayjs from "dayjs";
	import relativeTime from "dayjs/plugin/relativeTime";

	dayjs.extend(relativeTime);

	interface Props {
		value: Date;
		relative?: boolean;
	}

	const { value, relative = false }: Props = $props();
</script>

<time
	class="text-sm whitespace-nowrap text-muted-foreground tabular-nums"
	datetime={value.toISOString()}
	title={dayjs(value).format("MMMM D, YYYY [at] h:mm A")}
>
	{relative ? dayjs(value).fromNow() : dayjs(value).format("MMM D, YYYY")}
</time>
