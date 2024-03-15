import { joinRequestEvent } from '$lib/server/joinRequests.js';
import type { JoinRequest } from '@prisma/client';

export const GET = async ({ params }) => {
	let listener: (request: JoinRequest) => void;

	const readable = new ReadableStream({
		start(ctr) {
			listener = (event: JoinRequest) => {
				if (event.gameId !== parseInt(params.id))
					return;
				
				ctr.enqueue(JSON.stringify(event));
			};

			joinRequestEvent.on(listener);
		},
		cancel() {
			if (listener)
				joinRequestEvent.off(listener);
		}
	});

	return new Response(readable, {
		headers: {
			'Cache-Control': 'no-cache',
			'content-type': 'text/event-stream'
		}
	})
};
