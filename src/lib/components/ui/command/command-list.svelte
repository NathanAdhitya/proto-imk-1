<script lang="ts">
	import * as CommandPrimitive from '$lib/cmdk';
	import { cn } from '$lib/utils.js';

	type $$Props = CommandPrimitive.ListProps;
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<CommandPrimitive.List
	class={cn('max-h-[300px] overflow-y-auto overflow-x-hidden', className)}
	{...$$restProps}
>
	<slot />
</CommandPrimitive.List>
