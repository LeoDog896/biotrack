import type { PageServerLoad } from './$types';
import fetch from 'node-fetch';
import https from 'node:https';

const httpsAgent = new https.Agent({
	// since we're scanning localhost, we can ignore the self-signed certificate
	rejectUnauthorized: false
});

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

/** a stream of join events */
const stream = await fetch('https://localhost:5000/game/1/queue', {
	agent: httpsAgent
});

const reader = stream.body!.on('data', (chunk) => {
	console.log(chunk.toString());
});



export const load: PageServerLoad = async () => {
	return {
		number: random(1, 5)
	};
};
