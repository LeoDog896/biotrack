import { prisma } from '$lib/prismaConnection';
import { validateGame } from '$lib/server/validateGame';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '../$types';

export const GET: RequestHandler = async ({ params }) => {
	await validateGame(params.id);

	const joinRequests = await prisma.joinRequest.findMany({
		where: {
			gameId: parseInt(params.id)
		}
	});

	return json({
		joinRequests
	});
};
