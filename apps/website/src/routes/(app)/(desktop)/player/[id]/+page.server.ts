import { prisma } from '$lib/prismaConnection';
import { validateSession } from '$lib/server/validateSession.js';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const user = await prisma.user.findUnique({
		where: {
			id: params.id,
			archived: false
		}
	});

	if (!user) {
		error(404, 'User not found');
	}

	const scoreBlocks = await prisma.scoreBlock.findMany({
		where: {
			userId: user.id
		}
	});

	const score = scoreBlocks.reduce((acc, block) => acc + block.score, 0);

	return {
		user,
		score,
		sessions: await prisma.session.findMany({
			where: {
				user: {
					some: {
						id: user.id
					}
				}
			}
		}),
		joinRequests: await prisma.joinRequest.count({
			where: {
				userId: user.id
			}
		}),
		activeJoinRequest: await prisma.joinRequest.count({
			where: {
				userId: user.id,
				acknowledged: false,
				terminated: false,
				linkedJoinRequest: {
					is: null
				}
			}
		}),
		games: await prisma.game.findMany()
	};
};

export const actions = {
	name: async ({ request, params, cookies }) => {
		await validateSession(cookies);

		const data = await request.formData();
		const name = data.get('name');

		if (!name) {
			error(400, { message: 'Name not specified' });
		}

		if (typeof name !== 'string') {
			error(400, { message: 'Name must be a string' });
		}

		const player = await prisma.user.findUnique({
			where: {
				id: params.id,
				archived: false
			}
		});

		if (!player) {
			error(404, 'Player not found');
		}

		await prisma.user.update({
			where: {
				id: params.id
			},
			data: {
				name
			}
		});

		return {
			success: true,
			message: 'Name updated'
		};
	},
	archive: async ({ params, cookies }) => {
		await validateSession(cookies);

		const user = await prisma.user.findUnique({
			where: {
				id: params.id,
				archived: false
			}
		});

		if (!user) {
			error(404, 'User not found');
		}

		await prisma.user.update({
			where: {
				id: params.id
			},
			data: {
				archived: true
			}
		});

		return {
			success: true,
			message: 'Player archived'
		};
	},
	join: async ({ request, params, cookies }) => {
		const officer = await validateSession(cookies);

		const user = await prisma.user.findUnique({
			where: {
				id: params.id,
				archived: false
			}
		});

		if (!user) {
			error(404, 'User not found');
		}

		const data = await request.formData();
		const gameId = data.get('gameId');

		if (!gameId) {
			error(400, { message: 'Game not specified' });
		}

		if (typeof gameId !== 'string') {
			error(400, { message: 'Game ID must be a string' });
		}

		const game = await prisma.game.findUnique({
			where: {
				id: parseInt(gameId)
			}
		});

		if (!game) {
			error(404, 'Game not found');
		}

		const joinRequest = await prisma.joinRequest.create({
			data: {
				userId: user.id,
				gameId: game.id,
				forceSentId: officer.id
			}
		});

		return {
			success: true,
			message: 'Join request sent',
			joinRequest
		};
	}
};
