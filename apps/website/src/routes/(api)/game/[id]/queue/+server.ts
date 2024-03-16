import { joinRequestEvent } from '$lib/server/joinRequests.js';
import type { JoinRequest } from '@prisma/client';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/prismaConnection';

export const GET: RequestHandler = async ({ params }) => {
	let listener: (request: JoinRequest) => void;

	const readable = new ReadableStream({
		async start(ctr) {
			// find all existing join requests that have not been acknowledged
			const joinRequests = await prisma.joinRequest.findMany({
				where: {
					gameId: parseInt(params.id),
					acknowledged: false,
					terminated: false,
					linkedJoinRequest: {
						is: null
					}
				}
			});

			// send all existing join requests to the client
			joinRequests.forEach((request) => {
				ctr.enqueue(JSON.stringify(request) + '\n');
			});

			listener = (event: JoinRequest) => {
				if (event.gameId !== parseInt(params.id)) return;

				ctr.enqueue(JSON.stringify(event) + '\n');
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
			'Content-Type': 'application/x-ndjson'
		}
	});
};
