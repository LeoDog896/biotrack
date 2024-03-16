import type { PageServerLoad } from './$types';
import { apiFetch } from '$lib/server/localFetch';


const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

/** a stream of join events */
const stream = await apiFetch('/game/1/queue');

const reader = stream.body!.on('data', (chunk) => {
	console.log(chunk.toString());
});

export const load: PageServerLoad = async () => {
	return {
		number: random(1, 5)
	};
};
