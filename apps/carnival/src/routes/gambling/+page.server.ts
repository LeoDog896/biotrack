import type { PageServerLoad } from './$types';

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

/** a stream of join events */
const stream = await fetch('/game/1/stream');

if (!stream.body) {
	throw new Error('No stream body');
}

stream.body.pipeThrough(new TextDecoderStream()).pipeTo(
	new WritableStream({
		write(chunk) {
			console.log(chunk);
		}
	})
);

export const load: PageServerLoad = async () => {
	return {
		number: random(1, 5)
	};
};
