import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prismaConnection';
import { error } from 'console';

export const GET = async ({ params }) => {
	const game = await prisma.game.findUnique({
		where: {
			id: parseInt(params.id)
		}
	});

	if (!game) {
		error(400, 'Game not found');
	}

	const session = await prisma.session.findFirst({
		where: {
			gameId: parseInt(params.id),
			active: true
		}
	});

	if (!session) {
		error(404, 'No active sessions found.');
	}

	return json({
		session
	})
};
