<script lang="ts">
	import dayjs from "dayjs";

	interface Props {
		value: Date;
	}

	const { value }: Props = $props();
</script>

<time class="text-sm text-muted-foreground" datetime={value.toISOString()}>
	{dayjs(value).format("MMM DD, YYYY")}
</time>
