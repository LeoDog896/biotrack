import { json } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { prisma } from '$lib/prismaConnection.js';
import type { RequestHandler } from './$types';
import { validateGame } from '$lib/server/validateGame';
import { joinRequestEvent } from '$lib/server/joinRequests';

export const POST: RequestHandler = async ({ params, url }) => {
	const userId = url.searchParams.get('user');

	if (!userId) {
		error(400, 'User ID not specified');
	}

	const game = await validateGame(params.id);

	const user = await prisma.user.findUnique({
		where: {
			id: userId,
			archived: false
		}
	});

	if (!user) {
		error(400, 'User not found');
	}

	const existingJoinRequest = await prisma.joinRequest.findFirst({
		where: {
			game: {
				id: game.id
			},
			user: {
				id: user.id
			},
			acknowledged: false,
			terminated: false,
			linkedJoinRequest: {
				is: null
			}
		}
	});

	const joinRequest = await prisma.joinRequest.create({
		data: {
			gameId: game.id,
			userId: user.id
		}
	});

	if (existingJoinRequest) {
		await prisma.linkedJoinRequest.create({
			data: {
				nextJoinRequestId: joinRequest.id
			}
		});
	}

	joinRequestEvent.emit(joinRequest);

	return json(
		{
			joinRequest,
			cancelsExisting: !!existingJoinRequest
		},
		{
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Headers': 'Content-Type',
				'Access-Control-Allow-Methods': 'POST'
			}
		}
	);
};

export const OPTIONS = async () => {
	return new Response(null, {
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers': 'Content-Type',
			'Access-Control-Allow-Methods': 'POST'
		}
	});
};
