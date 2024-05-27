<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';

	import CircleUser from 'lucide-svelte/icons/circle-user';
	import Home from 'lucide-svelte/icons/home';
	import LineChart from 'lucide-svelte/icons/line-chart';
	import Menu from 'lucide-svelte/icons/menu';
	import Package from 'lucide-svelte/icons/package';
	import Package2 from 'lucide-svelte/icons/package-2';
	import Search from 'lucide-svelte/icons/search';
	import ShoppingCart from 'lucide-svelte/icons/shopping-cart';
	import Users from 'lucide-svelte/icons/users';
</script>

<header
	class="flex h-16 items-center gap-4 border-b-4 border-b-[#a9a9a9] bg-slate-50 px-4 py-2 lg:h-[60px] lg:px-6"
>
	<Sheet.Root>
		<Sheet.Trigger asChild let:builder>
			<Button variant="outline" size="icon" class="shrink-0 md:hidden" builders={[builder]}>
				<Menu class="h-5 w-5" />
				<span class="sr-only">Toggle navigation menu</span>
			</Button>
		</Sheet.Trigger>
		<Sheet.Content side="left" class="flex flex-col">
			<nav class="grid gap-2 text-lg font-medium">
				<a href="##" class="flex items-center gap-2 text-lg font-semibold">
					<Package2 class="h-6 w-6" />
					<span class="sr-only">Acme Inc</span>
				</a>
				<a
					href="##"
					class="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
				>
					<Home class="h-5 w-5" />
					Dashboard
				</a>
				<a
					href="##"
					class="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
				>
					<ShoppingCart class="h-5 w-5" />
					Orders
					<Badge class="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
						6
					</Badge>
				</a>
				<a
					href="##"
					class="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
				>
					<Package class="h-5 w-5" />
					Products
				</a>
				<a
					href="##"
					class="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
				>
					<Users class="h-5 w-5" />
					Customers
				</a>
				<a
					href="##"
					class="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
				>
					<LineChart class="h-5 w-5" />
					Analytics
				</a>
			</nav>
		</Sheet.Content>
	</Sheet.Root>
	<div class="w-full flex-1">
		<form>
			<div class="relative">
				<Search class="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					type="search"
					placeholder="Cari halaman..."
					class="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
				/>
			</div>
		</form>
	</div>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger asChild let:builder>
			<Button
				builders={[builder]}
				variant="secondary"
				class="h-full rounded-xl bg-neutral-200/80 hover:bg-neutral-300"
			>
				<div class="flex items-center gap-2 align-middle">
					<div class="text-right leading-4">
						<p>Nama</p>
						<p class="text-xs text-muted-foreground">NRP</p>
					</div>
					<CircleUser class="h-8 w-8" />
				</div>
				<span class="sr-only">Toggle user menu</span>
			</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end">
			<DropdownMenu.Label>Nama</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<DropdownMenu.Item>Biodata</DropdownMenu.Item>
			<DropdownMenu.Item>Butuh bantuan?</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<DropdownMenu.Item>Logout</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</header>