import { prisma } from '$lib/prismaConnection';
import { json } from '@sveltejs/kit';

export const GET = async ({ params }) => {
	const game = await prisma.game.findUnique({
		where: {
			id: parseInt(params.id)
		}
	});

	if (!game) {
		error(400, 'Game not found');
	}

	const joinRequests = await prisma.joinRequest.findMany({
		where: {
			gameId: parseInt(params.id)
		}
	});

	return json({
		joinRequests
	});
};
