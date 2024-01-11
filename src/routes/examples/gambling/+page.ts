import type { PageLoad } from './$types';

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const load: PageLoad = async () => {
	return {
		number: random(1, 5)
	};
};
