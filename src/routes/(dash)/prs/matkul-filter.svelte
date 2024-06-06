<script context="module" lang="ts">
	import type { MatkulOption } from './+page.svelte';
	export type FilterFunction = (m: MatkulOption) => boolean;
</script>

<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Popover from '$lib/components/ui/popover';
	import { Check, Info, SlidersHorizontal } from 'lucide-svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';

	import * as Command from '$lib/components/ui/command/index.js';
	import { Separator } from '$lib/components/ui/separator';
	import { Switch } from '$lib/components/ui/switch';
	import { cn } from '$lib/utils';
	import { fade } from 'svelte/transition';
	import { tick } from 'svelte';

	export let listJurusan: string[];
	export let disabled: boolean;
	export let filterFunction: FilterFunction;

	let rekomFilter = false;
	let chosenFilters: string[] = ['Informatika'];

	let displayTooltips = false;
	let open = false;

	// Workaround for the tooltip showing up with the popover.
	$: {
		if (open) {
			tick().then(() => {
				displayTooltips = true;
			});
		} else {
			displayTooltips = false;
		}
	}

	$: filterFunction = rekomFilter
		? (m) => m.recommended === true
		: (m) => chosenFilters.includes(m.reference.unit);
</script>

<div class="absolute right-0 top-0 m-0.5">
	<Popover.Root bind:open>
		<Popover.Trigger asChild let:builder>
			<Button builders={[builder]} variant="outline" size="icon">
				<SlidersHorizontal class="h-5 w-5" />
			</Button>
		</Popover.Trigger>
		<Popover.Content strategy="fixed" side="right-start" sideOffset={4}>
			<h2 class="text-lg font-semibold">Filter mata kuliah</h2>
			<Separator />
			<div class="flex items-center justify-between gap-2">
				<h3 class="my-4 font-semibold">Rekomendasi</h3>
				{#if displayTooltips}
					<div class="mr-auto flex items-center justify-center">
						<Tooltip.Root openDelay={0}>
							<Tooltip.Trigger>
								<Info class="h-4 w-4 opacity-50" />
							</Tooltip.Trigger>
							<Tooltip.Content side="right" strategy="fixed" class="max-w-sm">
								Mata kuliah rekomendasi adalah mata kuliah yang belum Anda ambil dan
								direkomendasikan sesuai dengan jurusan dan semester Anda.
							</Tooltip.Content>
						</Tooltip.Root>
					</div>
				{:else}
					<div class="h-4 w-4"></div>
				{/if}
				<Switch bind:checked={rekomFilter} />
			</div>
			<Command.Root>
				<Command.Input placeholder="Cari jurusan" />
				<Command.Empty>Jurusan tidak ditemukan...</Command.Empty>
				<div class="max-h-72 overflow-y-auto">
					{#each listJurusan as jurusan}
						<Command.Item
							value={jurusan}
							onSelect={() => {
								if (!disabled) {
									// either remove or add
									if (chosenFilters.includes(jurusan)) {
										chosenFilters = chosenFilters.filter((item) => item !== jurusan);
									} else {
										chosenFilters = [...chosenFilters, jurusan];
									}
								}
							}}
						>
							<span>
								{jurusan}
							</span>
							<Check
								class={cn(
									'ml-auto mr-2 h-4 w-4',
									!chosenFilters.includes(jurusan) && 'text-transparent'
								)}
							/>
						</Command.Item>
					{/each}
				</div>
			</Command.Root>
		</Popover.Content>
	</Popover.Root>
</div>