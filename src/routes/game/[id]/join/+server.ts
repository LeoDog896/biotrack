import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prismaConnection.js';

export const POST = async ({ params, url }) => {
	const userId = url.searchParams.get('user');

	if (!userId) {
		return json({ error: 'User ID not specified' });
	}

	const game = await prisma.game.findUnique({
		where: {
			id: parseInt(params.id)
		}
	});

	if (!game) {
		return json({ error: 'Game not found' });
	}

	const user = await prisma.user.findUnique({
		where: {
			id: userId
		}
	});

	if (!user) {
		return json({ error: 'User not found' });
	}

	const joinRequest = await prisma.joinRequest.create({
		data: {
			gameId: game.id,
			userId: user.id
		}
	});

	return json(joinRequest);
};
