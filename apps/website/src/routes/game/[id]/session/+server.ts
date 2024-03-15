import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prismaConnection';
import { error } from 'console';
import { validateGame } from '$lib/server/validateGame';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const game = await validateGame(params.id);

	const session = await prisma.session.findFirst({
		where: {
			gameId: game.id,
			active: true
		}
	});

	if (!session) {
		error(404, 'No active sessions found.');
	}

	return json({
		session
	});
};
