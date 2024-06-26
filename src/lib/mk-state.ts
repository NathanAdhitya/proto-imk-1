import { get, writable, type Writable } from 'svelte/store';
import type { MataKuliah } from './mata-kuliah';
import { properCase } from './mk-utils';
import { notEmpty } from './utils';
import { sleep } from './internal/helpers/sleep';

export interface MataKuliahWithColor extends MataKuliah {
	colorClasses: string;
}

export type ChosenMatkulStore = Writable<MataKuliahWithColor[]>;
export type ChosenClassesStore = Writable<Record<MataKuliah['kode'], string[]>>;

export const chosenMatkul: ChosenMatkulStore = writable([]);
export const chosenClasses: ChosenClassesStore = writable({});
export const prsSubmitted = writable(false);
export const chosenJurusanFilters = writable<string[]>(['Informatika', 'DMU']);

export class ChosenMatkulUtils {
	static sksLimit = 24;
	static matkulLimit = 12;

	static matkulColorClasses = [
		'bg-blue-200',
		'bg-green-200',
		'bg-yellow-200',
		'bg-red-200',
		'bg-purple-200',
		'bg-pink-200',
		'bg-indigo-200',
		'bg-cyan-200',
		'bg-teal-100',
		'bg-lime-200',
		'bg-orange-200',
		'bg-violet-200'
	];

	static availableColors = new Set(this.matkulColorClasses);

	static reset() {
		chosenMatkul.set([]);
		this.availableColors = new Set(this.matkulColorClasses);
	}

	static has(matkul: MataKuliah | MataKuliahWithColor) {
		if (!('colorClasses' in matkul)) return get(chosenMatkul).some((m) => m.kode === matkul.kode);
		return get(chosenMatkul).includes(matkul);
	}

	/**
	 * Toggle a matkul
	 */
	static toggle(matkul: MataKuliah | MataKuliahWithColor) {
		if (this.has(matkul)) {
			return this.remove(matkul);
		} else {
			return this.add(matkul);
		}
	}

	static add(matkul: MataKuliah) {
		const $chosenMatkul = get(chosenMatkul);
		if (
			$chosenMatkul.length < this.matkulLimit &&
			$chosenMatkul.reduce((acc, matkul) => acc + matkul.sks, 0) + matkul.sks <= this.sksLimit
		) {
			// Find a color
			const color = this.availableColors.values().next().value;
			if (!color) return false;

			// Remove the color from the available colors
			this.availableColors.delete(color);

			chosenMatkul.update(($chosenMatkul) => {
				return [{ ...matkul, colorClasses: color }, ...$chosenMatkul];
			});

			return true;
		}

		return false;
	}

	/**
	 * Remove a matkul
	 */
	static remove(matkul: MataKuliah | MataKuliahWithColor | string) {
		chosenMatkul.update(($chosenMatkul) => {
			const kode = typeof matkul === 'string' ? matkul : matkul.kode;
			const removed = $chosenMatkul.find((m) => m.kode === kode);

			// Return the colors
			if (removed) this.availableColors.add(removed.colorClasses);

			return $chosenMatkul.filter((m) => m.kode !== kode);
		});

		return true;
	}
}

export class ChosenClassesUtils {
	static reset() {
		chosenClasses.set({});
	}

	/**
	 * Trims the chosen classes to the maximum plan amount
	 */
	static trimPlans(kode: MataKuliah['kode'], max: number) {
		chosenClasses.update((classes) => {
			if (!classes[kode]) {
				return classes;
			}

			classes[kode] = classes[kode].slice(0, max);
			return classes;
		});
	}

	/**
	 * Set the chosen classes for a specific plan
	 */
	static setPlan(
		kode: MataKuliah['kode'],
		plan: number,
		kelas: MataKuliah['kelas'][number]['kelas']
	) {
		chosenClasses.update((classes) => {
			if (!classes[kode]) {
				classes[kode] = [];
			}
			classes[kode][plan] = kelas;
			return classes;
		});
	}

	/**
	 * Delete a plan from the chosen classes
	 */
	static removePlan(kode: MataKuliah['kode'], plan: number) {
		chosenClasses.update((classes) => {
			if (!classes[kode]) {
				return classes;
			}
			classes[kode].splice(plan, 1);

			return classes;
		});
	}

	/**
	 * Validate the chosen classes
	 */
	static async validate() {
		/**
		 * Things to check:
		 * 1. The same class within the same matkul must not be chosen in more than one plan (fatal)
		 * 2. A matkul is taken, but not a single class is chosen (fatal)
		 * 3. There should not be a single collision within each plan/priority (warning)
		 */
		const messages: {
			type: 'info' | 'warning' | 'fatal';
			message: string;
		}[] = [];

		const $chosenClasses = get(chosenClasses);
		const $chosenMatkul = get(chosenMatkul);

		// Check for the first condition
		const classes = Object.entries($chosenClasses);

		const classesWithKode = classes
			.map(([kode, plans]) => {
				const matkul = $chosenMatkul.find((m) => m.kode === kode);
				if (!matkul) return;
				return { kode, matkul, plans };
			})
			.filter(notEmpty);

		classesWithKode.forEach(({ matkul, plans }) => {
			if (!matkul) return;

			const classes = plans.flat();
			const uniqueClasses = new Set(classes);

			if (uniqueClasses.size !== classes.length) {
				messages.push({
					type: 'fatal',
					message: `Kelas yang sama digunakan dalam prioritas yang berbeda pada mata kuliah ${properCase(matkul.nama)}`
				});
			}
		});

		// Check for the second condition
		$chosenMatkul.forEach((matkul) => {
			if (!classesWithKode.find((m) => m.kode === matkul.kode)) {
				messages.push({
					type: 'fatal',
					message: `Mata kuliah ${properCase(matkul.nama)} harus memiliki setidaknya satu kelas yang dipilih`
				});
			}
		});

		// Check if any class is even chosen
		if (classesWithKode.length === 0) {
			messages.push({
				type: 'fatal',
				message: 'Tidak ada mata kuliah yang dipilih'
			});
		}

		await sleep(2000);
		return messages;
	}
}
