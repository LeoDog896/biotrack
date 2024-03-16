import { joinRequestEvent } from '$lib/server/joinRequests.js';
import type { JoinRequest } from '@prisma/client';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	let listener: (request: JoinRequest) => void;

	const readable = new ReadableStream({
		start(ctr) {
			listener = (event: JoinRequest) => {
				if (event.gameId !== parseInt(params.id)) return;

				ctr.enqueue(JSON.stringify(event));
			};

			joinRequestEvent.on(listener);
		},
		cancel() {
			if (listener) joinRequestEvent.off(listener);
		}
	});

	return new Response(readable, {
		headers: {
			'Cache-Control': 'no-cache',
			'content-type': 'text/event-stream'
		}
	});
};
